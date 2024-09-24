import prisma from '@/prisma'
import { Request, Response } from 'express'
import { sign, verify } from "jsonwebtoken";
import dotenv from "dotenv"
dotenv.config()

export const refreshToken = async (req:Request, res:Response) => {
    try {
        // mengambil value dari refresh token yang sudah di set di cookie
        const refreshToken = req.cookies.refreshToken
        // validasi jika tidak ada refresh token di cookie
        if (!refreshToken) throw "refresh token not found !"

        // cari user dengan membandingkan refresh token yang ada di cookie dengan refresh token yang ada di db
        const user = await prisma.users.findFirst({
            where:{refresh_token:refreshToken}
        })
        // validasi jika user tidak ditemukan
        if (!user) throw "user not found !"

        // verifikasi refresh token
        const verified = verify(refreshToken,process.env.REFRESH_TOKEN!)
        if (!verified) throw "refresh token not valid !"
        // membuat accesToken baru
        const payload = {id: user.id,username: user.username, email: user.email, role: user.role}
        const accessToken = sign(payload,process.env.SECRET_JWT!,{expiresIn: '15s'})
        // mengirimkan accesToken yang baru ke klien
        res.status(201).send({
            status: "ok",
            accessToken
        })
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error
        })
    }
}