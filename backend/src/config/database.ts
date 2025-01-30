import { ConnectionPool, config } from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig: config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_NAME,
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
};

export const pool = new ConnectionPool(dbConfig);

export const connectDB = async () => {
  try {
    await pool.connect();
    console.log('Connected to SQL Server');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};