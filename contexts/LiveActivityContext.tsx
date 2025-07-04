import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Platform } from "react-native";

import { getPushToStartToken } from "@/modules/live-activity-interface";
import { TokenStorage } from "@/services/tokenStorage";

interface LiveActivityContextType {
  startToken: string | null;
  updateToken: string | null;
  isTokenReady: boolean;
  tokenSource: "fresh" | "cached" | null;
  setUpdateToken: (token: string | null) => void;
}

interface LiveActivityProviderProps {
  children: ReactNode;
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

// Timeout for token acquisition (fallback to cached token after this time)
const TOKEN_TIMEOUT_MS = 3000; // 3 seconds

/**
 * LiveActivityProvider - Manages Live Activity tokens globally
 * Initializes push-to-start token early in app lifecycle with persistence
 */
export const LiveActivityProvider: React.FC<LiveActivityProviderProps> = ({
  children,
}) => {
  const [startToken, setStartToken] = useState<string | null>(null);
  const [updateToken, setUpdateToken] = useState<string | null>(null);
  const [isTokenReady, setIsTokenReady] = useState(false);
  const [tokenSource, setTokenSource] = useState<"fresh" | "cached" | null>(
    null
  );

  /**
   * Initialize push-to-start token early in app lifecycle
   * Uses cached token as fallback if new token takes too long
   */
  useEffect(() => {
    const initializePushToStartToken = async () => {
      if (Platform.OS !== "ios") {
        console.log("📱 Live Activities not supported on this platform");
        setIsTokenReady(true);
        setTokenSource(null);
        return;
      }

      // Load cached token first
      const cachedToken = await TokenStorage.loadStartToken();
      if (cachedToken) {
        setStartToken(cachedToken);
        setTokenSource("cached");
        console.log("📱 Using cached token as fallback");
      }

      // Try to get fresh token with timeout
      let tokenResolved = false;
      const tokenPromise = getPushToStartToken();

      // Set up timeout to use cached token if fresh token takes too long
      const timeoutId = setTimeout(() => {
        if (!tokenResolved) {
          console.log("⏰ Token request timed out, using cached token");
          setIsTokenReady(true);
          tokenResolved = true;
        }
      }, TOKEN_TIMEOUT_MS);

      try {
        console.log("📱 Requesting fresh push-to-start token...");
        const freshToken = await tokenPromise;

        if (!tokenResolved) {
          clearTimeout(timeoutId);
          tokenResolved = true;

          console.log("📱 Fresh push-to-start token acquired:", freshToken);
          setStartToken(freshToken);
          setIsTokenReady(true);
          setTokenSource("fresh");

          // Save the fresh token to storage
          await TokenStorage.saveStartToken(freshToken);
        }
      } catch (error) {
        if (!tokenResolved) {
          clearTimeout(timeoutId);
          tokenResolved = true;

          console.error("❌ Failed to get fresh push-to-start token:", error);

          // If we have a cached token, use it; otherwise mark as ready without token
          if (cachedToken) {
            console.log("📱 Using cached token due to fresh token failure");
            setTokenSource("cached");
          } else {
            console.log(
              "📱 No cached token available, proceeding without token"
            );
            setTokenSource(null);
          }
          setIsTokenReady(true);
        }
      }
    };

    initializePushToStartToken();
  }, []);

  const contextValue: LiveActivityContextType = {
    startToken,
    updateToken,
    isTokenReady,
    tokenSource,
    setUpdateToken,
  };

  return (
    <LiveActivityContext.Provider value={contextValue}>
      {children}
    </LiveActivityContext.Provider>
  );
};
