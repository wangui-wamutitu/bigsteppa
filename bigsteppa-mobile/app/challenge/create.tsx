import { Button } from "@/components/Button";
import { DateTimePicker } from "@/components/DateTimePicker";
import { Input } from "@/components/Input";
import { colors } from "@/constants/colors";
import { useChallengeStore } from "@/store/challengeStore";
import { DurationUnit } from "@/types";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreateChallengeScreen() {
  const router = useRouter();
  const { createChallenge, isLoading } = useChallengeStore();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [durationValue, setDurationValue] = useState("");
  const [durationUnit, setDurationUnit] = useState<DurationUnit>(
    DurationUnit.Days
  );
  const [startDate, setStartDate] = useState(new Date());
  const [reminderTime, setReminderTime] = useState(new Date());

  const [errors, setErrors] = useState({
    name: "",
    durationValue: "",
    startDate: "",
    reminderTime: "",
  });

  const validateForm = () => {
    const newErrors = {
      name: "",
      durationValue: "",
      startDate: "",
      reminderTime: "",
    };

    let isValid = true;

    if (!name.trim()) {
      newErrors.name = "Challenge name is required";
      isValid = false;
    }

    if (!durationValue) {
      newErrors.durationValue = "Duration is required";
      isValid = false;
    } else if (parseInt(durationValue) <= 0) {
      newErrors.durationValue = "Duration must be greater than 0";
      isValid = false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDate = new Date(startDate);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      newErrors.startDate = "Start date must be today or later";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleCreateChallenge = async () => {
    if (validateForm()) {
      try {
        const formattedReminderTime = `${reminderTime
          .getHours()
          .toString()
          .padStart(2, "0")}:${reminderTime
          .getMinutes()
          .toString()
          .padStart(2, "0")}`;

        await createChallenge({
          name,
          description,
          durationValue: parseInt(durationValue),
          durationUnit,
          startDate: startDate.toISOString(),
          reminderTime: formattedReminderTime,
        });

        Alert.alert("Success", "Challenge created successfully!", [
          { text: "OK", onPress: () => router.push("/") },
        ]);
      } catch (error) {
        Alert.alert("Error", "Failed to create challenge. Please try again.");
      }
    }
  };

  const durationUnits = [
    { label: "Days", value: DurationUnit.Days },
    { label: "Weeks", value: DurationUnit.Weeks },
    { label: "Months", value: DurationUnit.Months },
    { label: "Years", value: DurationUnit.Years },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Create a New Challenge</Text>
          <Text style={styles.subtitle}>
            Set up your challenge details and start tracking your progress
          </Text>

          <View style={styles.form}>
            <Input
              label="Challenge Name"
              placeholder="Enter challenge name"
              value={name}
              onChangeText={setName}
              error={errors.name}
            />

            <Input
              label="Description (Optional)"
              placeholder="Describe your challenge"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              style={styles.textArea}
            />

            <View style={styles.durationContainer}>
              <View style={styles.durationValueContainer}>
                <Input
                  label="Duration"
                  placeholder="e.g. 30"
                  value={durationValue}
                  onChangeText={(text) =>
                    setDurationValue(text.replace(/[^0-9]/g, ""))
                  }
                  keyboardType="numeric"
                  error={errors.durationValue}
                />
              </View>

              <View style={styles.durationUnitContainer}>
                <Text style={styles.label}>Unit</Text>
                <View style={styles.unitButtonsContainer}>
                  {durationUnits.map((unit) => (
                    <Button
                      key={unit.value}
                      title={unit.label}
                      onPress={() => setDurationUnit(unit.value)}
                      variant={
                        durationUnit === unit.value ? "primary" : "outline"
                      }
                      size="small"
                      style={styles.unitButton}
                    />
                  ))}
                </View>
              </View>
            </View>

            <DateTimePicker
              label="Start Date"
              value={startDate}
              onChange={setStartDate}
              mode="date"
              minimumDate={new Date()}
              error={errors.startDate}
            />

            <DateTimePicker
              label="Daily Reminder Time"
              value={reminderTime}
              onChange={setReminderTime}
              mode="time"
              error={errors.reminderTime}
            />

            <View style={styles.buttonContainer}>
              <Button
                title="Cancel"
                onPress={() => router.back()}
                variant="outline"
                style={styles.cancelButton}
              />

              <Button
                title="Create Challenge"
                onPress={handleCreateChallenge}
                loading={isLoading}
                style={styles.createButton}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollContent: {
    padding: 24,
    paddingVertical: 55,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: 24,
  },
  form: {
    marginBottom: 24,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
    paddingTop: 12,
  },
  durationContainer: {
    flexDirection: "row",
    gap: 12,
  },
  durationValueContainer: {
    flex: 1,
  },
  durationUnitContainer: {
    flex: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text.secondary,
    marginBottom: 8,
  },
  unitButtonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  unitButton: {
    flex: 1,
    minWidth: 80,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
  },
  createButton: {
    flex: 2,
  },
});
