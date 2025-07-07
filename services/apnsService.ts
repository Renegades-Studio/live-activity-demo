import type { LiveActivityData } from "@/types/liveActivity";

/**
 * APNs Service for Live Activities
 * Makes HTTP calls to the local Express server which handles real APNs notifications
 */
export class APNSService {
  private static readonly SERVER_BASE_URL =
    "http://localhost:3000/api/live-activity";

  /**
   * Starts a live activity by calling the server
   */
  static async startLiveActivity(
    token: string,
    data: LiveActivityData,
    isSandbox: boolean
  ): Promise<void> {
    console.log(
      `🚀 Starting live activity via server (${
        isSandbox ? "sandbox" : "production"
      })...`
    );

    const response = await fetch(`${this.SERVER_BASE_URL}/start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        payload: {
          startTimeMs: data.startTimeMs,
          endTimeMs: data.endTimeMs,
          title: data.title,
        },
        isSandbox,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Server error: ${error.error || "Unknown error"}`);
    }

    const result = await response.json();
    console.log("✅ Live activity started:", result.message);
  }

  /**
   * Updates a live activity by calling the server
   */
  static async updateLiveActivity(
    token: string,
    data: LiveActivityData,
    isSandbox: boolean
  ): Promise<void> {
    console.log(
      `🔄 Updating live activity via server (${
        isSandbox ? "sandbox" : "production"
      })...`
    );

    const response = await fetch(`${this.SERVER_BASE_URL}/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        payload: {
          type: "preGame",
          startTimeMs: data.startTimeMs,
          endTimeMs: data.endTimeMs,
          title: data.title,
        },
        isSandbox,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Server error: ${error.error || "Unknown error"}`);
    }

    const result = await response.json();
    console.log("✅ Live activity updated:", result.message);
  }

  /**
   * Ends a live activity by calling the server
   */
  static async endLiveActivity(
    token: string,
    isSandbox: boolean
  ): Promise<void> {
    console.log(
      `🛑 Ending live activity via server (${
        isSandbox ? "sandbox" : "production"
      })...`
    );

    const response = await fetch(`${this.SERVER_BASE_URL}/end`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        isSandbox,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Server error: ${error.error || "Unknown error"}`);
    }

    const result = await response.json();
    console.log("✅ Live activity ended:", result.message);
  }

  /**
   * Legacy method for backward compatibility
   * @deprecated Use startLiveActivity, updateLiveActivity, or endLiveActivity instead
   */
  static async simulateAPNSNotification(
    payload: any,
    token: string,
    config: any = {}
  ): Promise<void> {
    console.warn(
      "⚠️ simulateAPNSNotification is deprecated. Use specific methods instead."
    );

    const isSandbox = __DEV__; // Legacy method can still use __DEV__

    // Try to determine the action from the payload
    if (payload.aps?.event === "start") {
      await this.startLiveActivity(
        token,
        {
          startTimeMs: payload.aps.attributes?.startTimeMs || Date.now(),
          endTimeMs: payload.aps.attributes?.endTimeMs || Date.now() + 600000,
          title: payload.aps.attributes?.title || "Live Activity",
        },
        isSandbox
      );
    } else if (payload.aps?.event === "update") {
      await this.updateLiveActivity(
        token,
        {
          startTimeMs: payload.aps["content-state"]?.startTimeMs || Date.now(),
          endTimeMs:
            payload.aps["content-state"]?.endTimeMs || Date.now() + 600000,
          title: payload.aps["content-state"]?.title || "Live Activity",
        },
        isSandbox
      );
    } else if (payload.aps?.event === "end") {
      await this.endLiveActivity(token, isSandbox);
    }
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
