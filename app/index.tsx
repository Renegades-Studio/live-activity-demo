import React from "react";
import { Alert, Platform, StyleSheet, TouchableOpacity } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useLiveActivity } from "@/hooks/useLiveActivity";

export default function LiveActivityDemoScreen() {
  const {
    isActive,
    isLoading,
    isReady,
    startLiveActivity,
    updateLiveActivity,
    endLiveActivity,
  } = useLiveActivity();

  const handleStart = async () => {
    if (Platform.OS !== "ios") {
      Alert.alert(
        "Platform Not Supported",
        "Live Activities are only available on iOS 16.1+"
      );
      return;
    }

    try {
      await startLiveActivity("Live Activity Demo", 10);
      Alert.alert(
        "Success",
        "Live Activity started! Check your Dynamic Island."
      );
    } catch (error) {
      Alert.alert("Error", `Failed to start: ${error}`);
    }
  };

  const handleUpdate = async () => {
    try {
      await updateLiveActivity("Updated Live Activity", 5);
      Alert.alert("Success", "Live Activity updated!");
    } catch (error) {
      Alert.alert("Error", `Failed to update: ${error}`);
    }
  };

  const handleEnd = async () => {
    try {
      await endLiveActivity();
      Alert.alert("Success", "Live Activity ended!");
    } catch (error) {
      Alert.alert("Error", `Failed to end: ${error}`);
    }
  };

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Live Activity Demo</ThemedText>
        <ThemedText style={styles.subtitle}>
          Demonstrates APNs-based Live Activities on iOS
        </ThemedText>
      </ThemedView>

      {/* Status */}
      <ThemedView style={styles.statusContainer}>
        <ThemedText type="defaultSemiBold">
          Status: {isActive ? "🟢 Active" : "🔴 Inactive"}
        </ThemedText>
        <ThemedText style={styles.statusText}>
          Ready: {isReady ? "✅" : "⏳ Loading..."}
        </ThemedText>
      </ThemedView>

      {/* Buttons */}
      <ThemedView style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            styles.startButton,
            (!isReady || isLoading) && styles.disabledButton,
          ]}
          onPress={handleStart}
          disabled={!isReady || isLoading}
        >
          <ThemedText style={styles.buttonText}>Start Live Activity</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            styles.updateButton,
            (!isActive || isLoading) && styles.disabledButton,
          ]}
          onPress={handleUpdate}
          disabled={!isActive || isLoading}
        >
          <ThemedText style={styles.buttonText}>
            Update Live Activity
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            styles.endButton,
            (!isActive || isLoading) && styles.disabledButton,
          ]}
          onPress={handleEnd}
          disabled={!isActive || isLoading}
        >
          <ThemedText style={styles.buttonText}>End Live Activity</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      {/* Info */}
      <ThemedView style={styles.infoContainer}>
        <ThemedText type="defaultSemiBold" style={styles.infoTitle}>
          How it works:
        </ThemedText>
        <ThemedText style={styles.infoText}>
          • Start creates a 10-minute countdown timer
        </ThemedText>
        <ThemedText style={styles.infoText}>
          • Update changes to 5-minute countdown
        </ThemedText>
        <ThemedText style={styles.infoText}>
          • End removes the live activity
        </ThemedText>
        <ThemedText style={styles.infoText}>
          • Uses APNs for remote updates
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

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
  statusText: {
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
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
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
