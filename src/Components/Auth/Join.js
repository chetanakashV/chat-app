import React from "react";
import {useState, createContext} from "react"
import useWebSocket, { ReadyState } from 'react-use-websocket';
import './Join.css'
import { useNavigate } from "react-router";
import Chats from "../Chats";
var userContext = createContext(); 




const Join = (props) =>{ 

    const navigate = useNavigate(); 
   const [membersJoined, setMembersJoined] = useState([]);

    const [user, setUser] = useState({});
    const [loggedIn, setLoggedIn] = useState(false);  

    

    const Login = (user) =>{
    
        props.connect(user); 
    
       
        props.addPeople(user); 

        setLoggedIn(true); 

        navigate(`/chats/${user}`); 
      
      }

    return (
      <>
        <div className="container">
          <br /> <br /> <br />
          <input
            type="text"
            placeholder="Username"
            onChange={(e) => {
              setUser(e.target.value);
            }}
          />
          <br />
          <button
            className="button1"
            onClick={() => {
              Login(user);
              
            }}
          >
            Join
          </button>
          <br /> <br /> <br />
        </div>

        
        {/* {loggedIn &&  <Chats membersJoined={membersJoined} />} */}
      </>
    );

}

export default Join; 