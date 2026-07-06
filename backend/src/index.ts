import express, { Request, Response } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes';
import aiRoutes from './routes/aiRoutes';
import enterpriseRoutes from './routes/enterpriseRoutes';
import journalRoutes from './routes/journalRoutes';
import tripRoutes from './routes/tripRoutes';
import healthRoutes from './routes/healthRoutes';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || '*',
  }
});
const port = process.env.PORT || 5000;
const prisma = new PrismaClient({});

// Socket.io setup for real-time telehealth
const activeUsers = new Map<string, { socketId: string; role: string }>(); // userId -> { socketId, role }

io.on('connection', (socket) => {
  console.log('User connected to socket:', socket.id);

  socket.on('register', ({ userId, role }: { userId: string, role: string }) => {
    activeUsers.set(userId, { socketId: socket.id, role: role || 'USER' });
  });

  socket.on('initiate-call', ({ callerId, callerName, doctorId }) => {
    const doctorData = activeUsers.get(doctorId);
    if (doctorData) {
      io.to(doctorData.socketId).emit('incoming-call', { callerId, callerName });
    } else {
      socket.emit('call-failed', { message: 'Doctor is not online' });
    }
  });

  socket.on('initiate-call-test', ({ callerId, callerName }) => {
    let foundDoctor = false;
    for (const [userId, data] of activeUsers.entries()) {
      if (userId !== callerId && data.role === 'DOCTOR') {
        io.to(data.socketId).emit('incoming-call', { callerId, callerName });
        foundDoctor = true;
        break;
      }
    }
    if (!foundDoctor) {
      socket.emit('call-failed', { message: 'No Doctors are currently online to take the call.' });
    }
  });

  socket.on('accept-call', ({ callerId, roomId }) => {
    const callerData = activeUsers.get(callerId);
    if (callerData) {
      io.to(callerData.socketId).emit('call-accepted', { roomId });
    }
  });

  socket.on('reject-call', ({ callerId }) => {
    const callerData = activeUsers.get(callerId);
    if (callerData) {
      io.to(callerData.socketId).emit('call-rejected');
    }
  });

  socket.on('join-room', ({ roomId }) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
    socket.to(roomId).emit('user-joined-room', { socketId: socket.id });
  });

  socket.on('webrtc-offer', ({ roomId, offer }) => {
    socket.to(roomId).emit('webrtc-offer', { offer });
  });

  socket.on('webrtc-answer', ({ roomId, answer }) => {
    socket.to(roomId).emit('webrtc-answer', { answer });
  });

  socket.on('webrtc-ice-candidate', ({ roomId, candidate }) => {
    socket.to(roomId).emit('webrtc-ice-candidate', { candidate });
  });


  socket.on('send-message', ({ roomId, text, senderName }) => {
    console.log(`User ${socket.id} (${senderName}) sending message to room ${roomId}: ${text}`);
    // Broadcast to everyone in the room EXCEPT the sender
    socket.to(roomId).emit('receive-message', { text, senderName });
  });

  socket.on('disconnect', () => {
    for (const [userId, data] of activeUsers.entries()) {
      if (data.socketId === socket.id) {
        activeUsers.delete(userId);
        break;
      }
    }
  });
});

// Connect to MongoDB for Travel Features
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/vedaai_travel';
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB for Travel features'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
}));
app.use(express.json());

// Basic health check route
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'VedaAI Backend is running smoothly.' });
});

app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/enterprise', enterpriseRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/health', healthRoutes);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
