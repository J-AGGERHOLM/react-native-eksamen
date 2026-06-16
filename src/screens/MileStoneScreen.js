import { View, Text, StyleSheet } from "react-native";
import { ScreenContainer } from "../components/layout/ScreenContainer";
import { LogoutButton } from "../components/layout/LogOutContainer";

export function MileStoneScreen() {
  return (
    <ScreenContainer>
      <View style={styles.topRow}>
        <Text style={styles.pageTitle}>Milestones</Text>
        <LogoutButton />
      </View>

      <View>
        <Text>GoalOverviewScreen heje hejehe j</Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  pageTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111111",
    flex: 1,
    marginRight: 12,
  },
});