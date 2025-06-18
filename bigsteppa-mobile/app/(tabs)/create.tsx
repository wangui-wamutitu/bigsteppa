import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { colors } from "@/constants/colors";
import { useChallengeStore } from "@/store/challengeStore";
import { DurationUnit } from "@/types";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { Calendar, Clock } from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
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
  const [showPicker, setShowPicker] = useState(false);
  const [mode, setMode] = useState<"Date" | "Time">("Date");
  const [showUnitsDropdown, setShowUnitsDropdown] = useState(false);

  const formattedReminderTime = `${reminderTime.getHours().toString().padStart(2, '0')}:${reminderTime.getMinutes().toString().padStart(2, '0')}`;

  const [errors, setErrors] = useState({
    name: "",
    durationValue: "",
    startDate: "",
    reminderTime: "",
  });

  const today = new Date();

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

  function handleDateAndTime(
    event: DateTimePickerEvent,
    date?: Date | undefined
  ) {
    if (event.type === "set") {
      if(mode === 'Date'){
        date && setStartDate(date);
      }
      if(mode === 'Time'){
        date && setReminderTime(date);
      }
      if (Platform.OS === "android") {
        setShowPicker(!showPicker);
      }
    } else {
      setShowPicker(!showPicker);
    }
  }


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
                <View>
                  <Text style={styles.label}>Units</Text>
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor: colors.border,
                      borderRadius: 12,
                      marginBottom: 20,
                    }}
                  >
                    <Picker
                      selectedValue={durationUnit}
                      onValueChange={(itemValue, itemIndex) =>
                        setDurationUnit(itemValue)
                      }
                      mode="dialog"
                    >
                      {durationUnits.map((unit, index) => (
                        <Picker.Item
                          key={index}
                          label={unit.label}
                          value={unit.value}
                        />
                      ))}
                    </Picker>
                  </View>
                </View>
              </View>
            </View>
            <Text style={styles.startDateTitle}>Start Date</Text>
            <TouchableOpacity
              style={[styles.input]}
              onPress={() => {
                setShowPicker(!showPicker)
                setMode('Date')
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.inputText}>{startDate.toDateString()}</Text>
              <Calendar size={20} color={colors.text.tertiary} />
            </TouchableOpacity>
            {showPicker && mode === "Date" ? (
              <>
                <DateTimePicker
                  value={startDate}
                  onChange={handleDateAndTime}
                  mode="date"
                  display={Platform.OS === "ios" ? "inline" : "default"}
                  minimumDate={new Date()}
                />
                {Platform.OS === "ios" ? (
                  <View
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "flex-end",
                      paddingRight: 20,
                    }}
                  >
                    <Button
                      title="Select"
                      onPress={() => setShowPicker(false)}
                      loading={isLoading}
                      size="small"
                      variant="outline"
                    />
                  </View>
                ) : null}
              </>
            ) : null}

            <Text style={styles.startDateTitle}>Reminder Time</Text>
            <TouchableOpacity
              style={[styles.input]}
              onPress={() => {
                setShowPicker(!showPicker)
                setMode('Time')
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.inputText}>
                {formattedReminderTime}
              </Text>
              <Clock size={20} color={colors.text.tertiary} />
            </TouchableOpacity>

            {showPicker && mode === "Time" ? (
              <>
                <DateTimePicker
                  value={reminderTime}
                  onChange={handleDateAndTime}
                  mode="time"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                />
                {Platform.OS === "ios" ? (
                  <View
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "flex-end",
                      paddingRight: 20,
                    }}
                  >
                    <Button
                      title="Select"
                      onPress={() => setShowPicker(false)}
                      loading={isLoading}
                      size="small"
                      variant="outline"
                    />
                  </View>
                ) : null}
              </>
            ) : null}

            <Button
              title="Create Challenge"
              onPress={handleCreateChallenge}
              loading={isLoading}
              style={styles.createButton}
            />
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
    paddingBottom: 40,
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
    width: "100%",
    height: 100,
    textAlignVertical: "top",
    padding: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
  },
  durationContainer: {
    // flexDirection: "row",
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
  createButton: {
    marginTop: 24,
  },
  inputText: {
    fontSize: 16,
    color: colors.text.primary,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.background.primary,
    marginBottom: 20,
  },
  inputError: {
    borderColor: colors.status.error,
  },
  startDateTitle: {
    fontSize: 16,
    color: colors.text.primary,
    marginBottom: 16,
  },
});
