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
