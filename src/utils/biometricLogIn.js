import * as LocalAuthentication from "expo-local-authentication";

export async function biometricLogin() {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  const isEnrolled = await LocalAuthentication.isEnrolledAsync();

  if (!hasHardware || !isEnrolled) {
    return {
      success: false,
      message: "Biometric authentication is not available.",
    };
  }

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: "Log in with biometrics",
    fallbackLabel: "Use passcode",
    biometricsSecurityLevel: "strong",
  });

  return result;
}

import * as SecureStore from "expo-secure-store";

const BIOMETRIC_ENABLED_KEY = "biometricEnabled";
const BIOMETRIC_USER_ID_KEY = "biometricUserId";

export async function enableBiometricsForUser(userId) {
  await SecureStore.setItemAsync(BIOMETRIC_ENABLED_KEY, "true");
  await SecureStore.setItemAsync(BIOMETRIC_USER_ID_KEY, userId);
}

export async function getBiometricUserId() {
  return await SecureStore.getItemAsync(BIOMETRIC_USER_ID_KEY);
}

export async function isBiometricLoginEnabled() {
  const value = await SecureStore.getItemAsync(BIOMETRIC_ENABLED_KEY);
  return value === "true";
}

export async function clearBiometricLogin() {
  await SecureStore.deleteItemAsync(BIOMETRIC_ENABLED_KEY);
  await SecureStore.deleteItemAsync(BIOMETRIC_USER_ID_KEY);
}