import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import userRoutes from './routes/userRoutes';
import chatRoutes from './routes/chatRoutes';
import productoRoutes from './routes/productoRoutes';
import path from 'path';
dotenv.config();

const app = express();
const port = process.env.PORT || 3030;

// Middleware
app.use(morgan('dev'));
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'], // Agrega aquí los orígenes permitidos
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.use(helmet());
app.use(express.json());

// Routes
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/productos', productoRoutes);

// Database connection
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});