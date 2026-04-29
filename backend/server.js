/**
 * Red Root Java - Backend Server
 * Customer Feedback API
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const { testConnection } = require('./config/database');
const feedbackRoutes = require('./routes/feedback');

// ============================================
// INITIALIZE EXPRESS APP
// ============================================
const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// MIDDLEWARE
// ============================================

// CORS Configuration
const corsOptions = {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};
app.use(cors(corsOptions));

// Parse JSON and URL-encoded bodies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from parent directory (frontend)
app.use(express.static(path.join(__dirname, '..')));

// Serve uploaded files
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Request logging (development)
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
        next();
    });
}

// ============================================
// ROUTES
// ============================================

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Red Root Java API is running',
        timestamp: new Date().toISOString()
    });
});

// Feedback routes
app.use('/api', feedbackRoutes);

// Serve frontend pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.get('/feedback', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'feedback.html'));
});

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint tidak ditemukan'
    });
});

// Global error handler
app.use((error, req, res, next) => {
    console.error('Server Error:', error);

    res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Terjadi kesalahan internal server',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
});

// ============================================
// START SERVER
// ============================================
async function startServer() {
    // Test database connection
    const dbConnected = await testConnection();

    if (!dbConnected) {
        console.warn('⚠️  Server starting without database connection');
        console.warn('   Make sure MySQL is running and check your .env configuration');
    }

    app.listen(PORT, () => {
        console.log('');
        console.log('============================================');
        console.log('   RED ROOT JAVA - FEEDBACK API SERVER');
        console.log('============================================');
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`📁 Static files served from: ${path.join(__dirname, '..')}`);
        console.log(`📷 Uploads directory: ${uploadsDir}`);
        console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log('============================================');
        console.log('');
        console.log('Available endpoints:');
        console.log(`  GET  http://localhost:${PORT}/api/health`);
        console.log(`  POST http://localhost:${PORT}/api/feedback`);
        console.log(`  GET  http://localhost:${PORT}/api/testimonials`);
        console.log(`  GET  http://localhost:${PORT}/api/feedback/stats`);
        console.log('');
    });
}

startServer();

module.exports = app;
