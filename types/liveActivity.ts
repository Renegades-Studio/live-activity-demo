export interface LiveActivityData {
  startTimeMs: number;
  endTimeMs: number;
  title: string;
}

export interface LiveActivityState {
  isActive: boolean;
  isLoading: boolean;
  startToken: string | null;
  updateToken: string | null;
}

export interface APNSNotificationPayload {
  aps: {
    timestamp: number;
    event: "start" | "update" | "end";
    "attributes-type": string;
    attributes: LiveActivityAttributes;
    "content-state": LiveActivityContentState;
    alert: {
      title: string;
      body: string;
    };
  };
}

export interface LiveActivityAttributes {
  type: string;
  startTimeMs: number;
  endTimeMs: number;
  title: string;
}

export interface LiveActivityContentState {
  type: string;
  startTimeMs: number;
  endTimeMs: number;
  title: string;
}

export type LiveActivityEvent = "start" | "update" | "end";

export interface APNSConfig {
  topic: string;
  pushType: "liveactivity";
  priority: number;
}
