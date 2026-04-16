const express = require('express');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// =============================================
// MIDDLEWARE
// =============================================

// Enable CORS — allow all origins in development
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      // Allow localhost on any port + any deployed frontend
      const allowedPatterns = [
        /^http:\/\/localhost:\d+$/,
        /^https?:\/\/.*\.vercel\.app$/,
        /^https?:\/\/.*\.netlify\.app$/,
      ];
      const isAllowed = allowedPatterns.some(pattern => pattern.test(origin));
      callback(null, isAllowed || true); // Allow all in dev
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Parse JSON request bodies
app.use(express.json());

// Request logging (development)
app.use((req, res, next) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// =============================================
// ROUTES
// =============================================

// Health check
app.get('/api/health', (req, res) => {
  const { isInMemoryMode } = require('./config/db');
  res.json({
    success: true,
    message: 'API is running',
    mode: isInMemoryMode() ? 'in-memory' : 'postgresql',
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({ success: false, error: { message: `Route ${req.path} not found` } });
});

// Centralized error handler (must be last)
app.use(errorHandler);

module.exports = app;
