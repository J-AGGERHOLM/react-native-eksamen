import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { ScreenContainer } from "../components/layout/ScreenContainer";
import { useNavigation } from "@react-navigation/native";
import { NewGoalModal } from "../components/modals/NewGoalModal";
import { GetGoals, SetGoal } from "../services/GoalUtil";
import { GetTransactions } from "../services/TransactionUtil";
import { CalculateTotalPaid, CalculateAmountLeft, CalculatePercentage } from "../utils/calculator";
import { formatMoney } from "../utils/format";

export function HomeScreen({ route }) {
  const userId = route.params?.userId;
  const navigation = useNavigation();
  
  const [modalVisible, setModalVisible] = useState(false);
  const [goals, setGoals] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    async function loadGoals() {
      try {
        if (!userId) {
          console.log("no userId found");
          return;
        }

        const goals = await GetGoals(userId);
        const goalIds = goals.map((goal) => goal.id);
        const transactions = await GetTransactions(goalIds);
        
        setGoals(goals);
        setTransactions(transactions);

      } catch (err) {
        console.log("Could not load goals: " + err);
      }
    }

    loadGoals();
  }, [userId]);


  async function addGoal(newGoal) {
    try {
      if (!userId) {
        console.log("No userId found");
        return;
      }

      const savedGoal = await SetGoal(newGoal, userId);
      setGoals((currentGoals) => [...currentGoals, savedGoal]);

    } catch (err) {
      console.log("Could not create goal: " + err);
    }
  }

  const goalsWithProgress = goals.map((goal) => {
    const goalTransactions = transactions.filter((transaction) => {
      return transaction.goalID === goal.id;
    });

    const totalPaid = CalculateTotalPaid(goalTransactions);
    const amountLeft = CalculateAmountLeft(goal.target, totalPaid);
    const percentage = CalculatePercentage(goal.target, totalPaid);

    return {
      ...goal,
      totalPaid,
      amountLeft,
      percentage,
    };
  });

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/*
            Top view of page. Box of summary of total goals.
        */}
        <SavingsSummaryCard goals={goalsWithProgress} />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Goals</Text>
          {/*
              Show modual on press.
          */}
          <Pressable style={styles.newGoalButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.newGoalButtonText}>+ New Goal</Text>
          </Pressable>
        </View>
        {/* List all goals. */}
        <View style={styles.goalList}>
          {/* filter only show completed.
              maps value to function goalCard method for the show specific goal.
          */}
          {goalsWithProgress
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

// Top view of page
function SavingsSummaryCard({ goals }) {
  const { totalPaid, totalAmount } = totalSavings(goals);

  const remaining = CalculateAmountLeft(totalAmount, totalPaid);
  const percentage = CalculatePercentage(totalAmount, totalPaid);

  return (
    <View style={styles.summaryCard}>
      <View>
        <Text style={styles.summaryLabel}>Total Savings</Text>
        <Text style={styles.summaryAmount}>{formatMoney(totalPaid)}</Text>

        <View style={styles.summaryFooter}>
          <Text style={styles.summaryFooterText}>
            {percentage}% complete
          </Text>

          <Text style={styles.summaryFooterText}>
            {formatMoney(remaining)} remaining
          </Text>
        </View>
      </View>
    </View>
  );
}

// A view for showing a specific goal
function GoalCard({ title, totalPaid, target, percentage, amountLeft, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.goalCard}>
      <Text style={styles.goalTitle}>{title}</Text>

      <Text style={styles.goalAmount}>
        {formatMoney(totalPaid)} of {formatMoney(target)}
      </Text>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${Math.min(percentage, 100)}%` }]} />
      </View>

      <View style={styles.goalFooter}>
        <Text style={styles.goalFooterText}>{percentage}% complete</Text>
        <Text style={styles.remainingText}>{formatMoney(amountLeft)} to go</Text>
      </View>
    </Pressable>
  );
}

function totalSavings(goals) {
  return goals.reduce(
    (totals, goal) => {
      totals.totalPaid += Number(goal.totalPaid);
      totals.totalAmount += Number(goal.target);

      return totals;
    },
    // If goal is empty
    {
      totalPaid: 0,
      totalAmount: 0,
    }
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
