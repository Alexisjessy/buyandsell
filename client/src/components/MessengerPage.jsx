import React, { useEffect, useState } from 'react';
import { useGetConversationsQuery, useGetUserIdQuery } from '../features/api/apiSlice';

const MessengerPage = ({ onConversationClick }) => {
  const [userId, setUserId] = useState(null);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const { data: conversations, isLoading, isError } = useGetConversationsQuery(userId);
  const { data: userData } = useGetUserIdQuery();



      useEffect(() => {
        if (userData) {
        setUserId(userData.userId);
    }
  }, [userData]);

      if (isLoading) {
        
        return <div>Loading...</div>;
  }

  return (
    <div className="conversations">
      <h1>Messenger</h1>
      <ul>
        {conversations &&
          conversations.messages &&
          conversations.messages.map((message) => (
            <li
             key={message.id}
               onClick={() => onConversationClick(message.recipient_id)}
                onKeyDown={(e) => {
                
               if (e.key === 'Enter') {
              onConversationClick(message.recipient_id);
          }
      }}
                tabIndex={0}
                className={selectedMessageId === message.id ? 'selected' : ''}
               >
             
              <div>
                <h3>{message.recipient_username}</h3>
                <p>{message.message_content.substring(0, 30)}</p>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default MessengerPage;