import {prisma} from "../src/lib/prisma"



async function seed(){

    await prisma.event.create({
      data:{
        id:"935deb80-7bbd-462e-996d-e5b6366aae39",
        title:"Unite Summit",
        slug:"unite-summit",
        details:"Um evento para devs apaixonados(as) por tecnologia",
        maximumAttendees:120
      }
    })
}

seed().then(() =>{
    console.log("Database seeded!");
    
    prisma.$disconnect()
})