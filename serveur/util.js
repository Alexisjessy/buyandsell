const getSocketByUserId = (userId) => {
  const connectedSockets = io.sockets.sockets;
  return connectedSockets[userId];
};

module.exports = { getSocketByUserId };