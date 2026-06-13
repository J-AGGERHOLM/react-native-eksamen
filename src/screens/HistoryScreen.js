import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from "react-native";
import { ScreenContainer } from "../components/layout/ScreenContainer";
import { GetGoals } from "../services/GoalUtil";
import { useEffect, useState } from "react";
import { GetTransactions, DeleteTransaction } from "../services/TransactionUtil";
import { formatDate, formatTime, formatMoney } from "../utils/format";
import { FontAwesome5 } from "@expo/vector-icons";

export function HistoryScreen({ route }) {
  // Gets the logged-in user id from navigation params.
  const userId = route.params?.userId;

  // Stores the user's goals.
  const [goals, setGoals] = useState([]);
  // Stores transactions connected to the user's goals.
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // Loads goals and related transactions for the user.
    async function loadHistoryData() {
      try {
        // Stops loading if no user is logged in.
        if (!userId) {
          Alert.alert("No user logged in to fetch data from");
          return;
        }

        // Fetches all goals for the logged-in user and Saves goals in state.
        const fetchedGoals = await GetGoals(userId);
        setGoals(fetchedGoals);

        // Extracts goal ids to fetch matching transactions.
        const goalIds = fetchedGoals.map((goal) => goal.id);

        // Fetches transactions where goalID matches the user's goals and saves them in state.
        const fetchedTransactions = await GetTransactions(goalIds);
        setTransactions(fetchedTransactions);
      } catch (err) {
        console.log("Could not load goals: " + err);
      }
    }

    // Runs the history loading function.
    loadHistoryData();
  }, [userId]);

  // Calculates the total amount contributed across all transactions.
  const totalContributed = transactions.reduce((total, transaction) => {
    return total + Number(transaction.amount);
  }, 0);

  // Groups transactions by their formatted date.
  const groupedTransactions = groupTransactionsByDate(transactions);

  //Delete a transaction:
  async function handleDeleteTransaction(transactionId) {
    Alert.alert("Delete transaction", "Are you sure you want to delete this transaction?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await DeleteTransaction(transactionId);

            setTransactions((currentTransactions) =>
              currentTransactions.filter((transaction) => transaction.id !== transactionId),
            );
          } catch (error) {
            console.log("Could not delete transaction:", error);
          }
        },
      },
    ]);
  }

  return (
    <ScreenContainer>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Transaction History</Text>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Contributed</Text>
          {/* Displays total contributed amount. */}
          <Text style={styles.summaryAmount}>{formatMoney(totalContributed)}</Text>
          {/* Displays number of transactions. */}
          <Text style={styles.summarySubText}>{transactions.length} transactions</Text>
        </View>

        {/* 
            Uses Object.keys to fetch date. 
            Loops through each date group.
        */}
        {Object.keys(groupedTransactions).map((dateKey) => (
          <View key={dateKey} style={styles.dateGroup}>
            <Text style={styles.dateTitle}>{dateKey}</Text>
            {/* 
                Render all transactions for the specific date group.
                key={transaction.id} react can track each transaction for optimal rendering. 
            */}
            {groupedTransactions[dateKey].map((transaction) => (
              <TransactionCard
                key={transaction.id}
                transaction={transaction}
                goals={goals}
                onDelete={handleDeleteTransaction}
              />
            ))}
          </View>
        ))}
      </ScrollView>
    </ScreenContainer>
  );
}

function TransactionCard({ transaction, goals, onDelete }) {
  // Finds the goal connected to this transaction.
  const goal = goals.find((goal) => goal.id === transaction.goalID);
  const goalName = goal ? goal.name : "Unknown goal";

  // Uses the goal name or a fallback if no goal is found.
  return (
    <View style={styles.transactionCard}>
      <View>
        {/* Displays the related goal name. */}
        <Text style={styles.transactionGoal}>{goalName}</Text>
        {/* Displays the transaction time. */}
        <Text style={styles.transactionTime}>{formatTime(transaction.date)}</Text>
      </View>

      {/* Displays the transaction amount. */}
      <Text style={styles.transactionAmount}>+{formatMoney(transaction.amount)}</Text>

      {/* Delete button */}
      <Pressable onPress={() => onDelete(transaction.id)} style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>
          {" "}
          <FontAwesome5 name="trash-alt" size={18} color="#ef4444" />
        </Text>
      </Pressable>
    </View>
  );
}

function groupTransactionsByDate(transactions) {
  // Builds an object where each key is a formatted date.
  return transactions.reduce((groups, transaction) => {
    // Formats the transaction date for grouping.
    const dateKey = formatDate(transaction.date);

    // Creates the date group if it does not exist.
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }

    // Adds the transaction to its date group.
    groups[dateKey].push(transaction);

    return groups;
  }, {});
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },

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

  filterRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },

  filterButton: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    backgroundColor: "#f1f1f3",
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  filterText: {
    fontSize: 15,
    color: "#111111",
  },

  filterArrow: {
    fontSize: 18,
    color: "#94a3b8",
  },

  dateGroup: {
    marginBottom: 24,
  },

  dateTitle: {
    fontSize: 15,
    color: "#475569",
    marginBottom: 12,
  },

  transactionCard: {
    minHeight: 82,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 14,
    backgroundColor: "#ffffff",
    paddingHorizontal: 18,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  transactionGoal: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111111",
    marginBottom: 6,
  },

  transactionTime: {
    fontSize: 14,
    color: "#475569",
  },

  transactionAmount: {
    fontSize: 18,
    color: "#00a63e",
    fontWeight: "500",
  },

  transactionCard: {
    minHeight: 82,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 14,
    backgroundColor: "#ffffff",
    paddingHorizontal: 18,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  transactionGoal: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111111",
    marginBottom: 6,
  },

  transactionTime: {
    fontSize: 14,
    color: "#475569",
  },

  transactionAmount: {
    fontSize: 18,
    color: "#00a63e",
    fontWeight: "500",
  },
});
