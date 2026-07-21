import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/index.js';

dotenv.config();

// Allow custom/corporate proxy SSL certificates in Node environment if needed
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Mount API Router
app.use('/api', apiRoutes);

// Catch-all 404 handler for unknown API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found.' });
});

// Global Error Handling Middleware (prevents server crashes)
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.message || err);
  if (!res.headersSent) {
    res.status(500).json({
      error: err.message || 'Internal Server Error',
    });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 DevPath AI Express Server running on http://localhost:${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
});
