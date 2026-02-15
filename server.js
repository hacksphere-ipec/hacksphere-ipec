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
app.use('/data', express.static(path.join(__dirname, 'data')));

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

// Helper function to read year-based team data
function readTeamsForYear(year) {
    try {
        const filePath = path.join(__dirname, 'data', year, 'teams.json');
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading teams for year ${year}:`, error);
        return null;
    }
}

// Get available years
function getAvailableYears() {
    try {
        const dataDir = path.join(__dirname, 'data');
        const items = fs.readdirSync(dataDir, { withFileTypes: true });
        const years = items
            .filter(item => item.isDirectory() && item.name.startsWith('fy'))
            .map(item => item.name)
            .sort()
            .reverse(); // Most recent first
        return years;
    } catch (error) {
        console.error('Error getting available years:', error);
        return ['fy26'];
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

// Get available team years
app.get('/api/teams/years', (req, res) => {
    const years = getAvailableYears();
    res.json(years);
});

// Get teams data for a specific year
app.get('/api/teams/:year', (req, res) => {
    const year = req.params.year;
    const teams = readTeamsForYear(year);
    
    if (teams) {
        res.json(teams);
    } else {
        res.status(404).json({ error: `Teams data not found for year ${year}` });
    }
});

// Legacy route - defaults to latest year
app.get('/api/teams', (req, res) => {
    const years = getAvailableYears();
    const latestYear = years[0] || 'fy26';
    const teams = readTeamsForYear(latestYear);
    res.json(teams || {});
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