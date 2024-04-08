import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";
import { BadRequest } from "./_errors/bad-request";


export async function registerForEvent(app:FastifyInstance){

    app.withTypeProvider<ZodTypeProvider>()
    .post("/events/:eventId/attendees",
    {schema:{
        summary: 'Register an attendee ',
        tags: ['events'],
        body:z.object({
            name:z.string().min(4),
            email:z.string().email()
        }),
        params:z.object({
            eventId: z.string().uuid()
        }),
        response:{
            201:z.object({
                attendeeId:z.number()
            })
        }
    }},

    async(req,reply) =>{

        const {eventId} = req.params
        const {email,name} = req.body


        const [event,amountOfAttendeesForEvent] = await Promise.all([
            prisma.event.findUnique({
                where:{
                    id:eventId
                }
            }),
            prisma.attendee.count({
                where:{
                    eventId
                }
            })

        ])
        
        const attendeeFromEmail = await prisma.attendee.findUnique({
            where:{
                eventId_email:{
                    email,
                    eventId
                }
            }
        })

       

       await Promise.all([])

        if(attendeeFromEmail !== null)  throw new BadRequest("this email already exist for this event")

        

        if(event?.maximumAttendees && amountOfAttendeesForEvent > event?.maximumAttendees ) {
            throw new BadRequest("Maximum attendees number  for this event have been reached")
        }

        const attendee = await prisma.attendee.create({
            data:{
                email,
                name,
                eventId
            }
        })

        return reply.status(201).send({attendeeId: attendee.id})

    })
}