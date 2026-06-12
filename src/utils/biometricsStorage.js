import * as SecureStore from "expo-secure-store";

const BIOMETRIC_ENABLED_KEY = "biometricEnabled";
const BIOMETRIC_USER_ID_KEY = "biometricUserId";

//save userId, and state to SecureStore:
export async function enableBiometricsForUser(userId) {
  await SecureStore.setItemAsync(BIOMETRIC_ENABLED_KEY, "true");
  await SecureStore.setItemAsync(BIOMETRIC_USER_ID_KEY, userId);
}

//retrieve userId from store:
export async function getBiometricUserId() {
  return await SecureStore.getItemAsync(BIOMETRIC_USER_ID_KEY);
}

//check state:
export async function isBiometricLoginEnabled() {
  const value = await SecureStore.getItemAsync(BIOMETRIC_ENABLED_KEY);
  return value === "true";
}

//delete securestore keys:
export async function clearBiometricLogin() {
  await SecureStore.deleteItemAsync(BIOMETRIC_ENABLED_KEY);
  await SecureStore.deleteItemAsync(BIOMETRIC_USER_ID_KEY);
}
