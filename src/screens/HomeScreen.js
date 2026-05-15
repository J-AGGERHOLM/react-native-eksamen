import { useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { ScreenContainer } from "../components/layout/ScreenContainer";
import { useNavigation } from "@react-navigation/native";
import { NewGoalModal } from "../components/modals/NewGoalModal";

const startGoals = [
  {
    id: "1",
    completed: false,
    dueDate: new Date("2026-08-13T10:30:00"),
    name: "New MacBook Pro",
    startDate: new Date(),
    userID: "3f2504e0-4f89-11d3-9a0c-0305e82c3301",
    amountLeft: 1999,
    totalPaid: 500,
    target: 2499,
    percentage: 20,
  },
  {
    id: "2",
    completed: false,
    dueDate: new Date("2026-09-01T12:00:00"),
    name: "Summer Vacation",
    startDate: new Date(),
    userID: "3f2504e0-4f89-11d3-9a0c-0305e82c3301",
    amountLeft: 2800,
    totalPaid: 700,
    target: 3500,
    percentage: 20,
  },
  {
    id: "3",
    completed: false,
    dueDate: new Date("2026-12-31T18:00:00"),
    name: "Emergency Fund",
    startDate: new Date(),
    userID: "3f2504e0-4f89-11d3-9a0c-0305e82c3301",
    amountLeft: 7500,
    totalPaid: 2500,
    target: 10000,
    percentage: 25,
  },
];

export function HomeScreen() {
  const navigation = useNavigation();

  const [goals, setGoals] = useState(startGoals);
  const [modalVisible, setModalVisible] = useState(false);

  function addGoal(newGoal) {
    setGoals((currentGoals) => [...currentGoals, newGoal]);
  }

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <SavingsSummaryCard goals={goals} />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Goals</Text>

          <Pressable style={styles.newGoalButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.newGoalButtonText}>+ New Goal</Text>
          </Pressable>
        </View>

        <View style={styles.goalList}>
          {goals
            .filter((goal) => !goal.completed)
            .map((goal) => (
              <GoalCard
                key={goal.id}
                title={goal.name}
                totalPaid={goal.totalPaid}
                target={goal.target}
                percentage={goal.percentage}
                amountLeft={goal.amountLeft}
                onPress={() =>
                  navigation.navigate("GoalDetailsPage", {
                    goal: goal,
                  })
                }
              />
            ))}
        </View>
      </ScrollView>
      <NewGoalModal visible={modalVisible} onClose={() => setModalVisible(false)} onCreateGoal={addGoal} />
    </ScreenContainer>
  );
}

function SavingsSummaryCard({ goals }) {
  const { totalPaid, totalAmount } = totalSavings(goals);
  return (
    <View style={styles.summaryCard}>
      <View>
        <Text style={styles.summaryLabel}>Total Savings</Text>
        <Text style={styles.summaryAmount}>${totalPaid}</Text>

        <View style={styles.summaryFooter}>
          <Text style={styles.summaryFooterText}>Target: ${totalAmount}</Text>
          <Text style={styles.summaryFooterText}>{goals.filter((goal) => !goal.completed).length} active goals</Text>
        </View>
      </View>
    </View>
  );
}

function totalSavings(goals) {
  let totalPaid = 0;
  let totalAmount = 0;

  goals.map((goal) => {
    totalPaid += goal.totalPaid;
    totalAmount += goal.target;
  });

  return { totalPaid, totalAmount };
}

function GoalCard({ title, totalPaid, target, percentage, amountLeft, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.goalCard}>
      <Text style={styles.goalTitle}>{title}</Text>

      <Text style={styles.goalAmount}>
        {totalPaid} of {target}
      </Text>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${Math.min(percentage, 100)}%` }]} />
      </View>

      <View style={styles.goalFooter}>
        <Text style={styles.goalFooterText}>{percentage}% complete</Text>
        <Text style={styles.remainingText}>{amountLeft} to go</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 32,
  },

  summaryCard: {
    minHeight: 148,
    borderRadius: 22,
    backgroundColor: "#1f5cff",
    padding: 24,
    justifyContent: "center",
    marginBottom: 26,
  },

  summaryLabel: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
  },

  summaryAmount: {
    marginTop: 4,
    fontSize: 40,
    lineHeight: 46,
    fontWeight: "500",
    color: "#fff",
  },

  summaryFooter: {
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  summaryFooterText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.82)",
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111111",
  },

  newGoalButton: {
    height: 42,
    borderRadius: 8,
    backgroundColor: "#050514",
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  newGoalButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
  },

  goalList: {
    gap: 16,
  },

  goalCard: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 14,
    backgroundColor: "#fff",
    padding: 24,
  },

  goalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111111",
    marginBottom: 8,
  },

  goalAmount: {
    fontSize: 15,
    color: "#475569",
    marginBottom: 18,
  },

  progressTrack: {
    height: 7,
    borderRadius: 999,
    backgroundColor: "#d1d1d6",
    overflow: "hidden",
    marginBottom: 18,
  },

  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#050514",
  },

  goalFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  goalFooterText: {
    fontSize: 15,
    color: "#475569",
  },

  remainingText: {
    fontSize: 15,
    color: "#005cff",
  },
});
