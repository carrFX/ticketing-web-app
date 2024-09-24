import { Request, Response } from 'express';
import prisma from '@/prisma';
import {compare, genSalt, hash} from "bcrypt";
import { sign, verify } from "jsonwebtoken";
import dotenv from "dotenv"
dotenv.config()


export class UsersController {
  async registerUser(req:Request, res:Response) {
    const {username,email,password,role,referralBy} = req.body
    const now = new Date();
    const expDate = new Date(now.setMonth(now.getMonth() + 3));

    try {
      // validasi email dan username jika sudah digunakan
      const existingUsername = await prisma.users.findFirst({where: {username:username}})
      if (existingUsername) throw 'username already exists!'
      const existingEmail = await prisma.users.findUnique({where: {email:email}})
      if (existingEmail) throw 'email already exists!'
      // mencari users berdasarkan referral
      if(referralBy !== "") {
        const existingReferralBy = await prisma.users.findFirst({where: {referralTo:referralBy}})
        if(!existingReferralBy) throw "referral not found !"
        // menambahkan poin ke yang punya referral
        await prisma.point.create({
          data: {
            userId: existingReferralBy.id,
            points: 10000,
            expiresAt: expDate
          }
        })
      }
      // enkripsi password
      const salt = await genSalt(10)
      const hashPassword = await hash(password,salt)
      // membuat user baru
      const newUser = await prisma.users.create({
        data : {username,email,password: hashPassword,role,referralBy}
      })
      // menambahkan coupon ke yang menggunakan referral
      if(referralBy !== "") {
        await prisma.coupon.create({
          data : {
            userId: newUser.id,
            discount: 10,
            expiresAt: expDate
          }
        })
      }

      res.status(200).send({
        status: "success",
        message: "register user successfully",
        newUser
      })
    } catch (error) {
      res.status(400).send({
        status: "error",
        message: error
      })
    }
  }

  async loginUser(req:Request, res:Response){
    try {
      const { email, password } = req.body

      // mencari user berdasarkan email dan validasi jika email tidak ditemukan
      const existingUser = await prisma.users.findUnique({
          where: { email: email }
      })
      if (!existingUser) throw "user not found !"

      // validasi jika password yang di inputkan salah (compare)
      const isValidPass = await compare(password, existingUser!.password)
      if (!isValidPass) throw "incorrect password !"

      // membuat accessToken dan refreshToken jwt
      const payload = {id: existingUser.id,username: existingUser.username, email: existingUser.email, role: existingUser.role}
      const accessToken = sign(payload,process.env.SECRET_JWT!,{expiresIn: '20s'})
      const refreshToken = sign(payload,process.env.REFRESH_TOKEN!,{expiresIn: '1d'})
      // memasukan refresh token yang baru dibuat ke db
      await prisma.users.update({
        where: { id: existingUser.id },
        data: { refresh_token: refreshToken },
      });
      // membuat refresh token di httpOnly cookie (key,value,option)
      res.cookie("refreshToken",refreshToken, {
        httpOnly: true, // tidak dapat diakses dari client langsung
        maxAge: 24 * 60 * 60 * 1000, // expires dalam 1 hari
        // secure: true // jika menggunakan https
      })

      res.status(200).send({
        status: 'ok',
        message: "login success !",
        accessToken,
        refreshToken,
        author: existingUser
      })
    } catch (error) {
      res.status(400).send({
        status: "error",
        message: error
      })
    }
  }

  async logoutUser(req:Request, res:Response){
    try {
      // mengambil value dari token yang sudah di set di cookie (mengambil refresh token di cookie)
      const refreshToken = req.cookies.refreshToken
      // validasi jika tidak ada token di cookie (tidak ada refresh token)
      if (!refreshToken) throw "no user is logged in !"

      // cari user dengan membandingkan refresh token yang ada di cookie dengan refresh token yang ada di db
      const user = await prisma.users.findFirst({
          where:{refresh_token:refreshToken}
      })
      // validasi jika user tidak ditemukan
      if (!user) throw "user not found !"
      // set token yang ada di user DB berdasarkan id menjadi null (delete)
      await prisma.users.update({
        where: { id: user.id }, // di ID ini
        data: { refresh_token: null }, // refresh_token nya menjadi null
      })
      // menghapus refresh token di cookie
      res.clearCookie("refreshToken")

      res.status(201).send({
        status: "ok",
        message: "logout success !"
      })
    } catch (error) {
      res.status(400).send({
        status: "error",
        message: error
      })
    }
  }

  async getUsersData(req: Request, res: Response) {
    const usersData = await prisma.users.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
      }
    });

    return res.status(200).send({
      status: "success",
      usersData
    });
  }

  async getUsersDataById(req: Request, res: Response) {
    try {
      // mencari id user dari cookie
      const cookies = req.cookies.refreshToken
      if(!cookies) throw "no user is logged in !"
      const decoded = verify(cookies,process.env.REFRESH_TOKEN!) as { id: number };
      const userId = decoded.id

      // mencari semua userid(id) yang ada di table point
      const pointsUser = await prisma.point.findMany({where: {userId}})
      // menjumlahkan semua point yang ada
      const sumPoints = pointsUser.reduce((a, b) => a + b.points, 0);
      // mencari semua userid(id) yang ada di table coupon
      const couponUser = await prisma.coupon.findMany({where: {userId}})
      const sumCoupon = couponUser.length
      // mencari data user berdasarkan id
      const userData = await prisma.users.findFirst({
        where: { id: userId },
        select:{
          avatar: true,
          username: true,
          email: true,
          role: true,
          referralTo: true,
          saldo: true,
        }
      });

      if (!userData) throw "Data user not found"

      return res.status(200).send({
        status: "success",
        message: "successful get data by Id",
        data : {...userData, points: sumPoints, coupon: sumCoupon} // concat data user dan point
      });
    } catch (error) {
      return res.status(400).send({
        status : "error",
        message: error
      })
    }
  }

  async updateAvatar(req:Request, res:Response){
    try {
      const ava = req.file?.filename
      if(!ava) throw "File not found" 
      const linkAva = `http://localhost:8000/api/public/avatar/${ava}`
      // mencari id user dari cookie yang ingin edit avatar
      const cookies = req.cookies.refreshToken
      if(!cookies) throw "no user is logged in !"
      const decoded = verify(cookies,process.env.REFRESH_TOKEN!) as { id: number };
      const userId = decoded.id
      // mengupdate avatar dengan link yang baru
      await prisma.users.update({
        where: { id: userId },
        data: { avatar: linkAva },
      })

      const newDataUser = await prisma.users.findFirst({
        where: { id: userId },
      })
      return res.status(200).send({
        status: "success",
        message: "Edit avatar successfully",
        data: newDataUser
      });
    } catch (error) {
      if(error instanceof Error) {
        return res.status(400).send({
            status: "error",
            message: error.message
        })
      }
      res.status(400).send({
          status: "error",
          message: error
      })
    }
  }

  async deleteAvatar(req:Request, res:Response){
    try {
      // mencari id user dari cookie yang ingin edit avatar
      const cookies = req.cookies.refreshToken
      if(!cookies) throw "no user is logged in !"
      const decoded = verify(cookies,process.env.REFRESH_TOKEN!) as { id: number };
      const userId = decoded.id

      const newUserData = await prisma.users.update({
        where: {id: userId},
        data: {avatar : "https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png"}
      })

      res.status(200).send({
        status: "success",
        message: "delete avatar successfully",
        data: newUserData
      })
    } catch (error) {
      if(error instanceof Error) {
        return res.status(400).send({
            status: "error",
            message: error.message
        })
      }
      res.status(400).send({
          status: "error",
          message: error
      })
    }
  }

  async deleteDataUser(req:Request, res:Response){
    try {
      // mencari id user dari cookie
      const cookies = req.cookies.refreshToken
      if(!cookies) throw "no user is logged in !"
      const decoded = verify(cookies,process.env.REFRESH_TOKEN!) as { id: number };
      const userId = decoded.id

      if(!userId) throw "user not found"
      const userDeleted = await prisma.users.delete({
        where:{id:userId}
      })

      res.clearCookie("refreshToken")

      res.status(200).send({
        status: "success",
        message: "deleted user successfully",
        userDeleted
      })
    } catch (error) {
        res.status(400).send({
        status : "error",
        message: error
      })
    }
  }
}

