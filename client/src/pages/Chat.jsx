import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import io from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage, setError } from '../features/chat/chatSlice';
import { updateUserList } from '../features/user/userSlice';
import { useGetUserIdQuery, useGetMessagesQuery } from '../features/api/apiSlice';
import UserProfileIntegration from './UserProfileIntegration'
import MessageList from '../components/MessageList';
const socket = io('http://localhost:3001/');

const Chat = () => {
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.chat.messages);
  const user = useSelector((state) => state.user.users);
  const { id } = useParams();
  const [ownerId, setOwnerId] = useState(null);
  const { data: userData } = useGetUserIdQuery();
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);
  const [users, setUsers] = useState([]);
  const [buyerId, setBuyerId] = useState(null);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const { data: messagesData, error, isLoading } = useGetMessagesQuery();
  
  
  

  useEffect(() => {
    if (messagesData) {
      const messagesFromData = messagesData.messages || [];
      dispatch(addMessage(messagesFromData));
    }

    if (error) {
      dispatch(setError(error));
    }
  }, [messagesData, error, dispatch]);

  useEffect(() => {
    
    fetch(`http://localhost:3001/api/getOwnerByAdId/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setOwnerId(data.ownerId);
      })
      .catch((error) => {
        console.error('Error fetching ownerId:', error);
      });

    if (userData) {
      setUserId(userData.userId);
    }
  }, [id, userData]);

    useEffect(() => {
       if (userId && ownerId) {
           const roomName = `${userId}--with--${ownerId}`;
           socket.emit('joinRoom', { userId, ownerId, room: roomName });
           socket.emit('getMessages', { userId: ownerId, ownerId: userId, room: roomName });
           socket.emit('getMessages', { userId, ownerId, room: roomName });
           socket.emit('getUsersList', { room: roomName });
      
    }
  }, [userId, ownerId, id]);

      useEffect(() => {
         const handlePrivateMessage = (data) => {
         dispatch(addMessage(data));
      
         setUnreadMessages((prevUnreadMessages) => prevUnreadMessages + 1);
    };

      const handleError = (errorMessage) => {
        
        dispatch(setError(errorMessage));
    };

    const handleUserList = (userList) => {
      
      setConnectedUsers(Array.isArray(userList) ? userList : []);
    
  };

    const handleBuyerConnected = (data) => {
      
       setBuyerId(data.buyerId);
    };

    const handleMessageList = (result) => {
     
     socket.on('welcomeMessage', (message) => {
     dispatch(addMessage(message));
  });
  }
  
      socket.on('welcomeMessage', (message) => {
     
      setWelcomeMessage(message);
   
     
    });


       socket.on('private message', handlePrivateMessage);
       socket.on('error', handleError);
       socket.on('userList', handleUserList);
       socket.on('buyerConnected', handleBuyerConnected);
       socket.on('message', handleMessageList);

    return () => {
       socket.off('private message', handlePrivateMessage);
       socket.off('error', handleError);
       socket.off('userList', handleUserList);
       socket.off('buyerConnected', handleBuyerConnected);
       socket.off('message', handleMessageList);
       socket.off('welcomeMessage');
    };
  }, [userId, ownerId, dispatch]);

    const handleSendMessage = () => {
      
    const roomName = `${userId}--with--${ownerId}`;
    const recipientId = buyerId;

    if (message.trim() === '') {
      return;
    }

    if (userId === ownerId) {
          socket.emit('private message', {
            
            content: message,
            sendDate: new Date(),
            to: recipientId,
            from: userId,
            room: roomName,
      });
    } else {
      socket.emit('private message', {
        
         content: message,
         sendDate: new Date(),
         to: ownerId,
         from: userId,
         room: roomName,
      });
    }

    setMessage('');
  };

  return (
    <div className="chat-container">
    
       <UserProfileIntegration />  
     
     
        <div className="user-list">
        
        <h2>Utilisateurs connectés</h2>
  <ul>
        {connectedUsers.map((user) => (
            <li key={user.userId}>
            <span style={{ color: 'green' }}>● </span>
            {typeof user.username === 'string' ? user.username : 'Nom d\'utilisateur non disponible'}
       
    </li>
  ))}
</ul>

</div>
        <div className="chat">
        <div className="message-list" style={{  border: '2px solid green' }}>
           <MessageList messages={messages} username={username} />
           
   </div>
          <div className="message-input">
          <input 
          type="text" 
          placeholder="Your message..." 
          value={message} 
          onChange={(e) => setMessage(e.target.value)}
          />
          
          <button onClick={handleSendMessage}>Envoyer</button>
      </div>
        {welcomeMessage && <p>{welcomeMessage}</p>}
    </div>
          <Link aria-label="Click here to return to the announcement page" className="btn" to="/ad">
              Retour à l'annonce
      </Link>
  </div>
  );
};

export default Chat;
