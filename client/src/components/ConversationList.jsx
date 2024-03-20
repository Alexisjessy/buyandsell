// ConversationList.jsx

import React, { useEffect, useState, useRef } from 'react';
import { useGetUserIdQuery } from '../features/api/apiSlice';

const ConversationList = React.forwardRef(({ localMessages, messagesData, handleDeleteClick, handleReplyButtonClick, handleJoinRoom, selectedMessageId, isRoomJoined }, ref) => {
  const { data: userData } = useGetUserIdQuery();
  const [userId, setUserId] = useState(null);
  const messageListRef = useRef(null); 
  const [deletingMessages, setDeletingMessages] = useState([]);

  useEffect(() => {
    scrollToBottom();
  }, [localMessages]);

  const scrollToBottom = () => {
    if (messageListRef.current) {
      const scrollHeight = messageListRef.current.scrollHeight;
      const clientHeight = messageListRef.current.clientHeight;
      const maxScrollTop = scrollHeight - clientHeight;
      messageListRef.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }
  };
  useEffect(() => {
    if (userData) {
      setUserId(userData.userId);
    }
  }, [userData]);
  
  const handleDeleteToggle = (messageId) => {
    setDeletingMessages((prev) => {
      const isDeleting = prev.includes(messageId);
      return isDeleting ? prev.filter((id) => id !== messageId) : [...prev, messageId];
    });

    // Si vous souhaitez réinitialiser l'état après un certain délai
    setTimeout(() => {
      setDeletingMessages((prev) => prev.filter((id) => id !== messageId));
    }, 5000); // 5000 ms (5 secondes)
  };

  
  return (
    <div ref={messageListRef} className="conversation-list" style={{ height: '100vh', overflowY: 'auto', border: '2px solid green' }}>
    
       {localMessages && localMessages.length > 0 &&
             localMessages.map((msg)  => (
          <div key={msg.id} className={`conversation-card ${selectedMessageId === msg.message_id ? 'selected' : ''} ${msg.sender_id === userId ? 'sent' : 'received'}`}>
            <div>
              {msg.sender_id !== userId && (
                <>
                  <p><strong>De:</strong> {msg.sender_username}</p>
                </>
              )}
              {msg.recipient_id !== userId && (
                <>
                  <p><strong>A:</strong> {msg.recipient_username}</p>
                </>
              )}
              <p className="message-text">{msg.message_content}</p>
              <span className="message-time">{msg.send_date ? new Date(msg.send_date).toLocaleString('fr-FR') : ''}</span>
            </div>
            {deletingMessages.includes(msg.id) ? (
            // Bouton de suppression
            <button onClick={() => handleDeleteClick(msg.id)}>Supprimer</button>
          ) : (
            // Bouton "X" pour le mode suppression
            <button onClick={() => handleDeleteToggle(msg.id)}>X</button>
          )}
            {msg.sender_id !== userId && (
              <>
                <button
                  onClick={() => {
                    handleReplyButtonClick(msg.sender_id, msg.sender_username, msg.message_id);
                    handleJoinRoom(msg.sender_id);
                  }}
                  className={`reply-button ${isRoomJoined ? 'joined' : ''} ${msg.isSent ? 'send' : ''} ${selectedMessageId === msg.message_id ? 'selected' : ''}`}
                >
                  Répondre
                </button>
              </>
            )}
          </div>
        ))}
        
    </div>
  );
});
export default ConversationList;
