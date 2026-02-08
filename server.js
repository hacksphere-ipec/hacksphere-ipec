const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Helper function to read JSON data
function readJSONFile(filename) {
    try {
        const data = fs.readFileSync(path.join(__dirname, 'data', filename), 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading ${filename}:`, error);
        return [];
    }
}

// Routes

// Home route - serve main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Get all events
app.get('/api/events', (req, res) => {
    const events = readJSONFile('events.json');
    res.json(events);
});

// Get specific event by ID
app.get('/api/events/:id', (req, res) => {
    const events = readJSONFile('events.json');
    const event = events.find(e => e.id === parseInt(req.params.id));
    
    if (event) {
        res.json(event);
    } else {
        res.status(404).json({ error: 'Event not found' });
    }
});

// Get leadership data
app.get('/api/leadership', (req, res) => {
    const leadership = readJSONFile('leadership.json');
    res.json(leadership);
});

// Event details page
app.get('/event/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'event.html'));
});

// 404 handler
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Error handler
app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Tech Society Website running at http://localhost:${PORT}`);
    console.log(`📁 Serving static files from: ${path.join(__dirname, 'public')}`);
});