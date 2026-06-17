import { View, StyleSheet, SafeAreaView } from "react-native";
import { NavBar } from "./NavbarContainer";

export function ScreenContainer({ children, hideNavbar = true }) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
});
