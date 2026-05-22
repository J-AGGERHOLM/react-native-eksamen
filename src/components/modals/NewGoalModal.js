import { Modal, View, Text, TextInput, Pressable, StyleSheet, Platform } from "react-native";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";

export function NewGoalModal({ visible, onClose, onCreateGoal }) {
  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");

  const [dueDate, setDueDate] = useState("");
  const [datePickerValue, setDatePickerValue] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  async function createGoal() {
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

    if (dueDate.length === 0) {
      alert("Please select a due date");
      return;
    }

    const newGoal = {
      completed: false,
      dueDate: dueDate,
      name: cleanedName,
      startDate: formatDate(new Date()),
      amountLeft: targetNumber,
      totalPaid: 0,
      target: targetNumber,
      percentage: 0,
    };

    onCreateGoal(newGoal);

    resetForm();
    onClose();
  }

  function resetForm() {
    setGoalName("");
    setTargetAmount("");
    setDueDate("");
    setDatePickerValue(new Date());
    setShowDatePicker(false);
  }

  function closeModal() {
    resetForm();
    onClose();
  }

  function handleDateChange(event, selectedDate) {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }

    if (selectedDate) {
      setDatePickerValue(selectedDate);
      setDueDate(formatDate(selectedDate));
    }
  }

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <Pressable style={styles.closeButton} onPress={closeModal}>
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

            <View style={styles.fieldBlock}>
              <Text style={styles.label}>Due date</Text>

              <Pressable style={styles.dateInput} onPress={() => setShowDatePicker(true)}>
                <Text style={dueDate ? styles.dateText : styles.placeholderText}>{dueDate || "Select due date"}</Text>
              </Pressable>

              {showDatePicker && (
                <DateTimePicker value={datePickerValue} mode="date" display="default" onChange={handleDateChange} />
              )}
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

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
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

  dateInput: {
    backgroundColor: "#f1f1f4",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  dateText: {
    fontSize: 15,
    color: "#111",
  },

  placeholderText: {
    fontSize: 15,
    color: "#8f8f99",
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
