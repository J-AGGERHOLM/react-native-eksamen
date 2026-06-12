import { Modal, View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useState } from "react";

export function AddMoneyModal({ visible, goal, onClose, onAddMoney }) {
  const [amount, setAmount] = useState("");

  const amountNumber = Number(amount);

  function handleAddMoney() {
    if (!amountNumber || amountNumber <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    onAddMoney(amountNumber);

    setAmount("");
    onClose();
  }

  function closeModal() {
    setAmount("");
    onClose();
  }

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <Pressable style={styles.closeButton} onPress={closeModal}>
            <Text style={styles.closeText}>×</Text>
          </Pressable>

          <Text style={styles.title}>Add Money to {goal?.name}</Text>
          <Text style={styles.subtitle}>How much would you like to add?</Text>

          <View style={styles.fieldBlock}>
            <Text style={styles.label}>Amount</Text>

            <TextInput
              style={styles.input}
              placeholder="$ 0.00"
              placeholderTextColor="#8f8f99"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
          </View>

          <Pressable style={styles.addButton} onPress={handleAddMoney}>
            <Text style={styles.addButtonText}>
              Add ${amountNumber > 0 ? amountNumber : 0}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 18,
  },

  modalCard: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 22,
  },

  closeButton: {
    position: "absolute",
    top: 10,
    right: 14,
    zIndex: 1,
  },

  closeText: {
    fontSize: 24,
    color: "#8f8f99",
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111111",
    textAlign: "center",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    color: "#8f8f99",
    textAlign: "center",
    marginBottom: 18,
  },

  fieldBlock: {
    marginBottom: 14,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111111",
    marginBottom: 8,
  },

  input: {
    height: 46,
    backgroundColor: "#f1f1f4",
    borderRadius: 8,
    paddingHorizontal: 14,
    fontSize: 16,
    color: "#111111",
  },

  addButton: {
    height: 46,
    borderRadius: 7,
    backgroundColor: "#050514",
    justifyContent: "center",
    alignItems: "center",
  },

  addButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
  },
});