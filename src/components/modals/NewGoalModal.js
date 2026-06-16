import { Modal, View, Text, TextInput, Pressable, StyleSheet, Image, Platform } from "react-native";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { formatDate } from "../../utils/format";
import { pickImage, uploadGoalImage } from "../../services/ImageUtil";

export function NewGoalModal({ visible, onClose, onCreateGoal }) {
  // Stores the values of the form fields in state.
  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [datePickerValue, setDatePickerValue] = useState(new Date());
  const [imageUri, setImageUri] = useState(null);

  // Controls if the date picker is shown.
  const [showDatePicker, setShowDatePicker] = useState(false);

  async function createGoal() {
    // Removes extra spaces from the goal name.
    const cleanedName = goalName.trim();

    // Converts the target amount to a number.
    const targetNumber = Number(targetAmount);

    // Stops if the goal name is empty.
    if (cleanedName.length === 0) {
      alert("Please enter a goal name");
      return;
    }

    // Stops if the target amount is not valid.
    if (targetNumber <= 0) {
      alert("Please enter a valid target amount");
      return;
    }

    // Stops if no due date has been selected.
    if (!dueDate) {
      alert("Please select a due date");
      return;
    }

    try {
      // Uploads the image and gets its download URL.
      const imageUrl = await uploadGoalImage(imageUri);

      // Creates the goal object that will be saved.
      const newGoal = {
        completed: false,
        dueDate: dueDate,
        name: cleanedName,
        startDate: new Date(),
        target: targetNumber,
        imageUrl: imageUrl,
      };

      // Sends the new goal to the parent component.
      onCreateGoal(newGoal);

      // Clears the form fields.
      resetForm();

      // Closes the modal.
      onClose();
    } catch (error) {
      // Logs the error if the goal could not be created.
      console.error("Error creating goal:", error);

      // Shows an error message to the user.
      alert("An error occurred while creating the goal. Please try again.");
    }
  }

  // Resets all form values back to default.
  function resetForm() {
    setGoalName("");
    setTargetAmount("");
    setDueDate("");
    setDatePickerValue(new Date());
    setShowDatePicker(false);
    setImageUri(null);
  }

  // Closes the modal and clears the form.
  function closeModal() {
    resetForm();
    onClose();
  }

  // Handles date selection from the date picker.
  function handleDateChange(event, selectedDate) {
    // Hides the picker after choosing a date on Android.
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }

    // Updates the date if the user selected one.
    if (selectedDate) {
      setDatePickerValue(selectedDate);
      setDueDate(selectedDate);
    }
  }

  // Opens the image picker and saves the selected image uri.
  async function handlePickImage() {
    try {
      // Opens the image picker.
      const uri = await pickImage();

      // Stops if no image was selected.
      if (!uri) {
        return;
      }

      // Saves the selected image uri in state.
      setImageUri(uri);
    } catch (error) {
      // Logs the error if image selection fails.
      console.log("Could not pick image:", error);
    }
  }

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Closes the modal. */}
          <Pressable style={styles.closeButton} onPress={closeModal}>
            <Text style={styles.closeText}>×</Text>
          </Pressable>

          {/* Displays the modal title. */}
          <Text style={styles.title}>Create New Goal</Text>

          {/* Displays the modal subtitle. */}
          <Text style={styles.subtitle}>
            Set a savings goal to track your progress
          </Text>

          <View style={styles.form}>
            <View style={styles.fieldBlock}>
              {/* Displays the goal name label. */}
              <Text style={styles.label}>Goal name</Text>

              {/* Input for the goal name. */}
              <TextInput
                style={styles.input}
                placeholder="e.g., New laptop"
                placeholderTextColor="#8f8f99"
                value={goalName}
                onChangeText={setGoalName}
              />
            </View>

            <View style={styles.fieldBlock}>
              {/* Displays the target amount label. */}
              <Text style={styles.label}>Target amount</Text>

              {/* Input for the target amount. */}
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
              {/* Displays the due date label. */}
              <Text style={styles.label}>Due date</Text>

              {/* Opens the date picker. */}
              <Pressable
                style={styles.dateInput}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={dueDate ? styles.dateText : styles.placeholderText}>
                  {dueDate ? formatDate(dueDate) : "Select due date"}
                </Text>
              </Pressable>

              {/* Shows the date picker when needed. */}
              {showDatePicker && (
                <DateTimePicker
                  value={datePickerValue}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                />
              )}
            </View>

            {/* Displays the image label. */}
            <Text style={styles.label}>Goal image</Text>

            {/* Opens the image picker. */}
            <Pressable style={styles.imageButton} onPress={handlePickImage}>
              <Text style={styles.imageButtonText}>
                {imageUri ? "Change image" : "Choose image"}
              </Text>
            </Pressable>

            {/* Shows a preview of the selected image. */}
            {imageUri && (
              <Image source={{ uri: imageUri }} style={styles.imagePreview} />
            )}

            {/* Creates the goal. */}
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
  imageButton: {
    height: 46,
    backgroundColor: "#f1f1f4",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  imageButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111111",
  },

  imagePreview: {
    width: "100%",
    height: 160,
    borderRadius: 12,
    marginTop: 12,
  },

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
