import express from 'express';
import path from 'path';
import { ENV } from './config/env.js';
import { connectDatabase } from './config/database.js';
import { clerkMiddleware } from '@clerk/express'

const app = express();
const __dirname = path.resolve();

// =================================================================
// 1. CONNECT TO DATABASE (GLOBAL SCOPE)
// This runs in both Production (Vercel) and Local Development.
// =================================================================
connectDatabase();

app.use(clerkMiddleware()) //adds authentication object under the req=> req.auth

app.get("/api/health", (req, res) => {
  res.send("OK the server is working now!!!");
});

// =================================================================
// 2. LOCAL DEVELOPMENT ONLY CONFIGURATION
// =================================================================
if (process.env.NODE_ENV !== 'production') {
  const frontendPath = path.join(__dirname, '../admin/dist');
  app.use(express.static(frontendPath));

  app.get('/{*any}', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });

  const PORT = ENV.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running locally on port ${PORT}`);
    console.log(`Serving frontend from: ${frontendPath}`);
    // Note: connectDatabase() is already called at the top, so we don't need it here.
  });
}

export default app;