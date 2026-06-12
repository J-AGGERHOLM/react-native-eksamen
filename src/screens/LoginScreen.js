import { View, Text, Pressable, StyleSheet, TextInput, Alert } from "react-native";
import { useState } from "react";
import { LogInContainer } from "../components/layout/LogInContainer";
import { useNavigation } from "@react-navigation/native";
/* use initialized auth from firebase config*/
import { auth } from "../../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { biometricLogin, enableBiometricsForUser } from "../utils/biometricLogIn";

export function LoginPage() {
  const navigation = useNavigation();

  /* callback functions to set email and password */
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");

  /* login function */
  async function login() {
    try {
      console.log("Email being sent:", enteredEmail.trim());
      console.log("Password length:", enteredPassword.length);
      console.log("Firebase project:", auth.app.options.projectId);

      /* uses firebase/auth's function to call the store and authenticate with the credentials
      auth: the initialized Firebase Auth instance from firebaseConfig */
      const credentials = await signInWithEmailAndPassword(auth, enteredEmail, enteredPassword);

      // Save this Firebase user as the user connected to biometric login
      await enableBiometricsForUser(credentials.user.uid);

      console.log("Logged in as:", credentials.user.uid);
      /* on succes navigate to MainTabs, and pass the userId as a JSON object */
      navigation.navigate("MainTabs", { userId: credentials.user.uid });
    } catch (error) {
      console.log("Login error:", error);
    }
  }

  function goToSignUp() {
    navigation.navigate("SignUpPage");
  }

  async function handleBiometricLogin() {
    const result = await biometricLogin();
    //json object is returned from function, and alets the user how the biometric log-in went.
    if (result.success) {
      Alert.alert("Login successful", "Biometric authentication succeeded.");
      navigation.navigate("MainTabs");
    } else {
      Alert.alert("Biometric login failed", result.message || "Could not authenticate with biometrics.");
    }
  }

  return (
    <LogInContainer>
      {/* Logo + brand */}
      <View style={styles.logoRow}>
        <Text style={styles.brandName}>Vaultly</Text>
      </View>

      {/* Heading */}
      <View style={styles.headingBlock}>
        <Text style={styles.heading}>Welcome back</Text>
        <Text style={styles.subheading}>Enter your credentials to continue</Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <View style={styles.fieldBlock}>
          <Text style={styles.label}>Email address</Text>
          {/* on change text, call the callback function for setting the email  */}
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            placeholderTextColor="#aaa"
            keyboardType="email-address"
            autoCapitalize="none"
            value={enteredEmail}
            onChangeText={setEnteredEmail}
          />
        </View>

        <View style={styles.fieldBlock}>
          <View style={styles.passwordRow}>
            <Text style={styles.label}>Password</Text>
            <Pressable>
              <Text style={styles.forgot}>Forgot?</Text>
            </Pressable>
          </View>
          {/* on change text, call the callback function for setting the password  */}
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#aaa"
            secureTextEntry
            autoCapitalize="none"
            value={enteredPassword}
            onChangeText={setEnteredPassword}
          />
        </View>

        <Pressable style={styles.signInButton} onPress={login}>
          <Text style={styles.signInText}>Sign in</Text>
        </Pressable>
      </View>
      <Pressable style={styles.biometricsButton} hitSlop={20} onPress={handleBiometricLogin}>
        <MaterialIcons name="fingerprint" size={28} color="#2563eb" />
      </Pressable>

      {/* Divider */}
      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>Or</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Sign up */}
      <View style={styles.signUpRow}>
        <Text style={styles.signUpText}>Don't have an account? </Text>
        <Pressable>
          <Text style={styles.signUpLink} onPress={goToSignUp}>
            Sign up
          </Text>
        </Pressable>
      </View>
    </LogInContainer>
  );
}

const styles = StyleSheet.create({
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
    gap: 10,
  },
  logoBox: {
    backgroundColor: "#2563eb",
    borderRadius: 14,
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  logoIcon: {
    fontSize: 22,
  },
  brandName: {
    fontSize: 26,
    fontWeight: "600",
    color: "#111",
  },
  headingBlock: {
    marginBottom: 32,
  },
  heading: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111",
    marginBottom: 6,
  },
  subheading: {
    fontSize: 14,
    color: "#666",
  },
  form: {
    gap: 20,
    marginBottom: 28,
  },
  fieldBlock: {
    gap: 6,
  },
  passwordRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111",
  },
  forgot: {
    fontSize: 14,
    color: "#2563eb",
  },
  input: {
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#111",
  },
  signInButton: {
    backgroundColor: "#2563eb",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 4,
  },
  signInText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 28,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e5e7eb",
  },
  dividerText: {
    fontSize: 13,
    color: "#999",
  },
  signUpRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  signUpText: {
    fontSize: 14,
    color: "#555",
  },
  signUpLink: {
    fontSize: 14,
    color: "#2563eb",
    fontWeight: "600",
  },
  biometricsButton: {
    height: 52,
    width: 52,
    borderRadius: 26,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 24,
  },
});
