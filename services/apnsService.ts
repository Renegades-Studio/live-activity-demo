import type {
  APNSConfig,
  APNSNotificationPayload,
  LiveActivityData,
  LiveActivityEvent,
} from "@/types/liveActivity";

/**
 * APNs Service for Live Activities
 * Handles creation of APNs notification payloads and simulates backend APNs calls
 */
export class APNSService {
  private static readonly DEFAULT_CONFIG: APNSConfig = {
    topic: "com.renegades.liveactivitydemo.push-type.liveactivity",
    pushType: "liveactivity",
    priority: 10,
  };

  /**
   * Creates an APNs notification payload for starting a live activity
   */
  static createStartNotification(
    data: LiveActivityData
  ): APNSNotificationPayload {
    return this.createNotificationPayload("start", data, {
      title: "Live Activity Started!",
      body: `${data.title} - Check your Dynamic Island`,
    });
  }

  /**
   * Creates an APNs notification payload for updating a live activity
   */
  static createUpdateNotification(
    data: LiveActivityData
  ): APNSNotificationPayload {
    return this.createNotificationPayload("update", data, {
      title: "Live Activity Updated!",
      body: `${data.title} - Activity has been updated`,
    });
  }

  /**
   * Creates an APNs notification payload for ending a live activity
   */
  static createEndNotification(): APNSNotificationPayload {
    return this.createNotificationPayload(
      "end",
      {
        startTimeMs: 0,
        endTimeMs: 0,
        title: "",
      },
      {
        title: "Live Activity Ended",
        body: "The live activity has been completed",
      }
    );
  }

  /**
   * Private helper to create notification payload structure
   */
  private static createNotificationPayload(
    event: LiveActivityEvent,
    data: LiveActivityData,
    alert: { title: string; body: string }
  ): APNSNotificationPayload {
    return {
      aps: {
        timestamp: Math.floor(Date.now() / 1000),
        event,
        "attributes-type": "WidgetAttributes",
        attributes: {
          type: "preGame",
          startTimeMs: data.startTimeMs,
          endTimeMs: data.endTimeMs,
          title: data.title,
        },
        "content-state": {
          type: "preGame",
          startTimeMs: data.startTimeMs,
          endTimeMs: data.endTimeMs,
          title: data.title,
        },
        alert,
      },
    };
  }

  /**
   * Simulates sending an APNs notification
   * In production, this would be handled by your backend server
   */
  static async simulateAPNSNotification(
    payload: APNSNotificationPayload,
    token: string,
    config: Partial<APNSConfig> = {}
  ): Promise<void> {
    const finalConfig = { ...this.DEFAULT_CONFIG, ...config };

    console.log("🚀 SIMULATING APNs NOTIFICATION");
    console.log("📍 Topic:", finalConfig.topic);
    console.log("🔐 Token:", token);
    console.log("📦 Payload:", JSON.stringify(payload, null, 2));

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    console.log("✅ APNs notification would be sent to Apple servers");
    console.log(
      "💡 In production, this would be handled by your backend using node-apn or similar"
    );
  }
}

/**
 * Utility function to validate live activity data
 */
export const validateLiveActivityData = (data: LiveActivityData): void => {
  if (!data.title || data.title.trim().length === 0) {
    throw new Error("Live activity title is required");
  }

  if (data.startTimeMs <= 0) {
    throw new Error("Start time must be greater than 0");
  }

  if (data.endTimeMs <= data.startTimeMs) {
    throw new Error("End time must be greater than start time");
  }
};

/**
 * Utility function to create sample live activity data
 */
export const createSampleLiveActivityData = (
  durationMinutes: number = 10,
  title: string = "Live Activity Demo"
): LiveActivityData => {
  const startTime = Date.now();
  const endTime = startTime + durationMinutes * 60 * 1000;

  return {
    startTimeMs: startTime,
    endTimeMs: endTime,
    title,
  };
};
