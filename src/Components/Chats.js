import React, {useState, useEffect} from 'react'
import { Button } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';
import { TfiReload } from "react-icons/tfi";
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Paper from '@mui/material/Paper';
import { connect } from 'react-redux';
 import './Chats.css'

 var socket; 

 const Chats = () => {
   const [isConnected, setIsConnected] = useState(false);
   const [name, setName] = useState("");
   const [currentUser, setCurrentUser] = useState(""); 
   const [people, setPeople] = useState([]);
   const [message, setMessage] = useState(""); 
   const [rows, setRows] = useState([]); 
   const [newRows, setNewRows] = useState([]); 
  //  const [socket, setSocket] = useState(); 

   const [rel, setRel] = useState(false);

   useEffect(() =>{
     fetch("https://albqy007z7.execute-api.us-east-1.amazonaws.com/dev/users", {
       header: {
         "content-type": "application/json",
         
       },
     })
       .then((resp) => {
         //console.log(resp);
         const data= resp.json();
        //  console.log(data);
        //  console.log(data);
         return data; 
       }).then((response) =>{
        //console.log(response.body); 
        const responseData = JSON.parse(response.body);
        // console.log(responseData);
        setPeople([]); 
         responseData.users.map(
          (user) => {
            setPeople((prevPeople) => [...prevPeople, user.userName])
          });
        // console.log(usernames);
       })
       .catch((error) => {
         console.log(error);
       });
   }, [rel])

   const Reload = () => {
     setRel(!rel);
   };

   var props = {
     members: ["shiva", "chetan", "nidhi"],
     chatRows: [<span> Hey man, {name}</span>],
     onPublicMessage: () => {},
     onPrivateMessage: (string) => {},
     onConnect: () => {},
     onDisconnect: () => {},
   };

    
   const connectUser =  () => {
     var user = prompt("enter your name");
     setName(user);

      socket =  new WebSocket(
       `wss://b8evzwmhe0.execute-api.us-east-1.amazonaws.com/production/?userName=${user}`
     );

     

      socket.addEventListener("open",  async (event) =>  {
       console.log("WebSocket connection opened:", event);
       const userName = user; // Assuming it's directly provided in the query string

       //console.log("Connected user:", userName);
       alert("Connection opened!");
       console.log(socket)

       
     });

           socket.addEventListener("message",async (event) => {
        const data = JSON.parse(event.data);
 
       //  console.log(data.from);
       //  chatRows.push(<span>event.data</span>); 
       //  const stuff = JSON.parse(event.data)
 
       // const temp = JSON.parse(event); 
      
      
 
        if(data.from == localStorage.getItem('currentUser')) setNewRows((prevRows) => [...prevRows, [data.from, name ,data.from + ": " + data.message]])
          //  setCurrentUser(data.from);   

      });
     

     setIsConnected(true);
   };

   const sendMessage = ()  => {

    if(currentUser == ""){ alert("Please select any user to send message"); return; }
    
      const messageObject = {
        action: "sendmessage",
        message: message,
        to: currentUser,
        from: name,
      };
      
      const jsonMessage = JSON.stringify(messageObject);
      console.log(jsonMessage);
      console.log(socket)
      socket.send(jsonMessage);  
      setNewRows((prevRows) => [...prevRows, [name, currentUser ,  "You: " + message]])
     
    
   }

   const getMessages = () =>{
    fetch("https://740ntxty9d.execute-api.us-east-1.amazonaws.com/dev/messages", {
      header: {
        "content-type": "application/json",
        
      },
    })
    .then((resp) => {
      const data= resp.json();
      return data; 
    }).then((response) =>{
     const responseData = JSON.parse(response.body);
     setNewRows([]); 
     responseData.messages.map(
       (rowss) => {
         if((rowss.to == currentUser && rowss.from == name) ) 
         setNewRows((prevRows) => [...prevRows,[rowss.from, rowss.to, "You: " + rowss.message ]])
        
        if(rowss.to == name && rowss.from == currentUser)
        setNewRows((prevRows) => [...prevRows,[rowss.from, rowss.to, rowss.from + ": "+ rowss.message ]])

       
       });

    // console.log(responseData);
      
    })
    .catch((error) => {
      console.log(error);
    });



   }

   

   const disconnectUser = () => {
     setName("");
     setIsConnected(false);
     
   };

   return (
     <div
       style={{
         position: "absolute",
         width: "100%",
         height: "100%",
         backgroundColor: "#f4ede3",
         display: "flex",
         alignItems: "center",
       }}
     >
       <CssBaseline />
       <Container maxWidth="lg" style={{ height: "90%"}}>
         <Grid container style={{ height: "100%"  }}>
           <Grid
             item
             xs={2}
             style={{ backgroundColor: "#3e103f", color: "white" }}
           >
             <List component="nav">
               <button onClick={Reload} className='button-3'> <TfiReload/></button>
               {isConnected && people.map((item) => (

                (item != name &&  <ListItem 
                  style = {{background: (currentUser==item) ? "black" : "none"}}
                  onClick={() => {
                    setCurrentUser(item);
                    localStorage.setItem("currentUser", item); 
                    getMessages(); 
                  }}
                  button
                >
                  <ListItemText style={{ fontWeight: 800 }} primary={item} />
                </ListItem>)


               ))}
             </List>
           </Grid>
           <Grid
             style={{ position: "relative" }}
             item
             container
             direction="column"
             xs={10}
           >
             <Paper style={{ flex: 1 }}>
               <Grid
                 item
                 container
                 style={{ height: "100%" }}
                 direction="column"
               >
                 <Grid item container style={{ flex: 1 }}>
                   <ul
                     style={{
                       paddingTop: 20,
                       paddingLeft: 44,
                       listStyleType: "none",
                     }}
                   >
                     {isConnected && <span style ={{fontSize: "20px", fontWeight: "bold", textAlign: "center"}}>Welcome {name}, Good to have you </span>}
                     {newRows.map((item, i) => (
                       <li key={i} style={{ paddingBottom: 9 }}>
                        <span className = {item[0] == name? 'bubble-right': 'bubble'}>{item[2]}</span>
                       </li>
                     ))}
                   </ul>
                 </Grid>
                 <Grid item style={{ margin: 10 }}>
                   {isConnected && (
                     <>
                       <input type="text" style={{display: "inline-block", marginBottom: "20px"}} 
                       onChange={e => setMessage(e.target.value)}/> <button className='button-6'
                       onClick = { sendMessage}>Send</button>
                     </>
                   )}
                   
                   {isConnected && (
                     <Button
                       style={{ marginRight: 7 }}
                       variant="outlined"
                       size="small"
                       disableElevation
                       onClick={props.onPublicMessage}
                     >
                       Send Public Message
                     </Button>
                   )}
                   {isConnected && (
                     <Button
                       variant="outlined"
                       size="small"
                       disableElevation
                       onClick={disconnectUser}
                     >
                       Disconnect
                     </Button>
                   )}
                   {!isConnected && (
                     <Button
                       variant="outlined"
                       size="small"
                       disableElevation
                       onClick={connectUser}
                     >
                       Connect
                     </Button>
                   )}
                 </Grid>
               </Grid>
               <div
                 style={{
                   position: "absolute",
                   right: 9,
                   top: 8,
                   width: 12,
                   height: 12,
                   backgroundColor: isConnected ? "#00da00" : "#e2e2e2",
                   borderRadius: 50,
                 }}
               />
             </Paper>
           </Grid>
         </Grid>
       </Container>
     </div>
   );
 };

export default Chats;