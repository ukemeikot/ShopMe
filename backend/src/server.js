import express from 'express';
// remove path import if not used elsewhere
import { ENV } from './config/env.js';

const app = express();

app.get("/api/health", (req, res) => {
  res.send("OK the server is working now!!!");
});

// --- REMOVE THE STATIC SERVING LOGIC HERE ---
// Do not use express.static or path.join to serve the frontend.
// Vercel's Edge Network handles this via vercel.json.

// Only listen to the port if we are NOT in production (running locally)
// Vercel requires you to export the app, it handles the listening automatically.
if (process.env.NODE_ENV !== 'production') {
  const PORT = ENV.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running locally on port ${PORT}`);
  });
}

// REQUIRED: Export the app for Vercel to load it as a Serverless Function
export default app;