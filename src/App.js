import React, {useState} from "react";
import {BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Register from "./Components/Auth/Register";
import Login from "./Components/Auth/Login";
import Join from "./Components/Auth/Join";
import Chats from "./Components/Chats";
import MessageForm from "./Components/Auth/SendMessage";




const App = () =>{ 

  const peopleJoined = ["sherlock", "chetan"]; 
  
  const addPeople = (user) =>{
    if (!peopleJoined.includes(user)) {
      // Update the state to include the new userName
     peopleJoined.push(user);
    }
  }


  

  const connect = (user) =>{

     const socket = new WebSocket(
      `wss://b8evzwmhe0.execute-api.us-east-1.amazonaws.com/production/?userName=${user}`
      );

    const temp = 6; 
    
    socket.addEventListener("open", (event) => {
      console.log("WebSocket connection opened:", event);
      const userName = user; // Assuming it's directly provided in the query string

      //console.log("Connected user:", userName);
      alert("Connection opened!")
      
    });

    socket.addEventListener("message", (event) => {
      //const data = JSON.parse(event.data);
      console.log(event.data);
    });

  }


  
  

  return (
    <Router>
      <Routes>
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/" element={<Chats/>} />
        
        <Route exact path="/message" element={<MessageForm />} />
        <Route exact path="/chats/:userName" element={<Chats peopleJoined = {[peopleJoined]} 
        socket = {connect.socket} />} />
      </Routes>
    </Router>
  );


}

export default App; 