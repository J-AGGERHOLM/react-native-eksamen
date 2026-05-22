import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { ScreenContainer } from "../components/layout/ScreenContainer";
import { GetGoals } from "../services/GoalUtil";
import { useEffect, useState } from "react";
import { GetTransactions } from "../services/TransactionUtil";

export function HistoryScreen() {
  const [goals, setGoals] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    async function loadGoals() {
      try {
        const goals = await GetGoals();
        setGoals(goals);

        const transactions = await GetTransactions();
        setTransactions(transactions)
      } catch (err) {
        console.log("Could not load goals: " + err);
      }
    }
    loadGoals();
  }, []);

  // totalContributed = Samlet overføresler.
  const totalContributed = transactions.reduce((total, transaction) => {
    return total + transaction.amount;
  }, 0);

  // Gruppere transactions efter dato.
  const groupedTransactions = groupTransactionsByDate(transactions);

  return (
    <ScreenContainer>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>Transaction History</Text>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Contributed</Text>
          <Text style={styles.summaryAmount}>
            {totalContributed}kr
          </Text>
          <Text style={styles.summarySubText}>
            {transactions.length} transactions
          </Text>
        </View>

        <View style={styles.filterRow}>
          <Pressable style={styles.filterButton}>
            <Text style={styles.filterText}>All goals</Text>
            <Text style={styles.filterArrow}>⌄</Text>
          </Pressable>

          <Pressable style={styles.filterButton}>
            <Text style={styles.filterText}>All time</Text>
            <Text style={styles.filterArrow}>⌄</Text>
          </Pressable>
        </View>
        {/* 
            Bruger Object.keys til at hente dato, som er nøglen i dictionary. 
            Looper igennem alle datoer
        */}
        {Object.keys(groupedTransactions).map(dateKey => (
          <View key={dateKey} style={styles.dateGroup}>
            <Text style={styles.dateTitle}>{dateKey}</Text>
            {/* 
                Looper igennem alle transactioner for den specifikke dato
                key={transaction.id} er til for at react kan kende forskel på elementerne. 
            */}
            {groupedTransactions[dateKey].map(transaction => (
              <TransactionCard
                key={transaction.id}
                transaction={transaction}
                goals={goals}
              />
            ))}
          </View>
        ))}
      </ScrollView>
    </ScreenContainer>
  );
}

function TransactionCard({ transaction, goals }) {
  // Finder navn på transaction.
  const goal = goals.find(goal => goal.id === transaction.goalID);
  const goalName = goal ? goal.name : "Unknown goal";

  // Laver view for specifik transaction
  return (
    <View style={styles.transactionCard}>
      <View>
        <Text style={styles.transactionGoal}>{goalName}</Text>
        <Text style={styles.transactionTime}>
          {formatTransactionTime(transaction.date)}
        </Text>
      </View>

      <Text style={styles.transactionAmount}>
        +{transaction.amount}kr
      </Text>
    </View>
  );
}

function groupTransactionsByDate(transactions) {
  return transactions.reduce((groups, transaction) => {

    const dateKey = formatTransactionTime(transaction.date);

    // Hvis dato ikke eksistere
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }

    // indsæt transaktion på dato gruppen.
    groups[dateKey].push(transaction);

    return groups;
  }, {});
}

// Firestone viser en dato normalt. Men når man henter ind, skrives det i date objekt
// som har følgende værdier: seconds og nanoseconds. Man skal konventere det til date.
function formatTransactionTime(timestamp) {
  if (!timestamp) {
    return "";
  }

  // Converts timestamp object to date.
  const date = new Date(timestamp.seconds * 1000);

  return date.toLocaleDateString("da-DK", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
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