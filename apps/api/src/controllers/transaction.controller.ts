import prisma from "@/prisma"
import { Request, Response } from "express"
import { JwtPayload, verify } from "jsonwebtoken"

export class TransactionController {
    async buyTickets(req:Request, res:Response) {
        try {
            const { eventId, useCoupon, usePoint, roleTicket } = req.body
            const sumBuying = 1
            // user tersebut mau membeli tiket apa ?
            const titleTicket = await prisma.tickets.findFirst({
                where: { eventId: eventId, roleTicket: roleTicket }
            })
            if(!titleTicket) throw "Ticket not found"
            // mendeklarasikan pencarian harga awal tiket
            let tiketPrice = titleTicket!.price
            // cek apakah tiket masih ada
            if(titleTicket?.quantity == 0) throw "Ticket are sold out"
            // mencari user id yang mau beli
            const cookieOrganizer = req.cookies.refreshToken
            const decoded = verify(cookieOrganizer,process.env.REFRESH_TOKEN!) as JwtPayload;
            const newUsernameBuyer = decoded.username
            const newUserId = decoded.id
            // mencari saldo user
            const buyer = await prisma.users.findFirst({
                where: { id: newUserId },
                select: {saldo: true}
            })
            const saldoBuyer = buyer!.saldo
            if(saldoBuyer < tiketPrice) throw "Your balance cannot be less than the initial price"
            if(saldoBuyer < tiketPrice * sumBuying) throw "your balance is insufficient"
            // apakah user tersebut membeli menggunakan coupon
            if(useCoupon) {
                // apakah user mempunyai coupon
                const totalCoupon = await prisma.coupon.count({
                    where: { userId: newUserId }
                })
                if (totalCoupon == 0) throw "You don't have a coupon"
                if (totalCoupon < sumBuying) throw "You don't have enough coupon"
                // mengurangi harga tiket 10%
                const newDiscountCoupon = await prisma.tickets.update({
                    where: { id: titleTicket!.id },
                    data: { price: titleTicket!.price * 0.9 }
                })
                if(newDiscountCoupon.price < 0) {
                    await prisma.tickets.update({
                        where: { id: titleTicket!.id },
                        data: { price: 0 }
                    })
                }
                // mengurangi coupon yang dimiliki user
                const couponDelete = await prisma.coupon.findFirst({
                    where: { userId: newUserId },orderBy: { createdAt: 'desc' }
                })
                if(couponDelete){
                    await prisma.coupon.delete({
                        where: { id: couponDelete.id }
                    })
                }
            }
            const secondPrice = await prisma.tickets.findFirst({
                where: { id: titleTicket!.id }
            })
            // apakah user tersebut membeli menggunakan point
            if(usePoint) {
                // menghitung semua point yang dimiliki userId
                const totalPoint = await prisma.point.aggregate({
                    _sum: {
                        points: true
                    },
                    where: { userId: newUserId }
                })
                // jika user tidak mempunyai point
                if(totalPoint._sum.points == null) throw "You don't have a point"
                
                // mengurangi harga tiket sesuai point yang dimiliki user
                const newDiscountPoint = await prisma.tickets.update({
                    where: { id: titleTicket!.id },
                    data: { price: secondPrice!.price - totalPoint._sum.points }
                })
                if(newDiscountPoint.price < 0) {
                    await prisma.tickets.update({
                        where: { id: titleTicket!.id },
                        data: { price: 0 }
                    })
                }
                // delete point yang dimiliki user
                await prisma.point.deleteMany({
                    where: { userId: newUserId }
                })
            }
            // harga tiket terbaru
            const newPriceTicket = await prisma.tickets.findFirst({
                where: { id: titleTicket!.id },
            })
            // mengurangi saldo user
            await prisma.users.update({
                where: { id: newUserId },
                data: { saldo: saldoBuyer - newPriceTicket!.price * sumBuying }
            })
            // mengurangi quantity ticket mengikuti permintaan user yang mau beli
            await prisma.tickets.update({
                where: { id: titleTicket!.id },
                data: { quantity: titleTicket!.quantity - sumBuying }
            })
            // menambah kepemilikan tiket user
            await prisma.ticketOrder.create({
                data : {
                    userId : newUserId,
                    username : newUsernameBuyer,
                    roleTicket : roleTicket,
                    ticket_pict : titleTicket?.ticket_pict,
                    eventId,
                    quantity: sumBuying
                }
            })
            // mengembalikan harga tiket ke harga awal
            await prisma.tickets.update({
                where: { id: titleTicket!.id },
                data: { price: titleTicket!.price }
            })
            
            res.status(200).send({
                status: "success",
                message : "tickets bought successfully"
            })
        } catch (error) {
            if(error instanceof Error) {
                return res.send(`${error.message}`)
            }
            res.status(400).send({
                status: "error",
                message: error
            })
        }
    }

    async getCouponsUser(req:Request, res:Response) {
        try {
            const cookieOrganizer = req.cookies.refreshToken
            const decoded = verify(cookieOrganizer,process.env.REFRESH_TOKEN!) as { id: number };
            const userId = decoded.id

            const totalCoupon = await prisma.coupon.count({
                where: { userId: userId }
            })

            res.status(200).send({
                status: "succcess",
                message: "get user coupon success",
                data : totalCoupon
            })
        } catch (error) {
            if(error instanceof Error) {
                return res.send(`${error.message}`)
            }
            res.status(400).send({
                status: "error",
                message: error
            })
        }
    }

    async getPointUsers(req:Request, res:Response){
        try {
            const cookieOrganizer = req.cookies.refreshToken
            const decoded = verify(cookieOrganizer,process.env.REFRESH_TOKEN!) as { id: number };
            const userId = decoded.id

            const totalPoints = await prisma.point.aggregate({
                _sum: {
                    points: true
                },
                where: { userId }
            })

            res.status(200).send({
                status: "succcess",
                message: "get user pointss succes",
                data : totalPoints
            })
        } catch (error) {
            if(error instanceof Error) {
                return res.send(`${error.message}`)
            }
            res.status(400).send({
                status: "error",
                message: error
            })
        }
    }

    async getUserBuyTickets(req:Request, res:Response) {
        try {
            const cookie = req.cookies.refreshToken
            const decoded = verify(cookie,process.env.REFRESH_TOKEN!) as JwtPayload;
            const userId = decoded.id
            // mencari semua event yang dimiliki admin
            const event = await prisma.event.findMany({
                where: { organizerId: userId },
                select: {
                    id: true,
                    title: true,
                }
            })
            // mencari semua tiket yang sudah dibeli dari event.id oleh user
            const userOrder = await prisma.ticketOrder.findMany({
                where: { eventId: { in: event.map((event) => event.id) } }
            })
            // mencari usernya dari id
            const user = await prisma.users.findMany({
                where: { id: { in: userOrder.map((userOrder) => userOrder.userId) } },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    avatar: true
                }
            })
            res.status(200).send({
                status: "success",
                message: "get user buy tickets successfully",
                data: {user}
            })
        } catch (error) {
            if(error instanceof Error) {
                return res.send(`${error.message}`)
            }
            res.status(400).send({
                status: "error",
                message: error
            })
        }
    }
}
