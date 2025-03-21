
const WebSocket = require('ws');
const dotenv = require('dotenv');

//Load environment variables
dotenv.config();

const port = process.env.PORT || 8080;
const server = new WebSocket.Server({ port });

const clients = new Set();

server.on('connection', (ws) => {
    console.log('New client connected!');
    clients.add(ws);

    ws.on('message', (message) => {
        console.log(`Received: ${message}`);
        
        //Broadcast message to all clients and send a reply to the sender
        for (const client of clients) {
            if (client.readyState === WebSocket.OPEN) {
                if (client === ws) {
                    client.send(`You sent: ${message}`);
                } else {
                    client.send(`Broadcast: ${message}`);
                }
            }
        }
    });
        
    ws.on('close', () => {
        console.log('Client disconnected');
        clients.delete(ws);
    });

    ws.send('Hello!, Welcome to WebSocket Server!');
});

console.log(`WebSocket server is running on port ${port}`);