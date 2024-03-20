import React, { useEffect, useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import io from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage, setError, resetNotifications } from '../features/chat/chatSlice';
import { updateUserList } from '../features/user/userSlice';
import { useGetUserIdQuery, useGetMessagesQuery, useDeleteMessagesMutation } from '../features/api/apiSlice';
import MessengerPage from '../components/MessengerPage';
import ConversationList from '../components/ConversationList';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';

/* ** Create a socket connection to the server ** */
const socket = io('http://localhost:3001/');

const ChatAdmin = () => {
  
  const [message, setMessage] = useState('');
  const [localMessages, setLocalMessages] = useState([]);
  const dispatch = useDispatch();
  const { id } = useParams();
  const [ownerId, setOwnerId] = useState(null);
  const { data: userData } = useGetUserIdQuery();
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);
  const [users, setUsers] = useState([]);
  const [currentRecipientId, setCurrentRecipientId] = useState(null);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [buyerId, setBuyerId] = useState(null);
  const { data: messagesData, error, isLoading, refetch } = useGetMessagesQuery({ userId });
  const messages = useSelector((state) => state.chat.messages);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [isConversationListOpen, setIsConversationListOpen] = useState(false);
  const messageListRef = useRef(null);
  const inputRef = useRef(null);
  const [isRoomJoined, setIsRoomJoined] = useState(false);
  const [isInputActive, setIsInputActive] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [deleteMessage] = useDeleteMessagesMutation();
  const [connectedUsers, setConnectedUsers] = useState([]);
/**
  * Function to toggle the conversation list
  * */
  const toggleConversationList = () => {
    setIsConversationListOpen(!isConversationListOpen);
  };

  useEffect(() => {
    // Handle incoming messages and errors from the server
    const handlePrivateMessage = (data) => {
      dispatch(addMessage(data));
      setUnreadMessages((prev) => prev + 1);
    };
    const handleError = (errorMessage) => {
      dispatch(setError(errorMessage));
    };
    const handleUserList = (userList) => {
      setConnectedUsers(Array.isArray(userList) ? userList : []);
    };
    const handleMessageList = (result) => {
      dispatch(addMessage(result));
      refetch();
    };

    // Event listeners for socket events
    socket.on('private message', handlePrivateMessage);
    socket.on('error', handleError);
    socket.on('userList', handleUserList);
    socket.on('message', handleMessageList);
    socket.on('newMessage', handleNewMessage);

    // Cleanup function to remove event listeners when the component unmounts
    return () => {
      socket.off('private message', handlePrivateMessage);
      socket.off('error', handleError);
      socket.off('userList', handleUserList);
      socket.off('message', handleMessageList);
      socket.off('newMessage', handleNewMessage);
    };
  }, [userId, ownerId, dispatch, refetch]);

  // Update document title based on unread messages
  useEffect(() => {
    document.title = unreadMessages > 0 ? `(${unreadMessages}) Nouveaux Messages` : 'Messagerie';
  }, [unreadMessages]);
  
/**
  * Function to handle a new message from the server
  * */
  const handleNewMessage = (newMessage) => {
    setLocalMessages((prevMessages) => [...prevMessages, newMessage]);

    if (!newMessage.isRead) {
      setUnreadMessages((prevUnreadMessages) => prevUnreadMessages + 1);
    }

    dispatch(addMessage(newMessage));
    refetch();
  };

  useEffect(() => {
    // Set the user ID when user data is available
    if (userData) {
      setUserId(userData.userId);
    }
  }, [userData]);
/**
 * Function to join a room for private messaging
 * */
  const handleJoinRoom = (recipientId) => {
    const roomName = `${recipientId}--with--${userId}`;
    socket.emit('joinRoom', { recipientId, userId, room: roomName });
    setIsRoomJoined(true);
  };
  /**
  * Function to handle a conversation click
  * */
  const handleConversationClick = async (recipientId) => {
    setBuyerId(recipientId);
    setUnreadMessages(0);

    try {
      const response = await fetch(
        `http://localhost:3001/api/getMessagesForRecipient/${userId}/${recipientId}`
      );
      const data = await response.json();

      // Update messages in the user interface
      setLocalMessages(data.messages);
      setCurrentRecipientId(recipientId);
      setIsConversationListOpen(true);
    } catch (error) {
      console.error('Erreur lors de la récupération des messages pour le destinataire :', error);
    }
  };
   /**
  * Function to handle the reply button click
   */
  const handleReplyButtonClick = (recipientId, recipientUsername, messageId) => {
    setCurrentRecipientId(recipientId);
    setUsername(recipientUsername);
    setIsInputActive(true);
    inputRef.current.focus();
    setSelectedMessageId(messageId);
    dispatch(resetNotifications());
  };

  useEffect(() => {
    // Focus on the input when it becomes active
    if (isInputActive) {
      inputRef.current.focus();
    }
  }, [isInputActive]);
  
  /**
  * Function to handle the delete button click
  */
  
  const handleDeleteClick = async (messageId) => {
    try {
      await deleteMessage(messageId);
      setLocalMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== messageId));
      refetch();
    } catch (error) {
      console.error('Erreur lors de la suppression du message', error);
    }
  };
  
  
/**
 * Function to handle responding to a message 
 */
 
  const handleRespondToMessage = () => {
    const roomName = `${currentRecipientId}--with--${userId}`;

    if (message.trim() === '' || !currentRecipientId) {
      return;
    }

    socket.emit('private message', {
      content: message,
      sendDate: new Date(),
      to: currentRecipientId,
      from: userId,
      room: roomName,
    });

    setMessage('');
    setIsInputActive(false);
    setSelectedMessageId(null);
    refetch();
    dispatch(resetNotifications());
    setUnreadMessages(0);
  };

  return (
    <section className="chat-container">
      <div className="conversations">
        {/* MessengerPage component for conversation list */}
        <MessengerPage onConversationClick={handleConversationClick} />
      </div>
      <div className="chat">
        <div className="user-list">
          <h2>Utilisateurs connectés</h2>
          <ul>
            {/* Display connected users */}
            {connectedUsers.map((user) => (
              <li key={user.userId}>
                <span style={{ color: 'green' }}>● </span>
                {typeof user.username === 'string' ? user.username : 'Nom d\'utilisateur non disponible'}
              </li>
            ))}
          </ul>
        </div>

        {/* Render the ConversationList component if it is open */}
        {isConversationListOpen && currentRecipientId && (
          <ConversationList
            ref={messageListRef}
            localMessages={localMessages}
            handleDeleteClick={handleDeleteClick}
            handleReplyButtonClick={handleReplyButtonClick}
            handleJoinRoom={handleJoinRoom}
            selectedMessageId={selectedMessageId}
            isRoomJoined={isRoomJoined}
            selectedMessages={selectedMessages}
            onClose={toggleConversationList}
          />
        )}

        {/* MessageList and MessageInput components */}
        <MessageInput
          message={message}
          setMessage={setMessage}
          isInputActive={isInputActive}
          inputRef={inputRef}
          handleRespondToMessage={handleRespondToMessage}
        />

        {/* Toggle conversation list button */}
        <button className="toggle-conversation-list" onClick={toggleConversationList}>
          {isConversationListOpen ? 'Fermer' : 'Ouvrir'} la liste des conversations
        </button>

        {/* Link to navigate back to admin page */}
        <Link className="btn" to="/admin">
          Retour
        </Link>
      </div>
    </section>
  );
};

export default ChatAdmin;
