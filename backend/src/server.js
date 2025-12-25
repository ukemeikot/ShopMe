import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { ENV } from "./config/env.js";
import { connectDatabase } from "./config/database.js";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";
import { inngest, functions } from "./config/inngest.js";

// ----------------------------------------------------------------
// Setup __dirname (ESM-safe)
// ----------------------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// =================================================================
// 1. CONNECT TO DATABASE
// =================================================================
connectDatabase();

// =================================================================
// 2. INNGEST ENDPOINT (MUST BE FIRST)
// =================================================================
app.use(
  "/api/inngest",
  serve({
    client: inngest,
    functions,
  })
);

// =================================================================
// 3. AUTH MIDDLEWARE (EXCLUDE INNGEST)
// =================================================================
app.use((req, res, next) => {
  if (req.path.startsWith("/api/inngest")) return next();
  return clerkMiddleware()(req, res, next);
});

// =================================================================
// 4. JSON BODY PARSER (AFTER INNGEST)
// =================================================================
app.use(express.json());

// =================================================================
// 5. HEALTH CHECK
// =================================================================
app.get("/api/health", (_req, res) => {
  res.status(200).send("OK – server is healthy");
});

// =================================================================
// 6. SERVE FRONTEND STATIC FILES
// =================================================================
const frontendPath = path.join(__dirname, "../admin/dist");
app.use(express.static(frontendPath));

// =================================================================
// 7. SPA FALLBACK (LAST)
// =================================================================
app.use((req, res, next) => {
  if (!req.path.startsWith("/api")) {
    const indexPath = path.join(frontendPath, "index.html");
    res.sendFile(indexPath, (err) => {
      if (err) res.status(404).send("Frontend not built");
    });
  } else {
    next();
  }
});

// =================================================================
// 8. START SERVER
// =================================================================
const PORT = ENV.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 Server running");
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`❤️  Health: http://localhost:${PORT}/api/health`);
  console.log(`⚡ Inngest: http://localhost:${PORT}/api/inngest`);
});
