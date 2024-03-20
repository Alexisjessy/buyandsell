const express = require('express');
const http = require('http');
const cors = require('cors');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const { v4: uuidv4 } = require('uuid');
const routes = require('./routes/routes.js');
const mysql2 = require('mysql2/promise');

const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ["GET", "POST"]
    }
});
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: true,  
  optionsSuccessStatus: 204,  
};

app.use(cors(corsOptions));

require('dotenv').config();
const dbConfig = {
    host: "db.3wa.io",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0,
};
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const pool = mysql2.createPool(dbConfig);


app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/** Express session configuration * */
app.use(
    session({
        store: new FileStore({
            path: './.sessions',
        }),
        genid: (req) => {
            return uuidv4();
        },
       secret: process.env.SESSION_SECRET,

        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: false,
            sameSite: 'strict',
            maxAge: 30 * 60 * 1000,
        },
    })
);

app.set('trust proxy', (ip) => {
    if (ip === '127.0.0.1' || ip === 'localhost') {
        return true;
    }
    return false;
});

app.use((req, res, next) => {
    if (req.session && req.session.lastInteraction) {
        const currentTime = new Date();
        const lastInteractionTime = new Date(req.session.lastInteraction);
        const elapsedMinutes = (currentTime - lastInteractionTime) / 1000 / 60;

        if (elapsedMinutes >= 30) {
            req.session.destroy((err) => {
                if (err) {
                    console.error('Erreur lors de la destruction de la session :', err);
                }
                req.flash('error', 'Votre session a expiré. Veuillez vous reconnecter.');
                res.redirect('/login');
            });
            return;
        }
    }

    req.session.lastInteraction = new Date();
    next();
});


 app.use((req, res, next) => {
     res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
     res.header('Expires', '-1');
     res.header('Pragma', 'no-cache');
     next();
});


const getUsernameById = async (userId) => {
  try {
    const query = 'SELECT username FROM user WHERE id = ? LIMIT 1';
    const [result] = await pool.query(query, [userId]);

    if (result.length > 0) {
      return result[0].username;
    } else {
      
      return null;
    }
  } catch (error) {
    
    console.error('Erreur lors de la récupération du nom d\'utilisateur :', error);
    return null;
  }
};

const getConnectedUsers = async (room) => {
  const users = [];
  const socketsInRoom = io.sockets.adapter.rooms.get(room);

  if (socketsInRoom) {
    for (const socketId of socketsInRoom) {
      const socket = io.sockets.sockets.get(socketId);
      const userId = socket.userId; 
      const usernameFromDB = await getUsernameById(userId);

      if (usernameFromDB) {
        const user = {
          userId,
          username: usernameFromDB,
        
        };
        users.push(user);
      }
    }
  }

  return users;
};


/**Socket.io configuration **/

io.on('connection', (socket) => {
  socket.on('joinRoom', async ({ userId, ownerId, recipientId, room }) => {
    
    socket.userId = userId;
    
    socket.join(room);
    const userList = await getConnectedUsers(room);
    io.to(room).emit('userList', userList);
    io.to(room).emit('welcomeMessage', 'Bienvenue ici vous pouvez écrire vos messages pour le vendeur!');
    console.log(`${userId} joined room ${room}`);
    socket.emit('getMessages', { userId, ownerId, recipientId, room });
  });
  
  socket.on('message', (data) => {

io.to(data.room).emit('newMessage', data);
});

  socket.on('leaveRoom', ({ userId, ownerId, room }) => {
    socket.leave(room);
    // io.to(room).emit('userList', getConnectedUsers(room));
  });

  socket.on('private message', ({ content, to, from, recipientId, room }) => {
    io.to(room).emit('private message', {
      content,
      from,
      to,
      recipientId,
      sendDate: new Date(),
      
      
      
    });
    
      

    const query =
      'INSERT INTO message (sender_id, recipient_id, message_content, send_date) VALUES (?, ?, ?, ?)';
    
    pool.query(query, [from, to, content, new Date()])
      .then(() => {
        io.to(room).emit('newMessage', { userId: from });
        console.log('Message enregistré avec succès');
      });
  });

  
  socket.on('disconnect', () => {
    console.log(socket.id + ' ==== diconnected');
    socket.removeAllListeners();
  });
});

/** ******** Endpoints for users messages******* **/

app.get('/api/getMessages/:id', async (req, res) => {
  try {
    const { id: userId } = req.params;
    

    const query = `
     SELECT 
    message.*, 
    sender.username AS sender_username, 
    recipient.username AS recipient_username
    FROM message
    LEFT JOIN user AS sender ON message.sender_id = sender.id
    LEFT JOIN user AS recipient ON message.recipient_id = recipient.id
     WHERE (sender_id = ? AND (message.deleted_by_sender IS NULL OR message.deleted_by_sender = FALSE))
     OR (recipient_id = ? AND (message.deleted_by_recipient IS NULL OR message.deleted_by_recipient = FALSE))
   ORDER BY send_date ASC;


    `;

    const [rows] = await pool.query(query, [userId, userId]);

    console.log('Messages récupérés avec succès');

    res.json({ messages: rows });
  } catch (err) {
    console.error('Erreur lors de la récupération des messages depuis la base de données :', err);
    res.status(500).json({ error: 'Erreur lors de la récupération des messages' });
  }
});


app.get('/api/getAllMessages', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM message ORDER BY send_date ASC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur interne' });
  }
});


 app.delete('/api/messages/:id', async (req, res) => {
  const { id: messageId } = req.params;
  const userId = req.session.user.id; 

  try {
    
    const result = await pool.query(
      'UPDATE message SET deleted_by_sender = IF(sender_id = ? AND id = ?, true, deleted_by_sender), deleted_by_recipient = IF(recipient_id = ? AND id = ?, true, deleted_by_recipient) WHERE id = ?',
      [userId, messageId, userId, messageId, messageId]
    );

    console.log('Message marqué comme supprimé avec succès');
    
    
    res.json({ success: true, message: 'Message marqué comme supprimé avec succès' });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Erreur lors de la suppression du message' });
  }
});


   app.delete('/api/messages/:id', async (req, res) => {
   const { id: messageId } = req.params;

  try {
    
    const result = await pool.query(
      'DELETE FROM message WHERE id = ? AND deleted_by_sender = 1 AND deleted_by_recipient = 1',
      [messageId]
    );

    console.log('Message supprimé avec succès');

    
    res.json({ success: true, message: 'Message supprimé avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Erreur lors de la suppression du message' });
  }
});



app.get('/api/getConversations/:id', async (req, res) => {
  try {
    const { id: userId } = req.params;

    const query = `
      SELECT
        user.id AS recipient_id,
        user.username AS recipient_username,
        last_message.sender_id AS last_message_sender_id,
        last_message.recipient_id AS last_message_recipient_id,
        last_message.message_content,
        last_message.send_date AS last_message_send_date
      FROM (
        SELECT
          MAX(id) AS last_message_id
        FROM message
        WHERE sender_id = ? OR recipient_id = ?
        GROUP BY
          CASE
            WHEN sender_id = ? THEN recipient_id
            WHEN recipient_id = ? THEN sender_id
          END
      ) last_messages
      JOIN message AS last_message ON last_message.id = last_messages.last_message_id
      JOIN user ON (
        (user.id = last_message.sender_id AND last_message.recipient_id = ?)
        OR (user.id = last_message.recipient_id AND last_message.sender_id = ?)
      )
      ORDER BY last_message.send_date DESC;
    `;

    const [rows] = await pool.query(query, [userId, userId, userId, userId, userId, userId]);

    res.json({ messages: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur interne' });
  }
});


/**
 * Endpoint to get messages from a specific conversation
 */
app.get('/api/getMessagesForRecipient/:userId/:recipientId', async (req, res) => {
  try {
    const { userId, recipientId } = req.params;

    const query = `
      SELECT 
        message.*, 
        sender.username AS sender_username, 
        recipient.username AS recipient_username
      FROM message
      LEFT JOIN user AS sender ON message.sender_id = sender.id
      LEFT JOIN user AS recipient ON message.recipient_id = recipient.id
      WHERE 
        (sender_id = ? AND recipient_id = ? AND (message.deleted_by_sender IS NULL OR message.deleted_by_sender = FALSE))
        OR 
        (sender_id = ? AND recipient_id = ? AND (message.deleted_by_recipient IS NULL OR message.deleted_by_recipient = FALSE))
      ORDER BY send_date ASC;
    `;

    const [rows] = await pool.query(query, [userId, recipientId, recipientId, userId]);

    res.json({ messages: rows });
  } catch (err) {
    console.error('Erreur lors de la récupération des messages pour le destinataire :', err);
    res.status(500).json({ error: 'Erreur lors de la récupération des messages' });
  }
});


app.use('/', routes.router);

const SERVER_PORT = 3001;

server.listen(SERVER_PORT, () => {
    console.log('Start server on port ' + SERVER_PORT);
});
