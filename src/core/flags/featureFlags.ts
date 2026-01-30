import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';

// Define all feature flags with default values
export const DEFAULT_FLAGS = {
  // Phase 1 security features
  secureStorage: false,
  inputValidation: false,
  errorBoundaries: false,
  httpsEnforcement: false,

  // Phase 3 performance features
  flashListEnabled: false,
  expoImageEnabled: false,
  debouncedInputs: false,

  // Phase 4 features
  networkErrorHandling: false,
  offlineIndicators: false,
  skeletonLoading: false,
};

export type FeatureFlags = {
  secureStorage: boolean;
  inputValidation: boolean;
  errorBoundaries: boolean;
  httpsEnforcement: boolean;
  flashListEnabled: boolean;
  expoImageEnabled: boolean;
  debouncedInputs: boolean;
  networkErrorHandling: boolean;
  offlineIndicators: boolean;
  skeletonLoading: boolean;
};

export type FeatureFlagKey = keyof FeatureFlags;

const STORAGE_KEY = '@feature_flags';

// In-memory cache for synchronous access
let flagCache: FeatureFlags = { ...DEFAULT_FLAGS };
let isInitialized = false;

// Load flags from storage on init
export async function initializeFlags(): Promise<void> {
  if (isInitialized) return;

  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      flagCache = { ...DEFAULT_FLAGS, ...parsed };
    }
  } catch (error) {
    console.warn('[FeatureFlags] Failed to load from storage:', error);
  }
  isInitialized = true;
}

// Get flag value synchronously (uses cache)
export function getFlag(key: FeatureFlagKey): boolean {
  return flagCache[key];
}

// Set flag value (persists to storage)
export async function setFeatureFlag(key: FeatureFlagKey, value: boolean): Promise<void> {
  flagCache[key] = value;
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(flagCache));
  } catch (error) {
    console.warn('[FeatureFlags] Failed to persist flag:', error);
  }
}

// React hook for feature flags
export function useFeatureFlag(key: FeatureFlagKey): boolean {
  const [value, setValue] = useState(flagCache[key]);

  useEffect(() => {
    // Re-sync if cache changes
    setValue(flagCache[key]);
  }, [key]);

  return value;
}

// Bulk update flags (for remote config updates)
export async function updateFlags(updates: Partial<FeatureFlags>): Promise<void> {
  flagCache = { ...flagCache, ...updates };
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(flagCache));
  } catch (error) {
    console.warn('[FeatureFlags] Failed to persist flags:', error);
  }
}

// Reset all flags to defaults
export async function resetFlags(): Promise<void> {
  flagCache = { ...DEFAULT_FLAGS };
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('[FeatureFlags] Failed to reset flags:', error);
  }
}

// Get all flags (for debugging)
export function getAllFlags(): FeatureFlags {
  return { ...flagCache };
}
