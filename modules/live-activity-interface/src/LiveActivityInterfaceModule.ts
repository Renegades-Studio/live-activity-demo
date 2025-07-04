import { requireNativeModule } from "expo";
import { Platform } from "react-native";

const fallback = {
  areActivitiesEnabled: () => false,
  startActivity(_startTime: number, _endTime: number, _title: string) {
    return "";
  },
  endActivity() {},
  getPushToStartToken() {
    return "";
  },
};

export default Platform.OS === "ios"
  ? requireNativeModule("LiveActivityInterface")
  : fallback;
