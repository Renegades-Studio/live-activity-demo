import React from "react";
import { Alert, Platform, StyleSheet } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useLiveActivity } from "@/hooks/useLiveActivity";
import { createSampleLiveActivityData } from "@/services/apnsService";
import type { LiveActivityData } from "@/types/liveActivity";

/**
 * Main screen component demonstrating Live Activities with APNs
 */
export default function LiveActivityDemoScreen() {
  const {
    isActive,
    isLoading,
    isTokenReady,
    hasStartToken,
    hasUpdateToken,
    tokenSource,
    startLiveActivity,
    updateLiveActivity,
    endLiveActivity,
  } = useLiveActivity();

  /**
   * Handle starting a live activity
   */
  const handleStartLiveActivity = async () => {
    try {
      if (Platform.OS !== "ios") {
        Alert.alert(
          "Platform Not Supported",
          "Live Activities are only available on iOS 16.1+"
        );
        return;
      }

      const data: LiveActivityData = createSampleLiveActivityData(
        10,
        "Live Activity Demo"
      );
      await startLiveActivity(data);

      Alert.alert(
        "Success",
        "Live Activity started! Check your Dynamic Island."
      );
    } catch (error) {
      Alert.alert("Error", `Failed to start Live Activity: ${error}`);
    }
  };

  /**
   * Handle updating an active live activity
   */
  const handleUpdateLiveActivity = async () => {
    try {
      const data: LiveActivityData = createSampleLiveActivityData(
        5,
        "Updated Live Activity"
      );
      await updateLiveActivity(data);

      Alert.alert("Success", "Live Activity updated!");
    } catch (error) {
      Alert.alert("Error", `Failed to update Live Activity: ${error}`);
    }
  };

  /**
   * Handle ending an active live activity
   */
  const handleEndLiveActivity = async () => {
    try {
      await endLiveActivity();
      Alert.alert("Success", "Live Activity ended!");
    } catch (error) {
      Alert.alert("Error", `Failed to end Live Activity: ${error}`);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Header />
      <StatusSection
        isActive={isActive}
        isTokenReady={isTokenReady}
        hasStartToken={hasStartToken}
        tokenSource={tokenSource}
      />
      <ButtonSection
        isActive={isActive}
        isLoading={isLoading}
        isTokenReady={isTokenReady}
        hasStartToken={hasStartToken}
        hasUpdateToken={hasUpdateToken}
        onStart={handleStartLiveActivity}
        onUpdate={handleUpdateLiveActivity}
        onEnd={handleEndLiveActivity}
      />
      <InfoSection />
    </ThemedView>
  );
}

/**
 * Header component with title and description
 */
const Header = () => (
  <ThemedView style={styles.titleContainer}>
    <ThemedText type="title">Live Activity Demo</ThemedText>
    <ThemedText style={styles.subtitle}>
      Demonstrates APNs-based Live Activities on iOS
    </ThemedText>
  </ThemedView>
);

/**
 * Status section showing current state
 */
interface StatusSectionProps {
  isActive: boolean;
  isTokenReady: boolean;
  hasStartToken: boolean;
  tokenSource: "fresh" | "cached" | null;
}

const StatusSection = ({
  isActive,
  isTokenReady,
  hasStartToken,
  tokenSource,
}: StatusSectionProps) => (
  <ThemedView style={styles.statusContainer}>
    <ThemedText type="defaultSemiBold">
      Status: {isActive ? "🟢 Active" : "🔴 Inactive"}
    </ThemedText>
    <ThemedText style={styles.tokenStatus}>
      Initialization: {!isTokenReady ? "⏳ Loading..." : "✅ Ready"}
    </ThemedText>
    {isTokenReady && (
      <>
        <ThemedText style={styles.tokenStatus}>
          Push Token: {hasStartToken ? "✅ Available" : "❌ Not Available"}
        </ThemedText>
        {hasStartToken && tokenSource && (
          <ThemedText style={styles.tokenStatus}>
            Token Source:{" "}
            {tokenSource === "fresh"
              ? "🆕 Fresh"
              : tokenSource === "cached"
              ? "💾 Cached"
              : "❓ Unknown"}
          </ThemedText>
        )}
      </>
    )}
  </ThemedView>
);

/**
 * Button section with all Live Activity controls
 */
interface ButtonSectionProps {
  isActive: boolean;
  isLoading: boolean;
  isTokenReady: boolean;
  hasStartToken: boolean;
  hasUpdateToken: boolean;
  onStart: () => void;
  onUpdate: () => void;
  onEnd: () => void;
}

const ButtonSection = ({
  isActive,
  isLoading,
  isTokenReady,
  hasStartToken,
  hasUpdateToken,
  onStart,
  onUpdate,
  onEnd,
}: ButtonSectionProps) => (
  <ThemedView style={styles.buttonContainer}>
    <ActionButton
      title="Start Live Activity"
      style={[styles.button, styles.startButton]}
      onPress={onStart}
      disabled={isLoading || isActive || !isTokenReady || !hasStartToken}
    />

    <ActionButton
      title="Update Live Activity"
      style={[styles.button, styles.updateButton]}
      onPress={onUpdate}
      disabled={isLoading || !isActive || !hasUpdateToken}
    />

    <ActionButton
      title="End Live Activity"
      style={[styles.button, styles.endButton]}
      onPress={onEnd}
      disabled={isLoading || !isActive || !hasUpdateToken}
    />
  </ThemedView>
);

/**
 * Reusable action button component
 */
interface ActionButtonProps {
  title: string;
  style: any;
  onPress: () => void;
  disabled?: boolean;
}

const ActionButton = ({
  title,
  style,
  onPress,
  disabled,
}: ActionButtonProps) => (
  <ThemedView style={[style, disabled && styles.disabledButton]}>
    <ThemedText
      style={[styles.buttonText, disabled && styles.disabledButtonText]}
      onPress={disabled ? undefined : onPress}
    >
      {title}
    </ThemedText>
  </ThemedView>
);

/**
 * Information section with usage instructions
 */
const InfoSection = () => (
  <ThemedView style={styles.infoContainer}>
    <ThemedText type="defaultSemiBold" style={styles.infoTitle}>
      How it works:
    </ThemedText>
    <ThemedText style={styles.infoText}>
      • Push-to-start token initialized early in app lifecycle
    </ThemedText>
    <ThemedText style={styles.infoText}>
      • Tokens are cached locally with 3-second fallback timeout
    </ThemedText>
    <ThemedText style={styles.infoText}>
      • Live Activities use APNs (Apple Push Notification service)
    </ThemedText>
    <ThemedText style={styles.infoText}>
      • Start creates a 10-minute countdown timer
    </ThemedText>
    <ThemedText style={styles.infoText}>
      • Update changes the countdown to 5 minutes
    </ThemedText>
    <ThemedText style={styles.infoText}>
      • End removes the live activity immediately
    </ThemedText>
    <ThemedText style={styles.infoText}>
      • Check console for APNs payload structure
    </ThemedText>
  </ThemedView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
    opacity: 0.8,
  },
  statusContainer: {
    alignItems: "center",
    marginBottom: 40,
    gap: 8,
  },
  tokenStatus: {
    fontSize: 14,
    opacity: 0.7,
  },
  buttonContainer: {
    gap: 20,
    marginBottom: 40,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  startButton: {
    backgroundColor: "#34C759",
  },
  updateButton: {
    backgroundColor: "#FF9500",
  },
  endButton: {
    backgroundColor: "#FF3B30",
  },
  disabledButton: {
    opacity: 0.5,
    shadowOpacity: 0.1,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  disabledButtonText: {
    opacity: 0.7,
  },
  infoContainer: {
    gap: 8,
  },
  infoTitle: {
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    opacity: 0.7,
  },
});
