import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { env } from './env';
import { verifyAccessToken } from '../utils/jwt';

let io: SocketIOServer | null = null;
const onlineUsers = new Map<string, string>(); // userId -> socketId

export const initializeSocket = (httpServer: HttpServer): SocketIOServer => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: env.CLIENT_URL,
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingTimeout: 60000,
  });

  // Socket Authentication Middleware
  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];
    if (!token) {
      return next(new Error('Authentication error: Token required'));
    }

    const payload = verifyAccessToken(token);
    if (!payload) {
      return next(new Error('Authentication error: Invalid or expired token'));
    }

    socket.data.user = payload;
    next();
  });

  io.on('connection', (socket: Socket) => {
    const userId = socket.data.user?.userId;
    if (userId) {
      onlineUsers.set(userId, socket.id);
      console.log(`🔌 Socket connected: User ${userId} (${socket.id})`);

      // Broadcast user online status
      socket.broadcast.emit('user:online', { userId });
    }

    // Join personal room
    if (userId) {
      socket.join(`user:${userId}`);
    }

    // Join conversation room
    socket.on('conversation:join', (conversationId: string) => {
      socket.join(`conversation:${conversationId}`);
      console.log(`User ${userId} joined room conversation:${conversationId}`);
    });

    // Leave conversation room
    socket.on('conversation:leave', (conversationId: string) => {
      socket.leave(`conversation:${conversationId}`);
    });

    // Typing indicators
    socket.on('typing:start', ({ conversationId, recipientId }: { conversationId: string; recipientId?: string }) => {
      if (conversationId) {
        socket.to(`conversation:${conversationId}`).emit('typing:start', { conversationId, userId });
      } else if (recipientId) {
        socket.to(`user:${recipientId}`).emit('typing:start', { conversationId, userId });
      }
    });

    socket.on('typing:stop', ({ conversationId, recipientId }: { conversationId: string; recipientId?: string }) => {
      if (conversationId) {
        socket.to(`conversation:${conversationId}`).emit('typing:stop', { conversationId, userId });
      } else if (recipientId) {
        socket.to(`user:${recipientId}`).emit('typing:stop', { conversationId, userId });
      }
    });

    // Real-time message read acknowledgement
    socket.on('message:read', ({ conversationId, messageId }: { conversationId: string; messageId: string }) => {
      socket.to(`conversation:${conversationId}`).emit('message:read', { conversationId, messageId, readerId: userId });
    });

    // WebRTC Real-Time Calling Events (Audio / Video Call Signaling)
    socket.on('call:initiate', ({ recipientId, offer, callType }: { recipientId: string; offer: any; callType: 'audio' | 'video' }) => {
      socket.to(`user:${recipientId}`).emit('call:incoming', {
        callerId: userId,
        callerName: socket.data.user?.name,
        offer,
        callType,
      });
    });

    socket.on('call:answer', ({ callerId, answer }: { callerId: string; answer: any }) => {
      socket.to(`user:${callerId}`).emit('call:answered', {
        recipientId: userId,
        answer,
      });
    });

    socket.on('call:ice-candidate', ({ targetUserId, candidate }: { targetUserId: string; candidate: any }) => {
      socket.to(`user:${targetUserId}`).emit('call:ice-candidate', {
        senderId: userId,
        candidate,
      });
    });

    socket.on('call:end', ({ targetUserId }: { targetUserId: string }) => {
      socket.to(`user:${targetUserId}`).emit('call:ended', { userId });
    });

    // Disconnect
    socket.on('disconnect', () => {
      if (userId) {
        onlineUsers.delete(userId);
        console.log(`🔌 Socket disconnected: User ${userId}`);
        socket.broadcast.emit('user:offline', { userId, lastSeen: new Date() });
      }
    });
  });

  return io;
};

export const getIO = (): SocketIOServer => {
  if (!io) {
    throw new Error('Socket.io has not been initialized');
  }
  return io;
};

export const emitToUser = (userId: string, event: string, data: any): void => {
  if (io) {
    io.to(`user:${userId}`).emit(event, data);
  }
};

export const emitToConversation = (conversationId: string, event: string, data: any): void => {
  if (io) {
    io.to(`conversation:${conversationId}`).emit(event, data);
  }
};
