import { useCallback, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { FontAwesome5 } from "@expo/vector-icons";

import { ScreenContainer } from "../components/layout/ScreenContainer";
import { GetGoals, UpdateGoalCompletion } from "../services/GoalUtil";
import { GetTransactions } from "../services/TransactionUtil";
import { CalculateAmountLeft, CalculatePercentage, CalculateTotalPaid } from "../utils/calculator";
import { formatDate, formatMoney } from "../utils/format";
import { LogoutButton } from "../components/modals/LogOutContainer";

export function MileStoneScreen({ route }) {
  // Gets the logged-in user's id from navigation params.
  const userId = route.params?.userId;

  // Gives access to navigation, so we can open the goal details page.
  const navigation = useNavigation();

  // Stores only the goals that have been completed.
  const [completedGoals, setCompletedGoals] = useState([]);

  /*
    useFocusEffect runs every time this screen is opened.

    This is useful here because a goal can become completed on another screen,
    for example when the user adds money on GoalDetailsScreen.
  */
  useFocusEffect(
    useCallback(() => {
      loadCompletedGoals();
    }, [userId]),
  );

  async function loadCompletedGoals() {
    try {
      // Stops the function if no user is logged in.
      if (!userId) {
        console.log("No user id found for milestones");
        return;
      }

      // Fetches all goals that belong to the logged-in user.
      const goals = await GetGoals(userId);

      // Extracts all goal ids, so we can fetch matching transactions.
      const goalIds = goals.map((goal) => goal.id);

      // Fetches all transactions connected to the user's goals.
      const transactions = await GetTransactions(goalIds);

      // This array will contain only the completed goals.
      const completedGoalsList = [];

      /*
        Loops through each goal and checks its progress.

        A goal is completed if:
        1. goal.completed is already true in Firestore
        OR
        2. the calculated percentage is 100 or higher
      */
      for (const goal of goals) {
        // Finds only the transactions that belong to this specific goal.
        const goalTransactions = transactions.filter((transaction) => {
          return transaction.goalID === goal.id;
        });

        // Calculates how much has been saved for this goal.
        const totalPaid = CalculateTotalPaid(goalTransactions);

        // Calculates how much money is still missing.
        const amountLeft = CalculateAmountLeft(goal.target, totalPaid);

        // Calculates progress in percent.
        const percentage = CalculatePercentage(goal.target, totalPaid);

        // Checks if the goal has reached 100%.
        const goalIsCompleted = goal.completed === true || percentage >= 100;

        // If the goal is not completed, skip it.
        if (!goalIsCompleted) {
          continue;
        }

        /*
          If the goal just reached 100%, but Firestore has not been updated yet,
          we update it here.

          completedAt is the date when the app marks the goal as completed.
        */
        const completedAt = goal.completedAt ?? new Date();

        if (goal.completed !== true) {
          await UpdateGoalCompletion(goal.id, true, completedAt);
        }

        /*
          Adds the completed goal to the list.

          We include calculated values like totalPaid and percentage,
          because the UI needs them.
        */
        completedGoalsList.push({
          ...goal,
          completed: true,
          completedAt: completedAt,
          totalPaid: totalPaid,
          amountLeft: amountLeft,
          percentage: percentage,
        });
      }

      // Saves the completed goals in state, so they appear on the screen.
      setCompletedGoals(completedGoalsList);
    } catch (error) {
      console.log("Could not load completed goals:", error);
    }
  }

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.pageTitle}>Milestones</Text>
          <LogoutButton />
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Completed Goals</Text>
          <Text style={styles.summaryAmount}>{completedGoals.length}</Text>
          <Text style={styles.summarySubText}>Purchased items</Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Purchased Items</Text>
        </View>

        {completedGoals.length === 0 ? (
          <EmptyMilestoneCard />
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
    <Pressable style={styles.goalCard} onPress={onPress}>
      <View style={styles.iconCircle}>
        <FontAwesome5 name="check" size={13} color="#00a63e" />
      </View>

      <View style={styles.goalTextContainer}>
        <Text style={styles.goalTitle}>{goal.name}</Text>

        <Text style={styles.goalAmount}>{formatMoney(goal.totalPaid)} saved</Text>

        <Text style={styles.goalDate}>Completed {formatDate(goal.completedAt)}</Text>
      </View>
    </Pressable>
  );
}

function EmptyMilestoneCard() {
  return (
    <View style={styles.emptyCard}>
      <View style={styles.emptyIconCircle}>
        <FontAwesome5 name="flag-checkered" size={18} color="#00a63e" />
      </View>

      <Text style={styles.emptyTitle}>No completed goals yet</Text>

      <Text style={styles.emptyText}>When a goal reaches 100%, it will be shown here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 120,
  },

  pageTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111111",
    marginBottom: 24,
  },

  summaryCard: {
    backgroundColor: "#07983d",
    borderRadius: 22,
    padding: 24,
    marginBottom: 24,
  },

  summaryLabel: {
    fontSize: 15,
    color: "rgba(255,255,255,0.85)",
    marginBottom: 6,
  },

  summaryAmount: {
    fontSize: 40,
    fontWeight: "500",
    color: "#ffffff",
    marginBottom: 12,
  },

  summarySubText: {
    fontSize: 15,
    color: "rgba(255,255,255,0.85)",
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

  goalList: {
    gap: 14,
  },

  goalCard: {
    minHeight: 88,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 14,
    backgroundColor: "#ffffff",
    paddingHorizontal: 18,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#dcfce7",
    alignItems: "center",
    justifyContent: "center",
  },

  goalTextContainer: {
    flex: 1,
  },

  goalTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111111",
    marginBottom: 6,
  },

  goalAmount: {
    fontSize: 14,
    color: "#475569",
    marginBottom: 4,
  },

  goalDate: {
    fontSize: 13,
    color: "#64748b",
  },

  emptyCard: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 14,
    backgroundColor: "#ffffff",
    padding: 24,
    alignItems: "center",
  },

  emptyIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#dcfce7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111111",
    marginBottom: 6,
  },

  emptyText: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 20,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  pageTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111111",
  },
});
