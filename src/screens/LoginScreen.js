import { View, Text, Pressable, StyleSheet, TextInput } from "react-native";
import { LogInContainer } from "../components/layout/LogInContainer";
import { useNavigation } from "@react-navigation/native";

export function LoginPage() {
  const navigation = useNavigation();

  return (
    <LogInContainer>
      {/* Logo + brand */}
      <View style={styles.logoRow}>
        <View style={styles.logoBox}>
          <Text style={styles.logoIcon}>🪙</Text>
        </View>
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
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            placeholderTextColor="#aaa"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.fieldBlock}>
          <View style={styles.passwordRow}>
            <Text style={styles.label}>Password</Text>
            <Pressable>
              <Text style={styles.forgot}>Forgot?</Text>
            </Pressable>
          </View>
          <TextInput style={styles.input} placeholder="••••••••" placeholderTextColor="#aaa" secureTextEntry />
        </View>

        <Pressable style={styles.signInButton} onPress={() => navigation.navigate("MainTabs")}>
          <Text style={styles.signInText}>Sign in →</Text>
        </Pressable>
      </View>

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
          <Text style={styles.signUpLink}>Sign up</Text>
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
});
