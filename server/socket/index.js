export function setupSocket(io) {
  const onlineUsers = new Map();

  io.on('connection', (socket) => {
    console.log('🔌 User connected:', socket.id);

    socket.on('user-online', (userId) => {
      onlineUsers.set(userId, socket.id);
      io.emit('online-count', onlineUsers.size);
    });

    socket.on('send-message', async (data) => {
      const { from, to, content, type, fileUrl, fileName } = data;
      
      // Save to database
      try {
        const { Message } = await import('../models/index.js');
        await Message.create({
          senderId: from,
          receiverId: to,
          content,
          type: type || 'text',
          fileUrl,
          fileName,
        });
      } catch (err) {
        console.error('Failed to save message to DB', err);
      }

      const targetSocket = onlineUsers.get(to);
      if (targetSocket) {
        io.to(targetSocket).emit('receive-message', {
          from, content, type, fileUrl, fileName,
          timestamp: new Date().toISOString()
        });
      }
    });

    socket.on('typing', ({ to }) => {
      const targetSocket = onlineUsers.get(to);
      if (targetSocket) io.to(targetSocket).emit('user-typing', { from: socket.userId });
    });

    socket.on('disconnect', () => {
      for (const [userId, sid] of onlineUsers.entries()) {
        if (sid === socket.id) { onlineUsers.delete(userId); break; }
      }
      io.emit('online-count', onlineUsers.size);
    });
  });
}
