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
  signingKey: ENV.INGEST_SIGNING_KEY,
});

app.get('/api/inngest', inngestHandler);
app.post('/api/inngest', inngestHandler);
app.put('/api/inngest', inngestHandler);

app.get("/api/health", (req, res) => {
  res.send("OK the server is working now!!!");
});

// =================================================================
// 3. SERVE FRONTEND STATIC FILES
// =================================================================
const frontendPath = path.join(__dirname, '../admin/dist');
app.use(express.static(frontendPath));

// =================================================================
// 4. HANDLE ALL OTHER ROUTES (SPA fallback) - MUST BE LAST
// =================================================================
app.use((req, res, next) => {
  // Only serve index.html for non-API routes
  if (!req.path.startsWith('/api')) {
    const indexPath = path.join(frontendPath, 'index.html');
    res.sendFile(indexPath, (err) => {
      if (err) {
        res.status(404).send('Frontend not built');
      }
    });
  } else {
    next();
  }
});

// =================================================================
// 5. START SERVER
// =================================================================
const PORT = ENV.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔗 Inngest endpoint: http://localhost:${PORT}/api/inngest`);
});