import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private token: string | null = null;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();

  public connect(token?: string): Socket | null {
    const activeToken = token || localStorage.getItem('apnose_access_token');
    if (!activeToken) {
      return null;
    }

    if (this.socket && this.socket.connected && this.token === activeToken) {
      return this.socket;
    }

    // Disconnect old socket if token changed
    if (this.socket) {
      this.socket.disconnect();
    }

    this.token = activeToken;

    const serverUrl =
      (import.meta as any).env?.VITE_SOCKET_URL ||
      (import.meta as any).env?.VITE_API_URL?.replace(/\/api\/v1\/?$/, '') ||
      'http://localhost:5000';

    try {
      this.socket = io(serverUrl, {
        auth: { token: activeToken },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 2000,
        timeout: 10000,
      });

      this.socket.on('connect', () => {
        console.log('⚡ Connected to ApnoSe Real-Time Server');
      });

      this.socket.on('connect_error', (err) => {
        console.warn('⚠️ Socket connection warning:', err.message);
      });

      this.socket.on('disconnect', (reason) => {
        console.log('🔌 Socket disconnected:', reason);
      });

      // Re-attach registered custom listeners
      this.listeners.forEach((callbacks, event) => {
        callbacks.forEach((cb) => {
          this.socket?.on(event, cb);
        });
      });

      return this.socket;
    } catch (error) {
      console.warn('Failed to initialize socket connection:', error);
      return null;
    }
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.token = null;
    }
  }

  public isConnected(): boolean {
    return !!this.socket?.connected;
  }

  public on(event: string, callback: (data: any) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    if (this.socket) {
      this.socket.on(event, callback);
    }

    // Return unbind function
    return () => this.off(event, callback);
  }

  public off(event: string, callback?: (data: any) => void): void {
    if (callback) {
      this.listeners.get(event)?.delete(callback);
      this.socket?.off(event, callback);
    } else {
      this.listeners.delete(event);
      this.socket?.off(event);
    }
  }

  public emit(event: string, data: any): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit(event, data);
    }
  }

  // Conversation Helpers
  public joinConversation(conversationId: string): void {
    this.emit('conversation:join', conversationId);
  }

  public leaveConversation(conversationId: string): void {
    this.emit('conversation:leave', conversationId);
  }

  public startTyping(conversationId: string, recipientId?: string): void {
    this.emit('typing:start', { conversationId, recipientId });
  }

  public stopTyping(conversationId: string, recipientId?: string): void {
    this.emit('typing:stop', { conversationId, recipientId });
  }

  public markMessageRead(conversationId: string, messageId: string): void {
    this.emit('message:read', { conversationId, messageId });
  }

  // Calling Signaling Helpers
  public initiateCall(recipientId: string, offer: any, callType: 'audio' | 'video'): void {
    this.emit('call:initiate', { recipientId, offer, callType });
  }

  public answerCall(callerId: string, answer: any): void {
    this.emit('call:answer', { callerId, answer });
  }

  public sendIceCandidate(targetUserId: string, candidate: any): void {
    this.emit('call:ice-candidate', { targetUserId, candidate });
  }

  public endCall(targetUserId: string): void {
    this.emit('call:end', { targetUserId });
  }
}

export const socketService = new SocketService();
