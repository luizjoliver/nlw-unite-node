import fastify from "fastify"

import  fastifySwagger from "@fastify/swagger"
import  fastifySwaggerUI from "@fastify/swagger-ui"
import fastifyCors from "@fastify/cors"

import {serializerCompiler,validatorCompiler,jsonSchemaTransform} from "fastify-type-provider-zod"
import { createEvent } from "./routes/create-event"
import { registerForEvent } from "./routes/register-for-event"
import { getEvent } from "./routes/get-event"
import { getAttendeeBadge } from "./routes/get-attendee-badge"
import { checkIn } from "./routes/check-in"
import { getEventAttendees } from "./routes/get-event-attendees"
import { errorHandler } from "./error-handler"




const app = fastify()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

//Cuidado em produção
app.register(fastifyCors,{
    origin:"*"
})

app.register(fastifySwagger,{
    swagger:{
        consumes:["application/json"],
        produces:["application/json"],
        info:{
            title:"Pass-in",
            description:"Especificações da API para o back-end Pass-in construido durante o nlw unite",
            version:"1.0.0"
        }
    },
    transform:jsonSchemaTransform,

})
app.register(fastifySwaggerUI,{
    routePrefix:"/docs"
})

app.register(createEvent)
app.register(registerForEvent)
app.register(getEvent)
app.register(getAttendeeBadge)
app.register(checkIn)
app.register(getEventAttendees)

app.setErrorHandler(errorHandler)

app.listen({port:3333, host:"0.0.0.0"},() =>{
    console.log("Server is running At 3333");
    
})