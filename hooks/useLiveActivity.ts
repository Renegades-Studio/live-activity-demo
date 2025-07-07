import { useCallback, useState } from "react";
import { Platform } from "react-native";

import { useLiveActivityContext } from "@/contexts/LiveActivityContext";
import { getPushToUpdateToken } from "@/modules/live-activity-interface";
import { APNSService, validateLiveActivityData } from "@/services/apnsService";
import type { LiveActivityData } from "@/types/liveActivity";

interface LiveActivityHookState {
  isActive: boolean;
  isLoading: boolean;
}

/**
 * Custom hook for managing Live Activities with APNs
 * Uses global context for token management and handles activity state
 */
export const useLiveActivity = () => {
  const { startToken, updateToken, isTokenReady, tokenSource, setUpdateToken } =
    useLiveActivityContext();

  const [state, setState] = useState<LiveActivityHookState>({
    isActive: false,
    isLoading: false,
  });

  /**
   * Acquire push-to-update token (called after starting activity)
   */
  const acquireUpdateToken = useCallback(async (): Promise<string | null> => {
    if (Platform.OS !== "ios") return null;

    try {
      console.log("📱 Acquiring push-to-update token...");
      const token = await getPushToUpdateToken();
      console.log("📱 Push-to-update token acquired:", token);
      setUpdateToken(token);
      return token;
    } catch (error) {
      console.error("❌ Failed to get push-to-update token:", error);
      return null;
    }
  }, [setUpdateToken]);

  /**
   * Start a live activity using APNs
   */
  const startLiveActivity = useCallback(
    async (data: LiveActivityData): Promise<void> => {
      if (Platform.OS !== "ios") {
        throw new Error("Live Activities are only supported on iOS");
      }

      if (!startToken) {
        throw new Error("Push-to-start token not available");
      }

      if (state.isActive) {
        throw new Error("A live activity is already active");
      }

      validateLiveActivityData(data);
      setState((prev) => ({ ...prev, isLoading: true }));

      try {
        console.log("🚀 Starting live activity...");
        await APNSService.startLiveActivity(startToken, data, __DEV__);

        setState((prev) => ({ ...prev, isActive: true }));

        // Acquire update token for future updates
        await acquireUpdateToken();

        console.log("✅ Live activity started successfully");
      } catch (error) {
        console.error("❌ Failed to start live activity:", error);
        throw error;
      } finally {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    },
    [startToken, state.isActive, acquireUpdateToken]
  );

  /**
   * Update an active live activity using APNs
   */
  const updateLiveActivity = useCallback(
    async (data: LiveActivityData): Promise<void> => {
      if (Platform.OS !== "ios") {
        throw new Error("Live Activities are only supported on iOS");
      }

      if (!updateToken) {
        throw new Error("Push-to-update token not available");
      }

      if (!state.isActive) {
        throw new Error("No active live activity to update");
      }

      validateLiveActivityData(data);
      setState((prev) => ({ ...prev, isLoading: true }));

      try {
        console.log("🔄 Updating live activity...");
        await APNSService.updateLiveActivity(updateToken, data, __DEV__);

        console.log("✅ Live activity updated successfully");
      } catch (error) {
        console.error("❌ Failed to update live activity:", error);
        throw error;
      } finally {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    },
    [updateToken, state.isActive]
  );

  /**
   * End an active live activity using APNs
   */
  const endLiveActivity = useCallback(async (): Promise<void> => {
    if (Platform.OS !== "ios") {
      throw new Error("Live Activities are only supported on iOS");
    }

    if (!updateToken) {
      throw new Error("Push-to-update token not available");
    }

    if (!state.isActive) {
      throw new Error("No active live activity to end");
    }

    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      console.log("🛑 Ending live activity...");
      await APNSService.endLiveActivity(updateToken, __DEV__);

      setState((prev) => ({ ...prev, isActive: false }));
      setUpdateToken(null);

      console.log("✅ Live activity ended successfully");
    } catch (error) {
      console.error("❌ Failed to end live activity:", error);
      throw error;
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [updateToken, state.isActive, setUpdateToken]);

  return {
    // State
    isActive: state.isActive,
    isLoading: state.isLoading,
    isTokenReady,
    hasStartToken: !!startToken,
    hasUpdateToken: !!updateToken,
    tokenSource,

    // Actions
    startLiveActivity,
    updateLiveActivity,
    endLiveActivity,
  };
};
