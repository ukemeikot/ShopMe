import express from 'express';
import path from 'path';
import { ENV } from './config/env.js';

const app = express();
const __dirname = path.resolve();

app.get("/api/health", (req, res) => {
  res.send("OK the server is working now!!!");
});

// =================================================================
// LOCAL DEVELOPMENT ONLY (This part is ignored by Vercel)
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
  });
}

export default app;