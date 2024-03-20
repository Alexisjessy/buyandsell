import React, { useRef } from 'react';

const MessageInput = ({ message, setMessage, isInputActive, inputRef, handleRespondToMessage }) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleRespondToMessage();
    }
  };

  return (
    <div className="message-input">
      <input
        ref={inputRef}
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={!isInputActive}
        onKeyDown={handleKeyDown}
      />
      <button onClick={handleRespondToMessage}>Envoyer</button>
    </div>
  );
};

export default MessageInput;
