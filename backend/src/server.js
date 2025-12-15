import express from 'express';
import path from 'path';
import { ENV } from './config/env.js';

const __dirname = path.resolve();

const app = express();

app.get("/api/health", (req, res) => {
  res.send("OK the server is working now!!!");
});

//make the app ready for deployment
if(ENV.NODE_ENV === 'production'){
  app.use(express.static(path.join(__dirname, '../admin/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../admin', 'dist', 'index.html'));
  });
}

app.listen(ENV.PORT, () => {
  console.log('Server is running on port 3000');
});


// Only listen to the port if we are NOT in production (running locally)
if (process.env.NODE_ENV !== 'production') {
  app.listen(ENV.PORT, () => {
    console.log(`Server is running on port ${ENV.PORT}`);
  });
}

// REQUIRED: Export the app for Vercel to load it as a Serverless Function
export default app;