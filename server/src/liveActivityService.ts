import apn from "@parse/node-apn";
import { apnProdProvider, apnSandboxProvider } from "./apnProvider.js";
import type {
  LiveActivityEndRequest,
  LiveActivityStartRequest,
  LiveActivityUpdateRequest,
  PreGameContentState,
} from "./types.js";

export async function sendLiveActivityStartNotification({
  token,
  payload,
  isSandbox = false,
}: LiveActivityStartRequest): Promise<void> {
  console.log(
    `Sending live activity start notification (${
      isSandbox ? "sandbox" : "prod"
    })`
  );

  const notification = new apn.Notification();
  notification.topic = "com.renegades.liveactivitydemo.push-type.liveactivity";
  // @ts-ignore - pushType is not in the types but exists
  notification.pushType = "liveactivity";
  notification.priority = 10;

  const contentState: PreGameContentState = {
    type: "preGame",
    startTimeMs: payload.startTimeMs,
    endTimeMs: payload.endTimeMs,
    title: payload.title,
  };

  notification.rawPayload = {
    aps: {
      timestamp: Math.floor(Date.now() / 1000),
      event: "start",
      "attributes-type": "WidgetAttributes",
      attributes: contentState,
      "content-state": contentState,
      alert: {
        title: "Live Activity Started!",
        body: `${payload.title} - Check your Dynamic Island`,
      },
    },
  };

  try {
    const provider = isSandbox ? apnSandboxProvider : apnProdProvider;
    await provider.send(notification, token);
    console.log("✅ Live activity start notification sent successfully");
  } catch (err) {
    console.error(
      `❌ Error sending live activity start notification (${
        isSandbox ? "sandbox" : "prod"
      }):`,
      err
    );
    throw err;
  }
}

export async function sendLiveActivityUpdateNotification({
  token,
  payload,
  isSandbox = false,
}: LiveActivityUpdateRequest): Promise<void> {
  console.log(
    `Sending live activity update notification (${
      isSandbox ? "sandbox" : "prod"
    })`
  );

  const notification = new apn.Notification();
  notification.topic = "com.renegades.liveactivitydemo.push-type.liveactivity";
  // @ts-ignore - pushType is not in the types but exists
  notification.pushType = "liveactivity";
  notification.priority = 5;

  notification.rawPayload = {
    aps: {
      timestamp: Math.floor(Date.now() / 1000),
      event: "update",
      "content-state": payload,
      alert: {
        title: "Live Activity Updated!",
        body: `${
          payload.type === "preGame" ? payload.title : "Activity"
        } - Updated content available`,
      },
    },
  };

  try {
    const provider = isSandbox ? apnSandboxProvider : apnProdProvider;
    await provider.send(notification, token);
    console.log("✅ Live activity update notification sent successfully");
  } catch (err) {
    console.error(
      `❌ Error sending live activity update notification (${
        isSandbox ? "sandbox" : "prod"
      }):`,
      err
    );
    throw err;
  }
}

export async function sendLiveActivityEndNotification({
  token,
  isSandbox = false,
}: LiveActivityEndRequest): Promise<void> {
  console.log(
    `Sending live activity end notification (${isSandbox ? "sandbox" : "prod"})`
  );

  const notification = new apn.Notification();
  notification.topic = "com.renegades.liveactivitydemo.push-type.liveactivity";
  // @ts-ignore - pushType is not in the types but exists
  notification.pushType = "liveactivity";
  notification.priority = 5;

  notification.rawPayload = {
    aps: {
      timestamp: Math.floor(Date.now() / 1000),
      event: "end",
      alert: {
        title: "Live Activity Ended",
        body: "The live activity has been completed",
      },
    },
  };

  try {
    const provider = isSandbox ? apnSandboxProvider : apnProdProvider;
    await provider.send(notification, token);
    console.log("✅ Live activity end notification sent successfully");
  } catch (err) {
    console.error(
      `❌ Error sending live activity end notification (${
        isSandbox ? "sandbox" : "prod"
      }):`,
      err
    );
    throw err;
  }
}
