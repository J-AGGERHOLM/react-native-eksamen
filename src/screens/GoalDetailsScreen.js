import { View, Text, Pressable, StyleSheet } from "react-native";
import { ScreenContainer } from "../components/layout/ScreenContainer";

export function GoalDetailsScreen({ navigation }) {
  const goal = {
    name: "New MacBook Pro",
    current: "$1.650",
    target: "$2.499",
    percent: 66,
    remaining: "$849",
  };

  const projections = [
    {
      id: 1,
      title: "Save $50/week",
      weeks: "17 weeks",
      date: "Aug 27, 2026",
    },
    {
      id: 2,
      title: "Save $100/week",
      weeks: "9 weeks",
      date: "Jul 2, 2026",
    },
    {
      id: 3,
      title: "Save $200/week",
      weeks: "5 weeks",
      date: "Jun 4, 2026",
    },
  ];

  return (
    <ScreenContainer>
      <View style={styles.screen}>

            <Pressable onPress={() => alert("Delete goal")}>
              <Text style={styles.deleteIcon}>🗑</Text>
            </Pressable>

          {/* Blue goal card */}
          <View style={styles.goalCard}>
            <Text style={styles.goalTitle}>{goal.name}</Text>

            <View style={styles.moneyRow}>
              <View>
                <Text style={styles.smallBlueText}>Current progress</Text>
                <Text style={styles.bigMoney}>{goal.current}</Text>
              </View>

              <View style={styles.targetBlock}>
                <Text style={styles.smallBlueText}>Target</Text>
                <Text style={styles.targetMoney}>{goal.target}</Text>
              </View>
            </View>

            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: goal.percent + "%" }]} />
            </View>

            <View style={styles.progressInfoRow}>
              <Text style={styles.cardBottomText}>{goal.percent}.0% complete</Text>
              <Text style={styles.cardBottomText}>{goal.remaining} remaining</Text>
            </View>
          </View>

          {/* Projection box */}
          <View style={styles.projectionCard}>
            <Text style={styles.sectionTitle}>Smart Projections</Text>

            <View style={styles.projectionList}>
              {projections.map((item) => (
                <View style={styles.projectionItem} key={item.id}>
                  <View>
                    <Text style={styles.projectionTitle}>{item.title}</Text>
                    <Text style={styles.projectionWeeks}>{item.weeks}</Text>
                  </View>

                  <Text style={styles.projectionDate}>{item.date}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Add money button */}
        <View style={styles.buttonArea}>
          <Pressable style={styles.addMoneyButton} onPress={() => alert("Add money")}>
            <Text style={styles.plusText}>＋</Text>
            <Text style={styles.addMoneyText}>Add Money</Text>
          </Pressable>
        </View>

        {/* Bottom navigation look-alike */}
        <View style={styles.bottomNav}>
          <Pressable style={styles.navItem} onPress={() => navigation.navigate("MainTabs", { screen: "HomePage" })}>
            <Text style={styles.navIcon}>⌂</Text>
            <Text style={styles.navText}>Home</Text>
          </Pressable>

          <Pressable
            style={[styles.navItem, styles.activeNavItem]}
            onPress={() => navigation.navigate("MainTabs", { screen: "GoalOverviewPage" })}>
            <Text style={styles.activeNavIcon}>◎</Text>
            <Text style={styles.activeNavText}>Goals</Text>
          </Pressable>

          <Pressable style={styles.navItem} onPress={() => navigation.navigate("MainTabs", { screen: "HistoryPage" })}>
            <Text style={styles.navIcon}>◷</Text>
            <Text style={styles.navText}>History</Text>
          </Pressable>

          <Pressable style={styles.navItem} onPress={() => alert("Analytics page not created yet")}>
            <Text style={styles.navIcon}>↗</Text>
            <Text style={styles.navText}>Analytics</Text>
          </Pressable>
        </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    paddingTop: 18,
    paddingBottom: 14,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  appTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
  },

  greeting: {
    fontSize: 14,
    color: "#555",
    marginTop: 2,
  },

  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  logoutIcon: {
    fontSize: 18,
    color: "#111",
  },

  logoutText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111",
  },

  main: {
    flex: 1,
    paddingHorizontal: 24,
  },

  topActions: {
    marginTop: 12,
    marginBottom: 22,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  backIcon: {
    fontSize: 24,
    color: "#111",
  },

  backText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111",
  },

  deleteIcon: {
    fontSize: 18,
    color: "#ef4444",
  },

  goalCard: {
    backgroundColor: "#1f5cff",
    borderRadius: 22,
    padding: 30,
    marginBottom: 24,
  },

  goalTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "500",
    marginBottom: 28,
  },

  moneyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 18,
  },

  smallBlueText: {
    color: "#bfdbfe",
    fontSize: 14,
    marginBottom: 4,
  },

  bigMoney: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "300",
  },

  targetBlock: {
    alignItems: "flex-end",
  },

  targetMoney: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "400",
  },

  progressTrack: {
    height: 12,
    backgroundColor: "#60a5fa",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 16,
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#050505",
  },

  progressInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  cardBottomText: {
    color: "#fff",
    fontSize: 14,
  },

  projectionCard: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 14,
    padding: 24,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111",
    marginBottom: 20,
  },

  projectionList: {
    gap: 14,
  },

  projectionItem: {
    backgroundColor: "#f9fafb",
    borderRadius: 9,
    paddingVertical: 14,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  projectionTitle: {
    fontSize: 14,
    color: "#111",
    marginBottom: 2,
  },

  projectionWeeks: {
    fontSize: 12,
    color: "#666",
  },

  projectionDate: {
    fontSize: 14,
    color: "#2563eb",
  },

  buttonArea: {
    paddingHorizontal: 24,
    paddingBottom: 12,
  },

  addMoneyButton: {
    backgroundColor: "#050316",
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 12,
  },

  plusText: {
    color: "#fff",
    fontSize: 20,
  },

  addMoneyText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },

  bottomNav: {
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    backgroundColor: "#fff",
    paddingTop: 8,
    paddingBottom: 8,
    paddingHorizontal: 18,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  navItem: {
    width: 68,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    borderRadius: 10,
  },

  activeNavItem: {
    backgroundColor: "#eaf2ff",
  },

  navIcon: {
    fontSize: 22,
    color: "#475569",
    marginBottom: 2,
  },

  activeNavIcon: {
    fontSize: 22,
    color: "#2563eb",
    marginBottom: 2,
  },

  navText: {
    fontSize: 12,
    color: "#475569",
  },

  activeNavText: {
    fontSize: 12,
    color: "#2563eb",
    fontWeight: "600",
  },
});
