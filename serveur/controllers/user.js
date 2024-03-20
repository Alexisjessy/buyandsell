const db = require('../models/database.js');
db.initializePool();
const bcrypt = require('bcrypt');
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');
const uuid = require('uuid');
const CryptoJS = require('crypto-js');
const { OAuth2Client } = require('google-auth-library');
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
const credentials = require('../credentials.json');
const auth = require('../auth.js');
const tokens = require('../token.json');
const sendMail = require('./gmail')






    async function sendConfirmationEmail(email, confirmationLink) {
    const mailOptions = {
    from: 'send email',
    replyTo: 'no-reply@buyinlaos.com',
    to: email,
    subject: 'Confirmation de votre compte',
   html: `
      <p>Cliquez sur le bouton ci-dessous pour confirmer votre compte :</p>
      <a href="${confirmationLink}" style="display:inline-block; padding:10px 20px; font-size:16px; text-align:center; text-decoration:none; background-color:#007bff; color:#ffffff; border-radius:5px;">Confirmer le compte</a>
    `,
  };

  try {
    await sendMail(mailOptions);
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'e-mail de confirmation :', error);
  }
}



const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 3,
  handler: (req, res) => {
    res.status(403).json({ success: false, message: 'Trop de tentatives, réessayez plus tard.' });
  },
});

async function register(req, res) {
  
  const username = req.body.username;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const email = req.body.email;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  

 
const [existingEmailUsers] = await db.query('SELECT * FROM \`user\` WHERE email = ?', [email]);
const [existingUsernameUsers] = await db.query('SELECT * FROM  \`user\` WHERE username = ?', [username]);

if (existingEmailUsers.length > 0) {
  return res.status(400).json({ success: false, error: 'email_taken' });
}

if (existingUsernameUsers.length > 0) {
  return res.status(400).json({ success: false, error: 'username_taken' });
}


 
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  

  const confirmationCode = uuid.v4();
  const confirmationCodeHash = CryptoJS.SHA256(confirmationCode).toString();
  
  
  
       

  try {
    await db.query(`
      INSERT INTO \`user\` (username,  firstname, lastname, password,  email, confirmation_code, confirmed)
      VALUES (?, ?, ?, ?, ?, ?, ? ) `,
      [username,  firstname, lastname, passwordHash, email, confirmationCodeHash, 0]);

    const confirmationLink = `http://localhost:3000/confirm/${confirmationCodeHash}`;
    sendConfirmationEmail(email, confirmationLink);

    return res.json({ success: true, message: 'Un mail de confirmation vous a été envoyé à votre adresse e-mail.' });

  } catch (e) {
    return res.json({ success: false, message: e.toString() });
  }
}


async function confirmAccount(req, res) {
  const confirmationCode = req.params.confirmationCodeHash;

  
  const [user] = await db.query('SELECT * FROM \`user\` WHERE confirmation_code = ?', [confirmationCode]);

  if (user.length > 0) {

    await db.query('UPDATE `user` SET confirmed = 1, confirmation_code = NULL WHERE confirmation_code = ?', [confirmationCode]);
    return res.status(200).json({ success: true, message: 'Votre compte a été confirmé avec succès. Vous pouvez maintenant vous connecter.'});
  } else {
    return res.status(410).json({ success: false, error: 'Code de confirmation expiré. Veuillez demander un nouveau code.' });
  }
}





async function login(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  
  const [users] = await db.query('SELECT * FROM \`user\` WHERE email = ?', [email]);

       if (users.length === 0) {
        res.status(401).json({ success: false, message: 'Utilisateur non trouvé.' });
    return;
  }
   const user = users[0];

      if (!user.confirmed) {
        res.status(401).json({ success: false, message: 'Votre compte n\'est pas confirmé. Veuillez vérifier votre e-mail pour la confirmation.' });
    return;
  }

    const match = await bcrypt.compare(password, users[0].password);

    const [blockedUser] = await db.query('SELECT * FROM `blocked_users` WHERE email = ?', [email]);

      if (match) {
       req.session.connected = true;
       req.session.user = users[0];

    if (blockedUser.length > 0) {
      await db.query('DELETE FROM `blocked_users` WHERE email = ?', [email]);
    }

    return res.json({
        success: true,
        user: { ...users[0], password: undefined },
    });
  }

  if (blockedUser.length > 0) {
     await db.query('UPDATE `blocked_users` SET last_attempt_timestamp = NOW(), attempt_count = attempt_count + 1, blocked_until = DATE_ADD(NOW(), INTERVAL 5 MINUTE) WHERE email = ?', [email]);

    return;
  } else {
    await db.query('INSERT INTO `blocked_users` (email, last_attempt_timestamp, attempt_count, blocked_until) VALUES (?, NOW(), 1, DATE_ADD(NOW(), INTERVAL 5 MINUTE))', [email]);
  }

  return res.status(401).json({ success: false, message: 'Identifiants incorrects.' });
}


async function logout(req, res) {
  req.session.destroy((err) => {
    
    if (err) {
      return res.status(500).json({
        'error': 'Impossible de mettre fin à la session',
      });
    }
    
    res.clearCookie('session');
    return res.json({ 'message': 'End of session' });
    res.redirect('/login');
    
  });
}

module.exports.loginLimiter = loginLimiter;
module.exports.register = register;
module.exports.login = login;
module.exports.logout = logout;
module.exports.confirmAccount = confirmAccount;