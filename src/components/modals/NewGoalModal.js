import { Modal, View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useState } from "react";

export function NewGoalModal({ visible, onClose, onCreateGoal }) {
  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");

  function createGoal() {
    const cleanedName = goalName.trim();
    const targetNumber = Number(targetAmount);

    if (cleanedName.length === 0) {
      alert("Please enter a goal name");
      return;
    }

    if (targetNumber <= 0) {
      alert("Please enter a valid target amount");
      return;
    }

    const newGoal = {
      id: Date.now().toString(),
      completed: false,
      dueDate: "No date set",
      name: cleanedName,
      startDate: new Date().toString(),
      userID: "3f2504e0-4f89-11d3-9a0c-0305e82c3301",
      amountLeft: targetNumber,
      totalPaid: 0,
      target: targetNumber,
      percentage: 0,
    };

    onCreateGoal(newGoal);

    setGoalName("");
    setTargetAmount("");
    onClose();
  }

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>×</Text>
          </Pressable>

          <Text style={styles.title}>Create New Goal</Text>
          <Text style={styles.subtitle}>Set a savings goal to track your progress</Text>

          <View style={styles.form}>
            <View style={styles.fieldBlock}>
              <Text style={styles.label}>Goal name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., New laptop"
                placeholderTextColor="#8f8f99"
                value={goalName}
                onChangeText={setGoalName}
              />
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.label}>Target amount</Text>
              <TextInput
                style={styles.input}
                placeholder="1000"
                placeholderTextColor="#8f8f99"
                keyboardType="numeric"
                value={targetAmount}
                onChangeText={setTargetAmount}
              />
            </View>

            <Pressable style={styles.createButton} onPress={createGoal}>
              <Text style={styles.createButtonText}>Create Goal</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  modalCard: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
  },

  closeButton: {
    position: "absolute",
    top: 10,
    right: 14,
    zIndex: 1,
  },

  closeText: {
    fontSize: 22,
    color: "#555",
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
    textAlign: "center",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 13,
    color: "#8f8f99",
    textAlign: "center",
    marginBottom: 18,
  },

  form: {
    gap: 12,
  },

  fieldBlock: {
    gap: 6,
  },

  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#222",
  },

  input: {
    backgroundColor: "#f1f1f4",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: "#111",
  },

  createButton: {
    backgroundColor: "#050514",
    borderRadius: 5,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 2,
  },

  createButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});