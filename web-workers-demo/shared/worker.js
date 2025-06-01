// Shared Worker for chat application
const connections = new Set();

// Handle connections from different windows
self.onconnect = function(e) {
    const port = e.ports[0];
    connections.add(port);
    
    // Start the port
    port.start();
    
    // Listen for messages from this connection
    port.onmessage = function(e) {
        const message = e.data;
        
        switch(message.type) {
            case 'connect':
                // Broadcast system message about new user
                broadcast({
                    type: 'system',
                    data: `User ${message.userId} joined the chat`
                });
                break;
                
            case 'message':
                // Broadcast the message to all connections
                broadcast({
                    type: 'message',
                    data: message.data,
                    senderId: message.userId
                });
                break;
        }
    };
    
    // Handle disconnection
    port.onmessageerror = function() {
        connections.delete(port);
    };
};

// Function to broadcast messages to all connections
function broadcast(message) {
    connections.forEach(port => {
        try {
            port.postMessage(message);
        } catch (error) {
            console.error('Error sending message to port:', error);
            connections.delete(port);
        }
    });
}
