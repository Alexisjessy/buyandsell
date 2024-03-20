import React, { useRef, useEffect } from 'react';

const MessageList = ({ messages, username, userId }) => {
  const messageListRef = useRef(null);

  useEffect(() => {
   
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]); 

  return (
    <div ref={messageListRef} className="message-list">
      <h2>Chat</h2>
      {messages.map((msg) => (
        <div key={msg.id} className={`message ${msg.senderId === userId ? 'self' : 'other'}`}>
          {msg.content && (
            <div className="message-content">
               
             
              <p className="message-text">{msg.content}</p>
              <span className="message-time">{msg.sendDate ? new Date(msg.sendDate).toLocaleTimeString() : ''}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MessageList;
