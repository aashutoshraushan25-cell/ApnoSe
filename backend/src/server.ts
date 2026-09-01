import http from 'http';
import { createApp } from './app';
import { env } from './config/env';
import { connectDatabase, disconnectDatabase } from './config/database';
import { initializeSocket } from './config/socket';

const startServer = async () => {
  try {
    // 1. Connect to MongoDB
    await connectDatabase();

    // 2. Create Express App
    const app = createApp();

    // 3. Create HTTP Server & Attach Socket.IO
    const httpServer = http.createServer(app);
    initializeSocket(httpServer);

    // 4. Start Listening
    httpServer.listen(env.PORT, () => {
      console.log(`
=====================================================
🌸 APNO SE — REST API & REAL-TIME SERVER STARTED 🌸
=====================================================
🚀 Server Port    : ${env.PORT}
🌍 Environment    : ${env.NODE_ENV}
📦 REST Base URL  : http://localhost:${env.PORT}/api/v1
⚡ Socket.IO Ready: http://localhost:${env.PORT}
🏥 Health Check   : http://localhost:${env.PORT}/api/v1/health
=====================================================
      `);
    });

    // Graceful Shutdown
    const handleShutdown = async (signal: string) => {
      console.log(`\nReceived ${signal}. Shutting down gracefully...`);
      httpServer.close(async () => {
        await disconnectDatabase();
        console.log('HTTP and MongoDB connections closed. Exiting process.');
        process.exit(0);
      });
    };

    process.on('SIGINT', () => handleShutdown('SIGINT'));
    process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  } catch (error) {
    console.error('Fatal Server Initialization Error:', error);
    process.exit(1);
  }
};

startServer();
