import { ZodTypeProvider } from "fastify-type-provider-zod"
import { generateSlug } from "../utils/generate-slug"
import z from "zod"
import { prisma } from "../lib/prisma"
import { FastifyInstance } from "fastify"
import { BadRequest } from "./_errors/bad-request"

export async function createEvent(app:FastifyInstance){

    app.withTypeProvider<ZodTypeProvider>().post("/events",
    {  schema:{
        summary:"Create an Event",
        tags:["events"],
        body: z.object({
            title:z.string().min(4),
            details:z.string().nullable(),
            maximumAttendees:z.number().int().positive().nullable()
        }),
        response:{
            201:z.object({
                eventId: z.string().uuid(),
            })
        }
    } }
    , 
    async (req,repply) =>{
    
        const {
            details,
            maximumAttendees,
            title
        } = req.body
    
       const eventSlug = generateSlug(title)
    
       const eventWithSameSlug = await prisma.event.findUnique({
        where:{
            slug: eventSlug
        }
       })
    
       if(eventWithSameSlug !== null) throw new BadRequest("Another event with same slug already exists")
    
        const event = await prisma.event.create({
            data:{
                title:title,
                details:details,
                maximumAttendees:maximumAttendees,
                slug:eventSlug
            }
        })
    
        return repply.status(201).send({eventId:event.id})
        
      
    
    
    })


}

