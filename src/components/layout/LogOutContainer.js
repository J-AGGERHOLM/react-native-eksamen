import { Alert, Pressable, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebaseConfig";

export function LogoutButton() {
  const navigation = useNavigation();

  async function logout() {
    try {
      // Logs the user out from Firebase Auth.
      await signOut(auth);

      // Resets navigation back to login.
      navigation.reset({
        index: 0,
        routes: [{ name: "LoginPage" }],
      });
    } catch (error) {
      // Logs the error if logout fails.
      console.log("Logout error:", error);

      // Shows an error message to the user.
      Alert.alert("Logout failed", "Could not log out. Please try again.");
    }
  }

  return (
    <Pressable style={styles.logoutButton} onPress={logout}>
      <Text style={styles.logoutText}>Log out</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  logoutButton: {
    alignSelf: "flex-end",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#f1f1f4",
  },

  logoutText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111111",
  },
});