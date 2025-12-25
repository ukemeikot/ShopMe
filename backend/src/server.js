import express from 'express';
import path from 'path';
import { ENV } from './config/env.js';
import { connectDatabase } from './config/database.js';
import { clerkMiddleware } from '@clerk/express';
import { inngest, functions } from './config/inngest.js';
import { serve } from "inngest/express";

const app = express();
const __dirname = path.resolve();

// =================================================================
// 1. CONNECT TO DATABASE
// =================================================================
connectDatabase();

app.use(clerkMiddleware());
app.use(express.json());

// =================================================================
// 2. INNGEST WEBHOOK ENDPOINT - ALL METHODS
// =================================================================
const inngestHandler = serve({
  client: inngest,
  functions: functions,
});

app.get('/api/inngest', inngestHandler);
app.post('/api/inngest', inngestHandler);
app.put('/api/inngest', inngestHandler);

app.get("/api/health", (req, res) => {
  res.send("OK the server is working now!!!");
});

// =================================================================
// 3. SERVE FRONTEND (Static files first)
// =================================================================
const frontendPath = path.join(__dirname, '../admin/dist');
app.use(express.static(frontendPath));

// Catch-all route for SPA - MUST be last
app.get('/*', (req, res) => {  // ✅ Changed from '*' to '/*'
  const indexPath = path.join(frontendPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(404).send('Frontend not built');
    }
  });
});

// =================================================================
// 4. START SERVER
// =================================================================
const PORT = ENV.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔗 Inngest endpoint: http://localhost:${PORT}/api/inngest`);
});