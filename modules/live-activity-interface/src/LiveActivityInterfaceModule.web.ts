import { Platform, requireNativeModule } from "expo-modules-core";

const fallback = {
  getPushToStartToken() {
    return "";
  },
  getPushToUpdateToken() {
    return "";
  },
};

export default Platform.OS === "ios"
  ? requireNativeModule("LiveActivityInterface")
  : fallback;
