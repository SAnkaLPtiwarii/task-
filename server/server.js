const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const taskRoutes = require('./routes/taskRoutes');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// CORS Configuration
app.use(cors({
    origin: ['https://inquisitive-froyo-be8b23.netlify.app', 'http://localhost:5173'],
    credentials: true
}));

app.use(express.json());

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'Task Manager API is running',
        status: 'active',
        endpoints: {
            tasks: '/api/tasks',
            health: '/health'
        }
    });
});

// Health check route
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        time: new Date().toISOString(),
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

// API routes
app.use('/api/tasks', taskRoutes);

// Handle 404 errors
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: 'The requested resource was not found on this server',
        availableRoutes: [
            '/',
            '/health',
            '/api/tasks'
        ]
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message
    });
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
