const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

// Authentication (simple token-based auth)
let authTokens = {
  "my_secret_token_12345": true
};

// WebSocket setup
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

// Variable to store the latest location
let currentLocation = null;

// Endpoint to update bus location
app.post('/update-location', (req, res) => {
  const { latitude, longitude, token } = req.body;
  if (latitude === undefined || longitude === undefined || token === undefined) {
    return res.status(400).json({ error: 'Latitude, Longitude, and Token are required' });
  }
  if (!authTokens[token]) {
    return res.status(401).json({ error: 'Invalid Token' });
  }
  currentLocation = { latitude, longitude, timestamp: new Date() };
  
  // Broadcast update to all connected clients
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(currentLocation));
    }
  });
  
  res.status(200).json({ message: 'Location updated successfully' });
});

// Endpoint to get the latest bus location
app.get('/get-bus-location', (req, res) => {
  if (!currentLocation) {
    return res.status(404).json({ error: 'No location found' });
  }
  res.status(200).json(currentLocation);
});

// WebSocket connection handler
wss.on('connection', (ws) => {
  console.log('Client connected');
  
  // Send the current location data to the connected client
  if (currentLocation) {
    ws.send(JSON.stringify(currentLocation));
  }
  
  // Handle disconnection
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
