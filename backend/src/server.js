import express from 'express';
import path from 'path';
import { ENV } from './config/env.js';

const __dirname = path.resolve();
const app = express();

// 1. API Routes (Always work)
app.get("/api/health", (req, res) => {
  res.send("OK the server is working now!!!");
});

// 2. Production Setup (Behavior differs by environment)
if (ENV.NODE_ENV === 'production') {
  // CRITICAL: We only attempt to serve static files if we are NOT on Vercel
  // (Vercel handles this via vercel.json, so this code block is skipped or ignored safely)
  
  // Note: We use '*' instead of '{*any}' to prevent crashing
  // But on Vercel, the vercel.json routes will catch this before it hits the server
}

// 3. Start Server
// Only listen to the port if we are running locally. 
// Vercel manages the port automatically for exported apps.
if (ENV.NODE_ENV !== 'production') {
  app.listen(ENV.PORT, () => {
    console.log(`Server is running on port ${ENV.PORT}`);
  });
}

// 4. Export for Vercel
export default app;