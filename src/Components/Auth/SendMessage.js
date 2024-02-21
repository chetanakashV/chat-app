import React, { useState } from "react";

const MessageForm = () => {
  const [myUsername, setMyUsername] = useState("");
  const [recipientUsername, setRecipientUsername] = useState("");
  const [message, setMessage] = useState("");

  const handleSendClick = () => {
    
    const wsURL = `wss://b8evzwmhe0.execute-api.us-east-1.amazonaws.com/production/?userName=${myUsername}`;

    const ws = new WebSocket(wsURL);

    ws.addEventListener("open", () => {
      const messageObject = {
        action: "sendmessage",
        message: message,
        to: recipientUsername,
        from: myUsername,
      };
      
      const jsonMessage = JSON.stringify(messageObject);
      console.log(jsonMessage);
      ws.send(jsonMessage);
    });

    // Reset the input fields after sending the message
    setMyUsername("");
    setRecipientUsername("");
    setMessage("");
  };

  return (
    <div>
      <label>
        My Username:
        <input
          type="text"
          value={myUsername}
          onChange={(e) => setMyUsername(e.target.value)}
        />
      </label>
      <br />
      <label>
        Recipient Username:
        <input
          type="text"
          value={recipientUsername}
          onChange={(e) => setRecipientUsername(e.target.value)}
        />
      </label>
      <br />
      <label>
        Message:
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </label>
      <br />
      <button onClick={handleSendClick}>Send</button>
    </div>
  );
};

export default MessageForm;
