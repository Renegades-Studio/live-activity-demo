import AsyncStorage from "@react-native-async-storage/async-storage";

// Constants for AsyncStorage
const STORAGE_KEYS = {
  START_TOKEN: "@liveactivity_start_token",
} as const;

/**
 * Token Storage Service
 * Handles persistence of Live Activity tokens using AsyncStorage
 */
export class TokenStorage {
  /**
   * Save start token to AsyncStorage
   */
  static async saveStartToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.START_TOKEN, token);
      console.log("💾 Start token saved to storage");
    } catch (error) {
      console.error("❌ Failed to save start token to storage:", error);
      throw error;
    }
  }

  /**
   * Load start token from AsyncStorage
   */
  static async loadStartToken(): Promise<string | null> {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.START_TOKEN);
      if (token) {
        console.log("📱 Loaded cached start token from storage");
        return token;
      }
      return null;
    } catch (error) {
      console.error("❌ Failed to load start token from storage:", error);
      return null;
    }
  }

  /**
   * Remove start token from AsyncStorage
   */
  static async removeStartToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.START_TOKEN);
      console.log("🗑️ Start token removed from storage");
    } catch (error) {
      console.error("❌ Failed to remove start token from storage:", error);
      throw error;
    }
  }

  /**
   * Check if start token exists in storage
   */
  static async hasStartToken(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.START_TOKEN);
      return token !== null;
    } catch (error) {
      console.error("❌ Failed to check start token existence:", error);
      return false;
    }
  }
}
