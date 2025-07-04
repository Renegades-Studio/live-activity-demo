// Import the native module. On web, it will be resolved to LiveActivityControl.web.ts
// and on native platforms to LiveActivityControl.ts
import { Platform } from "react-native";
import LiveActivityInterfaceModule from "./src/LiveActivityInterfaceModule";

/**
 * Gets the push to start token for the current activity.
 * @returns The push to start token.
 */
export async function getPushToStartToken(): Promise<string> {
  if (Platform.OS === "ios") {
    return await LiveActivityInterfaceModule.getPushToStartToken();
  }
  return "";
}

/**
 * Gets the push to start token for the current activity.
 * @returns The push to start token.
 */
export async function getPushToUpdateToken(): Promise<string> {
  if (Platform.OS === "ios") {
    return await LiveActivityInterfaceModule.getPushToUpdateToken();
  }
  return "";
}

interface StartActivityOptions {
  startTimeMs: number; // Unix timestamp in milliseconds
  endTimeMs: number; // Unix timestamp in milliseconds
  title: string;
  type: "preGame";
}

/**
 * Starts an iOS Live Activity.
 * @param options Options for the activity.
 */
export async function startActivity(
  options: StartActivityOptions
): Promise<string> {
  if (Platform.OS === "ios") {
    return await startActivityInner(
      options.startTimeMs,
      options.endTimeMs,
      options.title,
      options.type
    );
  }
  return "";
}

async function startActivityInner(
  startTimeMs: number,
  endTimeMs: number,
  title: string,
  type: "preGame"
): Promise<string> {
  return await LiveActivityInterfaceModule.startActivity(
    startTimeMs,
    endTimeMs,
    title,
    type
  );
}
