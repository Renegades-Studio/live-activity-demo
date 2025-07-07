/**
 * Simple APNs Service for Live Activities
 * Makes HTTP calls to the local Express server
 */
export class APNSService {
  private static readonly SERVER_BASE_URL =
    "http://localhost:3000/api/live-activity";

  /**
   * Starts a live activity
   */
  static async startLiveActivity(
    token: string,
    title: string,
    durationMinutes: number
  ): Promise<void> {
    const startTime = Date.now();
    const endTime = startTime + durationMinutes * 60 * 1000;

    const response = await fetch(`${this.SERVER_BASE_URL}/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
        payload: { startTimeMs: startTime, endTimeMs: endTime, title },
        isSandbox: __DEV__,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to start live activity");
    }
  }

  /**
   * Updates a live activity
   */
  static async updateLiveActivity(
    token: string,
    title: string,
    durationMinutes: number
  ): Promise<void> {
    const startTime = Date.now();
    const endTime = startTime + durationMinutes * 60 * 1000;

    const response = await fetch(`${this.SERVER_BASE_URL}/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
        payload: {
          type: "preGame",
          startTimeMs: startTime,
          endTimeMs: endTime,
          title,
        },
        isSandbox: __DEV__,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update live activity");
    }
  }

  /**
   * Ends a live activity
   */
  static async endLiveActivity(token: string): Promise<void> {
    const response = await fetch(`${this.SERVER_BASE_URL}/end`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
        isSandbox: __DEV__,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to end live activity");
    }
  }
}
