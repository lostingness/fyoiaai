import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Proxy for Fyoia Text AI
  app.post("/api/groq/chat", async (req, res) => {
    try {
      const response = await fetch("https://my.lostingness.site/ani.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body) // pass exactly what the frontend asked
      });
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("API error:", error);
      res.status(500).json({ error: "Failed to fetch response from Fyoia API" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
