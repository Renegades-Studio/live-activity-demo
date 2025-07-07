import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Platform } from "react-native";

import {
  getPushToStartToken,
  getPushToUpdateToken,
} from "@/modules/live-activity-interface";

interface LiveActivityContextType {
  startToken: string | null;
  updateToken: string | null;
  isReady: boolean;
  setUpdateToken: (token: string | null) => void;
}

const LiveActivityContext = createContext<LiveActivityContextType | undefined>(
  undefined
);

export const useLiveActivityContext = () => {
  const context = useContext(LiveActivityContext);
  if (!context) {
    throw new Error(
      "useLiveActivityContext must be used within a LiveActivityProvider"
    );
  }
  return context;
};

/**
 * Simple LiveActivityProvider - manages tokens for live activities
 */
export const LiveActivityProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [startToken, setStartToken] = useState<string | null>(null);
  const [updateToken, setUpdateToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Get start token when app loads
  useEffect(() => {
    const getStartToken = async () => {
      if (Platform.OS !== "ios") {
        setIsReady(true);
        return;
      }

      try {
        const token = await getPushToStartToken();
        setStartToken(token);

        // TODO: Upload START token to your server here
        // IMPORTANT: Start tokens don't always generate on app launch - if this fails,
        // you must use the last successfully generated start token.
        // When you get a new start token, it invalidates all previous start tokens.
        // Store this token on your server to start live activities remotely.
      } catch (error) {
        console.error("Failed to get start token:", error);

        // TODO: If start token generation fails, load the last known start token
        // from your server/storage and use that instead. Start tokens are not
        // generated every time and you should reuse the last valid one.
      } finally {
        setIsReady(true);
      }
    };

    getStartToken();
  }, []);

  // Automatically acquire update token when system detects live activity started
  useEffect(() => {
    if (Platform.OS !== "ios") return;

    const checkForUpdateToken = async () => {
      try {
        const token = await getPushToUpdateToken();
        if (token && token !== updateToken) {
          setUpdateToken(token);

          // TODO: Upload UPDATE token to your server here
          // IMPORTANT: You get a NEW update token every time a live activity is started.
          // This token is specific to the live activity that was just started.
          // Store this token on your server to update/end this specific live activity.
          // Each live activity has its own unique update token.
        }
      } catch (error) {
        // Silent fail - update token not available yet
      }
    };

    // Check for update token periodically when app is active
    const interval = setInterval(checkForUpdateToken, 1000);

    return () => clearInterval(interval);
  }, [updateToken]);

  return (
    <LiveActivityContext.Provider
      value={{
        startToken,
        updateToken,
        isReady,
        setUpdateToken,
      }}
    >
      {children}
    </LiveActivityContext.Provider>
  );
};
