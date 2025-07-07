import cors from "cors";
import express, { Request, Response } from "express";
import {
  sendLiveActivityEndNotification,
  sendLiveActivityStartNotification,
  sendLiveActivityUpdateNotification,
} from "./liveActivityService.js";
import type {
  LiveActivityEndRequest,
  LiveActivityStartRequest,
  LiveActivityUpdateRequest,
} from "./types.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Live Activity endpoints
app.post("/api/live-activity/start", async (req: Request, res: Response) => {
  try {
    const request: LiveActivityStartRequest = req.body;

    if (!request.token || !request.payload) {
      return res.status(400).json({
        error: "Missing required fields: token and payload are required",
      });
    }

    if (
      !request.payload.title ||
      !request.payload.startTimeMs ||
      !request.payload.endTimeMs
    ) {
      return res.status(400).json({
        error:
          "Missing required payload fields: title, startTimeMs, and endTimeMs are required",
      });
    }

    await sendLiveActivityStartNotification(request);

    res.json({
      success: true,
      message: "Live activity start notification sent successfully",
    });
  } catch (error) {
    console.error("Error in /start endpoint:", error);
    res.status(500).json({
      error: "Failed to send live activity start notification",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

app.post("/api/live-activity/update", async (req: Request, res: Response) => {
  try {
    const request: LiveActivityUpdateRequest = req.body;

    if (!request.token || !request.payload) {
      return res.status(400).json({
        error: "Missing required fields: token and payload are required",
      });
    }

    await sendLiveActivityUpdateNotification(request);

    res.json({
      success: true,
      message: "Live activity update notification sent successfully",
    });
  } catch (error) {
    console.error("Error in /update endpoint:", error);
    res.status(500).json({
      error: "Failed to send live activity update notification",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

app.post("/api/live-activity/end", async (req: Request, res: Response) => {
  try {
    const request: LiveActivityEndRequest = req.body;

    if (!request.token) {
      return res.status(400).json({
        error: "Missing required field: token is required",
      });
    }

    await sendLiveActivityEndNotification(request);

    res.json({
      success: true,
      message: "Live activity end notification sent successfully",
    });
  } catch (error) {
    console.error("Error in /end endpoint:", error);
    res.status(500).json({
      error: "Failed to send live activity end notification",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// 404 handler
app.use("*", (req: Request, res: Response) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Live Activity Server running on http://localhost:${PORT}`);
  console.log(`📱 API base: http://localhost:${PORT}/api/live-activity`);

  // Log environment status
  const hasKeys = !!(
    process.env.APN_KEY &&
    process.env.APN_KEY_ID &&
    process.env.APPLE_TEAM_ID
  );
  console.log(
    `🔐 APNs config: ${
      hasKeys ? "✅ Ready" : "❌ Missing environment variables"
    }`
  );

  if (!hasKeys) {
    console.log(
      "⚠️  Please set APN_KEY, APN_KEY_ID, and APPLE_TEAM_ID in your .env file"
    );
  }
});
