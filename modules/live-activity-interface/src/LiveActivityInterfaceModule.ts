import { requireNativeModule } from "expo";
import { Platform } from "react-native";

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
