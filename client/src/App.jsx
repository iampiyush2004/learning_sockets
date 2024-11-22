import React, { useEffect, useMemo, useState } from 'react'
import {io} from "socket.io-client"
import {Button, Container , Typography , TextField, Stack} from "@mui/material"

const App = () => {

  const socket =useMemo(() =>  io("http://localhost:3000") , []); // for avoiding page refreshing every time

  const [message , setMessage] = useState("");
  const [room , setRoom] = useState("");
  const [socketId , setSocketId] = useState("");
  const [allMessages , setAllMessages] = useState([]);
  const [roomName , setRoomName] = useState("");
  
  const joinRoomHandler = (e)=>{
    e.preventDefault();
    socket.emit('join-room',roomName);
    setRoomName("")
  }

  const handleSumbit = (e) =>{
    e.preventDefault();
    socket.emit("message" , {message,room})
    setMessage("");
  }

  useEffect(()=> {

    socket.on("connect" , ()=>{
      setSocketId(socket.id);
      console.log("connected" , socket.id)
    });

    socket.on("recieve-message" , (data)=>{
        console.log(data);
        setAllMessages((allMessages) => [...allMessages , data])
    } )

    socket.on("welcome" , (s) => {
      console.log(s);
    });

    return() => {
      socket.disconnect();
    }


  } , [])

  return (
    <Container maxWidth="sm">
      <Typography variant="h3" component="div" gutterBottom>
        Welcome to Socket.io
      </Typography>

      <Typography variant="h5" component="div" gutterBottom>
        {socketId}
      </Typography>

      <form onSubmit={joinRoomHandler}>
        <h5>Join Room</h5>
        <TextField value ={roomName} onChange={(e) => setRoomName(e.target.value)} id="outlined-basic" label = "Room Name" variant="outlined"/>  

        <Button type ="submit" variant="contained" color="primary">Join</Button>
      </form>

      <form onSubmit={handleSumbit}>
      <TextField value ={message} onChange={(e) => setMessage(e.target.value)} id="outlined-basic" label = "Message" variant="outlined"/>
      <TextField value ={room} onChange={(e) => setRoom(e.target.value)} id="outlined-basic" label = "Room" variant="outlined"/>  

      <Button type ="submit" variant="contained" color="primary">Send</Button>
      </form>


        <Stack>
          {
            allMessages.map((m, i) => (
              <Typography key={i} variant="h6" component="div" gutterBottom>
                {m.message}
              </Typography>
            ))
          }
        </Stack>

      </Container>
  )
}

export default App
