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
        console.log("start token fetched: ", token);
        setStartToken(token);
      } catch (error) {
        console.error("Failed to get start token:", error);
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
        }
      } catch (error) {
        // Silent fail - update token not available yet
      }
    };

    checkForUpdateToken();
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
