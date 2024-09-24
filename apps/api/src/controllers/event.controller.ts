import prisma from "@/prisma";
import { Request, Response } from "express";
import { verify } from "jsonwebtoken";

export class EventController {
    async createEvents(req:Request, res:Response) {
        try {
            const { title, description, start_date, end_date, location, category } = req.body // mengambil text biasa di form data
            const pict = req.file?.filename // mengambil file yang dikirim di form data
            if(!pict) throw "picture event is required"
            const startDate: Date = new Date(start_date);
            const endDate: Date = new Date(end_date);
            if(startDate >= endDate) throw "start date must be less than end date"
            
            const expDate: Date = new Date(end_date); // Buat objek Date dari end_date
            expDate.setMinutes(expDate.getMinutes() + 1); // Tambah 1 menit

            // mengambil id user yang ada di httpOnlyCookie melalui refresh token
            const cookieOrganizer = req.cookies.refreshToken
            const decoded = verify(cookieOrganizer,process.env.REFRESH_TOKEN!) as { id: number };
            const organizerId = decoded.id
            
            const organizer = await prisma.users.findUnique({
                where: { id: organizerId }
            })
            if(!organizer) throw "organizer not found"
            
            const dataEvent = await prisma.event.create({
                data: {
                    title,
                    description,
                    start_date : startDate,
                    end_date: end_date,
                    location,
                    category,
                    organizerId: organizerId,
                    expiresAt: expDate
                }
            })

            // jika ada file yang dikirim
            if(pict){
                const eventPict = `http://localhost:8000/api/public/pict/${pict}`
                // mengupdate picture event dengan gambar baru
                await prisma.event.update({
                where: { id: dataEvent.id },
                data: { event_pic: eventPict },
                })
            }
            // mengambil data event yang terbaru (yang sudah ditambahkan pict di event_pic nya)
            const newEvent = await prisma.event.findFirst({
                where: { id: dataEvent.id },
            })
            // mengirim event id ke cookie
            res.cookie("eventId",dataEvent.id, {
                httpOnly: true, // tidak dapat diakses dari client langsung
                maxAge: 24 * 60 * 60 * 1000, // expires dalam 1 hari
                // secure: true // jika menggunakan https
            })
            
            return res.status(201).send({
                status: "success",
                message: "Event created successfully",
                data: newEvent
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

    async getAllEvents(req:Request, res:Response) {
        try {
            const events = await prisma.event.findMany();
            return res.status(201).send({
                status: "success",
                message: "get all events successfully",
                data: events
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

    async getAllEventsActive(req:Request, res:Response) {
        try {
            const cookieOrganizer = req.cookies.refreshToken
            const decoded = verify(cookieOrganizer,process.env.REFRESH_TOKEN!) as { id: number };
            const organizerId = decoded.id

            const events = await prisma.event.findMany({
                where: { organizerId},
                orderBy: { createdAt: "desc" }
            })
            if(!events) throw "You don't have an event yet"
            res.status(201).send({
                status: "success",
                message: "Get all events active successfully",
                data: events
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

    async getEventsByCategory(req:Request, res:Response) {
        try {
            const { category } = req.body
            const events = await prisma.event.findMany({
                where: { category: category }
            })
            res.status(201).send({
                status: "success",
                message: "Get events by category successfully",
                data: events
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

    async getEventsById(req:Request, res:Response) {
        try {
            const { id } = req.params
            const eventData = await prisma.event.findUnique({
                where: { id: id }
            })
            if(!eventData) throw "event not found"

            return res.status(201).send({
                status: "success",
                message: "Get event by id successfully",
                data: eventData
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
}