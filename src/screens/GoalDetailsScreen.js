import { View, Text, Pressable, StyleSheet } from "react-native";
import { ScreenContainer } from "../components/layout/ScreenContainer";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome5 } from "@expo/vector-icons";
import { AddMoneyModal } from "../components/modals/AddMoneyModal";
import { useState, useEffect } from "react";
import { SetTransactions, GetTransactionsByGoalID  } from "../services/TransactionUtil";
import { CalculateAmountLeft, 
  CalculatePercentage, 
  CalculateProjections, 
  CalculateTotalPaid 
} from "../utils/calculator";
import { formatMoney, formatDate } from "../utils/format";

export function GoalDetailsScreen({ route }) {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [transactions, setAllTransactions] = useState([]);
  const { goal } = route.params;

  useEffect(() => {
    async function loadTransactions() {
      try {
        if (!goal.id) {
          console.log("No goal id found");
          return;
        }

        const data = await GetTransactionsByGoalID(goal.id);
        setAllTransactions(data);
      } catch (error) {
        console.log("Could not load transactions:", error);
      }
    }

    loadTransactions();
  }, [goal.id]);

  const totalPaid = CalculateTotalPaid(transactions);
  const amountLeft = CalculateAmountLeft(goal.target, totalPaid);
  const percentage = CalculatePercentage(goal.target, totalPaid);
  const projections = CalculateProjections(goal.target, totalPaid);

  async function addMoney(amount) {
      if(!goal.id) {
        console.log("No goal ID found");
        return;
      }

      const newTransaction = {
        amount: amount,
        goalID: goal.id,
        date: new Date(),
      };
          
       try {
        const createdTransactionId = await SetTransactions(newTransaction);

        setAllTransactions((currentTransactions) => [
          {
            id: createdTransactionId,
            ...newTransaction,
          },
          ...currentTransactions,
        ]);
      } catch (error) {
        console.log("Could not add transaction:", error);
      }
  }

  return (
    <ScreenContainer>
      <View style={styles.screen}>
        <View style={styles.topActions}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <FontAwesome5 name="arrow-left" size={18} color="#111" />
            <Text style={styles.backText}>Back</Text>
          </Pressable>

          <Pressable onPress={() => alert("Delete goal")}>
            <FontAwesome5 name="trash-alt" size={18} color="#ef4444" />
          </Pressable>
        </View>

        <View style={styles.goalCard}>
          <Text style={styles.goalTitle}>{goal.name}</Text>
          <Text style={styles.dueDateText}>Due date: {formatDate(goal.dueDate)}</Text>

          <View style={styles.moneyRow}>
            <View>
              <Text style={styles.smallBlueText}>Current progress</Text>
              <Text style={styles.bigMoney}>{formatMoney(totalPaid)}</Text>
            </View>

            <View style={styles.targetBlock}>
              <Text style={styles.smallBlueText}>Target</Text>
              <Text style={styles.targetMoney}>{formatMoney(goal.target)}</Text>
            </View>
          </View>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${percentage}%` }]} />
          </View>

          <View style={styles.progressInfoRow}>
            <Text style={styles.cardBottomText}>{percentage}% complete</Text>
            <Text style={styles.cardBottomText}>{formatMoney(amountLeft)} remaining</Text>
          </View>
        </View>

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

      <View style={styles.buttonArea}>
        <Pressable style={styles.addMoneyButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.plusText}>＋</Text>
          <Text style={styles.addMoneyText}>Add Money</Text>
        </Pressable>
      </View>
      <AddMoneyModal visible={modalVisible} onClose={() => setModalVisible(false)} onAddMoney={addMoney} />
    </ScreenContainer>
  );
}



const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff",
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

  backText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111",
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
    marginBottom: 6,
  },

  dueDateText: {
    color: "#bfdbfe",
    fontSize: 14,
    marginBottom: 26,
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

  emptyText: {
    fontSize: 14,
    color: "#666",
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
});
