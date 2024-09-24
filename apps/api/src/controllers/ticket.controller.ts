import prisma from "@/prisma";
import { Request, Response } from "express";
import { verify } from "jsonwebtoken";

export class TicketController {

    async createTickets(req:Request, res:Response) {
        try {
            const {roleTicket, price, quantity} = req.body
            const newEventId = req.cookies.eventId
            const eventTicket = await prisma.event.findFirst({
                where: { id: newEventId }
            })
            if(!eventTicket) throw "Event Id not found.. please create new event first"
            const newTickets = await prisma.tickets.create({
                data : {
                    eventId : newEventId,
                    ticket_pict : eventTicket.event_pic,
                    roleTicket,
                    price,
                    quantity
                }
            })

            // res.clearCookie("eventId")
            res.status(200).send({
                status: "success",
                message : "tickets created successfully",
                newTickets
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

    async getAllTicketsActive(req:Request, res:Response) {
        try {
            // mengambil id user yang ada di httpOnlyCookie melalui refresh token
            const cookieOrganizer = req.cookies.refreshToken
            const decoded = verify(cookieOrganizer,process.env.REFRESH_TOKEN!) as { id: number };
            const organizerId = decoded.id

            // mencari semua event yang dimiliki admin
            const event = await prisma.event.findMany({
                where: { organizerId: organizerId },
                select: {
                    id: true
                }
            })

            // mencari semua ticket yang dipunyai oleh event id
            const tickets = await prisma.tickets.findMany({
                where: {eventId: { in: event.map((event) => event.id) }}
            })

            res.status(200).send({
                status: "success",
                message: "get all tickets successfully",
                data : tickets
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

    async getTicketsByEventId(req:Request, res:Response) {
        const { eventId } = req.params
        try {
            const newTickets = await prisma.tickets.findMany({
                where: { eventId: eventId }
            })
            res.status(201).send({
                status: "success",
                message: "get tickets by category successfully",
                data : newTickets
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

    async getTicketById(req:Request, res:Response){
        const {id} = req.params
        try {
            const ticket = await prisma.tickets.findFirst({
                where: {id : Number(id)}
            })
            if(!ticket) throw "ticket not found"
            res.status(200).send({
                status: "success",
                message: "get ticket by id success",
                data : ticket
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