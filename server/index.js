import express from 'express'
import { Server } from 'socket.io';
import {createServer} from "http";
import cors from "cors";


const app = express();
const server = createServer(app);
const io = new Server(server , {
    cors: {
        origin:"http://localhost:5173",
        methods : ["GET" , "POST"],
        credentials : true,
    }
})

io.on("connection" , (socket)=>{
    console.log("User Connected!" , socket.id)
    

    socket.on("message" , ({room,message}) => {
        console.log({room,message});
        io.to(room).emit("recieve-message" , { message, room });
    })
    
    socket.on("join-room" , (room) => {
        socket.join(room);
        console.log(`user join room : ${room}`)
    })

    socket.on("disconnect" , () =>{
        console.log("User Disconnected!" , socket.id);
    })

})

app.use(cors({
    origin:"http://localhost:5173",
    methods : ["GET" , "POST"],
    credentials : true,
}));

app.get("/" , (req , res) => {
    res.send("hello world")
})

server.listen( 3000 , ()=>{
    console.log('server is running on port 3000');
})



// socket.emit("welcome",`welcome to the server  `) //"event" , "message"
    //socket.broadcast.emit("welcome",` ${socket.id} joined the server`) // uss bande ko chadd ke baki sbko message jayega 