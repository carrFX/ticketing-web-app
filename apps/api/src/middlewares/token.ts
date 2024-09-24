import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

interface IUser {
    id: number,
    email: string,
    role: string
}

export const VerifyToken = (req:Request, res:Response, next:NextFunction) => {
    try {
        // mengambil token dari header
        const token = req.header("Authorization")?.replace("Bearer ", "")
        if (!token) throw "token empty !"
        // verifikasi token
        verify(token,process.env.SECRET_JWT!,(err, decoded) => {
            if (err) throw err.message
            // decode token (mengembalikan token ke bentuk aslinya )
            req.user = decoded as IUser
        })

        next()
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error
        })
    }
}

export const CheckRole = async (req:Request, res:Response, next:NextFunction) => {
    try {
        if (req.user?.role !== "seller" ) throw "Unauthorized!"
        next()
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error
        })
    }
}
