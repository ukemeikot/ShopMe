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
// 3. LOCAL DEVELOPMENT ONLY
// =================================================================
if (process.env.NODE_ENV !== 'production') {
  const frontendPath = path.join(__dirname, '../admin/dist');
  app.use(express.static(frontendPath));

  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });

  const PORT = ENV.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running locally on port ${PORT}`);
    console.log(`Serving frontend from: ${frontendPath}`);
  });
}

export default app;