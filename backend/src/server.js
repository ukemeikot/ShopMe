import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { ENV } from "./config/env.js";
import { connectDatabase } from "./config/database.js";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";
import { inngest, functions } from "./config/inngest.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// =================================================================
// 1. CONNECT DATABASE
// =================================================================
connectDatabase();

// =================================================================
// 2. INNGEST — RAW BODY (MUST BE FIRST)
// =================================================================
app.use(
  "/api/inngest",
  express.raw({ type: "*/*" }),
  serve({
    client: inngest,
    functions,
  })
);

// =================================================================
// 3. AUTH (EXCLUDE INNGEST)
// =================================================================
app.use((req, res, next) => {
  if (req.path.startsWith("/api/inngest")) return next();
  return clerkMiddleware()(req, res, next);
});

// =================================================================
// 4. JSON BODY PARSER (NORMAL APIs)
// =================================================================
app.use(express.json());

// =================================================================
// 5. HEALTH CHECK
// =================================================================
app.get("/api/health", (_req, res) => {
  res.status(200).send("OK – server is healthy");
});

// =================================================================
// 6. FRONTEND STATIC FILES
// =================================================================
const frontendPath = path.join(__dirname, "../admin/dist");
app.use(express.static(frontendPath));

// =================================================================
// 7. SPA FALLBACK (LAST)
// =================================================================
app.use((req, res, next) => {
  if (!req.path.startsWith("/api")) {
    res.sendFile(path.join(frontendPath, "index.html"));
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
  console.log(`❤️  Health: /api/health`);
  console.log(`⚡ Inngest: /api/inngest`);
});
