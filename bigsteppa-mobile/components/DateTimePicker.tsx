import { colors } from "@/constants/colors";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle
} from "react-native";

interface DateTimePickerProps {
  label?: string;
  value: Date;
  onChange: (date: Date) => void;
  mode: "date" | "time";
  minimumDate?: Date;
  maximumDate?: Date;
  error?: string;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
  setIsPickerVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isPickerVisible: boolean;
}

export const DateTimePickerComponent: React.FC<DateTimePickerProps> = ({
  label,
  value,
  onChange,
  mode,
  minimumDate,
  maximumDate,
  error,
  containerStyle,
  labelStyle,
  errorStyle,
  isPickerVisible,
  setIsPickerVisible,
}) => {
  const [tempDate, setTempDate] = useState(value);

  const showPicker = () => {
    setTempDate(value);
    setIsPickerVisible(true);
  };

  const hidePicker = () => {
    setIsPickerVisible(false);
  };

  const confirmDate = () => {
    onChange(tempDate);
    hidePicker();
  };

  const formatDate = (date: Date) => {
    if (mode === "date") {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } else {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Modal visible={isPickerVisible} transparent animationType="slide">
        <View style={styles.pickerPlaceholder}>
          <DateTimePicker
            value={value}
            mode={mode}
            onChange={onChange}
            minimumDate={minimumDate}
            maximumDate={maximumDate}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text.secondary,
    marginBottom: 8,
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
  },
  inputError: {
    borderColor: colors.status.error,
  },
  inputText: {
    fontSize: 16,
    color: colors.text.primary,
  },
  errorText: {
    color: colors.status.error,
    fontSize: 14,
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  pickerContainer: {
    backgroundColor: colors.background.primary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 16,
    textAlign: "center",
  },
  pickerPlaceholder: {
    height: 200,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  button: {
    flex: 1,
  },
});
