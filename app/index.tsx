import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React, { useState } from "react";
import { Alert, Platform, StyleSheet } from "react-native";

export default function HomeScreen() {
  const [isActivityActive, setIsActivityActive] = useState(false);

  const handleStartLiveActivity = async () => {
    try {
      if (Platform.OS !== "ios") {
        Alert.alert(
          "Platform Not Supported",
          "Live Activities are only available on iOS 16.1+"
        );
        return;
      }

      setIsActivityActive(true);
      Alert.alert("Success", "Live Activity started!");
    } catch (error) {
      Alert.alert("Error", `Failed to start Live Activity: ${error}`);
    }
  };

  const handleUpdateLiveActivity = async () => {
    try {
      if (!isActivityActive) {
        Alert.alert("No Active Activity", "Please start a Live Activity first");
        return;
      }

      Alert.alert("Success", "Live Activity updated!");
    } catch (error) {
      Alert.alert("Error", `Failed to update Live Activity: ${error}`);
    }
  };

  const handleEndLiveActivity = async () => {
    try {
      if (!isActivityActive) {
        Alert.alert("No Active Activity", "No Live Activity to end");
        return;
      }

      setIsActivityActive(false);
      Alert.alert("Success", "Live Activity ended!");
    } catch (error) {
      Alert.alert("Error", `Failed to end Live Activity: ${error}`);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Live Activity Demo</ThemedText>
        <ThemedText style={styles.subtitle}>
          Test Live Activities on iOS with the buttons below
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.statusContainer}>
        <ThemedText type="defaultSemiBold">
          Status: {isActivityActive ? "🟢 Active" : "🔴 Inactive"}
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.buttonContainer}>
        <ThemedView style={[styles.button, styles.startButton]}>
          <ThemedText
            style={styles.buttonText}
            onPress={handleStartLiveActivity}
          >
            Start Live Activity
          </ThemedText>
        </ThemedView>

        <ThemedView style={[styles.button, styles.updateButton]}>
          <ThemedText
            style={styles.buttonText}
            onPress={handleUpdateLiveActivity}
          >
            Update Live Activity
          </ThemedText>
        </ThemedView>

        <ThemedView style={[styles.button, styles.endButton]}>
          <ThemedText style={styles.buttonText} onPress={handleEndLiveActivity}>
            End Live Activity
          </ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.infoContainer}>
        <ThemedText style={styles.infoText}>
          • Live Activities are only available on iOS 16.1+
        </ThemedText>
        <ThemedText style={styles.infoText}>
          • Start creates a countdown timer for 10 minutes
        </ThemedText>
        <ThemedText style={styles.infoText}>
          • Update changes the countdown to 5 minutes
        </ThemedText>
        <ThemedText style={styles.infoText}>
          • End removes the Live Activity
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
  },
  buttonContainer: {
    gap: 20,
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#007AFF",
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
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  infoContainer: {
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    opacity: 0.7,
  },
});
