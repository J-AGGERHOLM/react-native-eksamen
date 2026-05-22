import { View, Text, Pressable, StyleSheet, TextInput } from "react-native";
import { useState } from "react";
import { LogInContainer } from "../components/layout/LogInContainer";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";

export function SignUpPage() {
  const navigation = useNavigation();

  /* callback functions to set variables */
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function signUp() {
    try {
      setErrorMessage("");

      /* making sure we don't accidentaly commit emails with whitespaces */
      const email = enteredEmail.trim();

      /* if user doesn't fill out all forms, send error message to the screen */
      if (!email || !enteredPassword || !confirmedPassword) {
        setErrorMessage("Please fill out all fields.");
        return;
      }

      /* if the passwords dont match, send error message to the screen*/
      if (enteredPassword !== confirmedPassword) {
        setErrorMessage("Passwords do not match.");
        return;
      }

      /* using firestores build in function to persist new user credentials in the store 
       auth: the initialized Firebase Auth instance from firebaseConfig */

      const credentials = await createUserWithEmailAndPassword(auth, email, enteredPassword);

      console.log("Signed up as:", credentials.user.uid);

      /* if succes, navigate to maintabs, and pass the new user's id */
      navigation.navigate("MainTabs", { userId: credentials.user.uid });
    } catch (error) {
      console.log("Signup error:", error);

      if (error.code === "auth/email-already-in-use") {
        setErrorMessage("This email is already in use.");
      } else if (error.code === "auth/invalid-email") {
        setErrorMessage("Please enter a valid email.");
      } else if (error.code === "auth/weak-password") {
        setErrorMessage("Password should be at least 6 characters.");
      } else {
        setErrorMessage("Could not create account.");
      }
    }
  }

  function goToLogin() {
    navigation.navigate("LoginPage");
  }

  return (
    <LogInContainer>
      <View style={styles.headingBlock}>
        <Text style={styles.heading}>Create account</Text>
        <Text style={styles.subheading}>Sign up to start tracking your savings goals</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.fieldBlock}>
          <Text style={styles.label}>Email address</Text>
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
          <Text style={styles.label}>Password</Text>
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

        <View style={styles.fieldBlock}>
          <Text style={styles.label}>Confirm password</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#aaa"
            secureTextEntry
            autoCapitalize="none"
            value={confirmedPassword}
            onChangeText={setConfirmedPassword}
          />
        </View>

        {/*
        Shows the error message only if errorMessage contains text.
        If errorMessage is an empty string, nothing is rendered.
        This lets us display signup/login errors only when something has gone wrong. 
        */}
        {errorMessage !== "" && <Text style={styles.errorText}>{errorMessage}</Text>}

        <Pressable style={styles.signUpButton} onPress={signUp}>
          <Text style={styles.signUpButtonText}>Create account</Text>
        </Pressable>
      </View>

      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>Or</Text>
        <View style={styles.dividerLine} />
      </View>

      <View style={styles.loginRow}>
        <Text style={styles.loginText}>Already have an account? </Text>
        <Pressable onPress={goToLogin}>
          <Text style={styles.loginLink}>Sign in</Text>
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
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111",
  },
  input: {
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#111",
  },
  signUpButton: {
    backgroundColor: "#2563eb",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 4,
  },
  signUpButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  errorText: {
    color: "#dc2626",
    fontSize: 14,
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
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  loginText: {
    fontSize: 14,
    color: "#555",
  },
  loginLink: {
    fontSize: 14,
    color: "#2563eb",
    fontWeight: "600",
  },
});
