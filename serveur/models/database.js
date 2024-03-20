const mysql2 = require('mysql2/promise');

let pool;
require('dotenv').config();
const initializePool = async () => {
  try {
    pool = await mysql2.createPool({
      host: "db.3wa.io",
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 100,
      queueLimit: 0,
    });
    console.log('Database pool initialized successfully');
  } catch (error) {
    console.error('Error initializing database pool:', error);
  }
};

const getPool = () => pool;

const query = async (...args) => {
  const connection = await pool.getConnection();
  try {
    return await connection.query(...args);
  } finally {
    connection.release();
  }
};

module.exports = {
  initializePool,
  getPool,
  query,
};
