import { useCallback, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { FontAwesome5 } from "@expo/vector-icons";
import { ScreenContainer } from "../components/layout/ScreenContainer";
import { GetGoals, UpdateGoalCompletion } from "../services/GoalUtil";
import { GetTransactions } from "../services/TransactionUtil";
import { CalculateAmountLeft, CalculatePercentage, CalculateTotalPaid } from "../utils/calculator";
import { formatDate, formatMoney } from "../utils/format";

export function MileStoneScreen({ route }) {
  const userId = route.params?.userId;
  const navigation = useNavigation();

  const [completedGoals, setCompletedGoals] = useState([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let screenIsActive = true;

      async function loadMilestones() {
        try {
          if (!userId) {
            console.log("No user id found for milestones");
            return;
          }

          setLoading(true);

          const fetchedGoals = await GetGoals(userId);
          const goalIds = fetchedGoals.map((goal) => goal.id);
          const fetchedTransactions = await GetTransactions(goalIds);

          const goalsWithProgress = fetchedGoals.map((goal) => {
            return createGoalWithProgress(goal, fetchedTransactions);
          });

          const reachedGoals = goalsWithProgress.filter((goal) => goal.isCompleted);

          await Promise.all(
            reachedGoals
              .filter((goal) => !goal.completed)
              .map((goal) => UpdateGoalCompletion(goal.id, true, goal.completionDate ?? new Date())),
          );

          if (screenIsActive) {
            setCompletedGoals(reachedGoals);
          }
        } catch (error) {
          console.log("Could not load milestones:", error);
        } finally {
          if (screenIsActive) {
            setLoading(false);
          }
        }
      }

      loadMilestones();

      return () => {
        screenIsActive = false;
      };
    }, [userId]),
  );

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.topDivider} />

        <View style={styles.smallHeaderRow}>
          <Text style={styles.smallHeaderTitle}>Purchased Items</Text>
          <Text style={styles.viewAllText}>View all</Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.pageTitle}>Purchased Items</Text>

          <View style={styles.completedBadge}>
            <Text style={styles.completedBadgeText}>{completedGoals.length} completed</Text>
          </View>
        </View>

        {loading ? (
          <View style={styles.centerState}>
            <ActivityIndicator />
            <Text style={styles.centerStateText}>Loading completed goals...</Text>
          </View>
        ) : completedGoals.length === 0 ? (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIconCircle}>
              <FontAwesome5 name="flag-checkered" size={18} color="#16a34a" />
            </View>
            <Text style={styles.emptyTitle}>No completed goals yet</Text>
            <Text style={styles.emptyText}>
              When a goal reaches its target amount, it will show up here.
            </Text>
          </View>
        ) : (
          <View style={styles.goalList}>
            {completedGoals.map((goal) => (
              <MilestoneCard
                key={goal.id}
                goal={goal}
                onPress={() =>
                  navigation.navigate("GoalDetailsPage", {
                    goal: goal,
                  })
                }
              />
            ))}
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

function MilestoneCard({ goal, onPress }) {
  return (
    <Pressable style={styles.milestoneCard} onPress={onPress}>
      <View style={styles.checkCircle}>
        <FontAwesome5 name="check" size={12} color="#16a34a" />
      </View>

      <View style={styles.cardTextBlock}>
        <Text style={styles.goalTitle}>{goal.name}</Text>
        <Text style={styles.savedText}>{formatMoney(goal.totalPaid)} saved</Text>

        <View style={styles.dateRow}>
          <FontAwesome5 name="calendar-alt" size={12} color="#64748b" />
          <Text style={styles.dateText}>Purchased {formatDate(goal.completionDate)}</Text>
        </View>
      </View>
    </Pressable>
  );
}

function createGoalWithProgress(goal, transactions) {
  const goalTransactions = transactions.filter((transaction) => transaction.goalID === goal.id);

  const totalPaid = CalculateTotalPaid(goalTransactions);
  const amountLeft = CalculateAmountLeft(goal.target, totalPaid);
  const percentage = CalculatePercentage(goal.target, totalPaid);
  const completionDate = goal.completedAt ?? getLatestTransactionDate(goalTransactions) ?? goal.dueDate;

  return {
    ...goal,
    totalPaid,
    amountLeft,
    percentage,
    completionDate,
    isCompleted: goal.completed === true || percentage >= 100,
  };
}

function getLatestTransactionDate(transactions) {
  if (transactions.length === 0) {
    return null;
  }

  const latestTransaction = transactions.reduce((latest, transaction) => {
    return getDateTime(transaction.date) > getDateTime(latest.date) ? transaction : latest;
  });

  return latestTransaction.date;
}

function getDateTime(value) {
  if (!value) {
    return 0;
  }

  if (value.seconds) {
    return value.seconds * 1000;
  }

  if (value.toDate) {
    return value.toDate().getTime();
  }

  const date = new Date(value);
  return isNaN(date.getTime()) ? 0 : date.getTime();
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 120,
  },

  topDivider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginBottom: 20,
  },

  smallHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },

  smallHeaderTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#111111",
  },

  viewAllText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#2563eb",
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },

  pageTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111111",
  },

  completedBadge: {
    backgroundColor: "#dcfce7",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },

  completedBadgeText: {
    color: "#16a34a",
    fontSize: 13,
    fontWeight: "500",
  },

  goalList: {
    gap: 16,
  },

  milestoneCard: {
    minHeight: 100,
    borderWidth: 1,
    borderColor: "#86efac",
    backgroundColor: "#f7fdf9",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },

  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 999,
    backgroundColor: "#dcfce7",
    borderWidth: 1,
    borderColor: "#86efac",
    alignItems: "center",
    justifyContent: "center",
  },

  cardTextBlock: {
    flex: 1,
  },

  goalTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111111",
    marginBottom: 6,
  },

  savedText: {
    fontSize: 14,
    color: "#475569",
    marginBottom: 8,
  },

  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  dateText: {
    fontSize: 12,
    color: "#64748b",
  },

  centerState: {
    alignItems: "center",
    paddingVertical: 48,
    gap: 10,
  },

  centerStateText: {
    color: "#64748b",
    fontSize: 14,
  },

  emptyCard: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 14,
    backgroundColor: "#ffffff",
    padding: 22,
    alignItems: "center",
  },

  emptyIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 999,
    backgroundColor: "#dcfce7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111111",
    marginBottom: 6,
  },

  emptyText: {
    textAlign: "center",
    fontSize: 14,
    color: "#64748b",
    lineHeight: 20,
  },
});