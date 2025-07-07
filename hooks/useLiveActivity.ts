import { useCallback, useState } from "react";

import { useLiveActivityContext } from "@/contexts/LiveActivityContext";
import { APNSService } from "@/services/apnsService";

/**
 * Simple hook for Live Activities
 */
export const useLiveActivity = () => {
  const { startToken, updateToken, isReady, setUpdateToken } =
    useLiveActivityContext();
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const startLiveActivity = useCallback(
    async (title: string, durationMinutes: number): Promise<void> => {
      if (!startToken) throw new Error("Start token not available");

      setIsLoading(true);
      try {
        await APNSService.startLiveActivity(startToken, title, durationMinutes);
        setIsActive(true);
        // Update token will be automatically acquired by the context
      } finally {
        setIsLoading(false);
      }
    },
    [startToken, isActive]
  );

  const updateLiveActivity = useCallback(
    async (title: string, durationMinutes: number): Promise<void> => {
      if (!updateToken) throw new Error("Update token not available");
      if (!isActive) throw new Error("No active live activity");

      setIsLoading(true);
      try {
        await APNSService.updateLiveActivity(
          updateToken,
          title,
          durationMinutes
        );
      } finally {
        setIsLoading(false);
      }
    },
    [updateToken, isActive]
  );

  const endLiveActivity = useCallback(async (): Promise<void> => {
    if (!updateToken) throw new Error("Update token not available");
    if (!isActive) throw new Error("No active live activity");

    setIsLoading(true);
    try {
      await APNSService.endLiveActivity(updateToken);
      setIsActive(false);
      setUpdateToken(null);
    } finally {
      setIsLoading(false);
    }
  }, [updateToken, isActive, setUpdateToken]);

  return {
    isActive,
    isLoading,
    isReady: isReady && !!startToken,
    startLiveActivity,
    updateLiveActivity,
    endLiveActivity,
  };
};
