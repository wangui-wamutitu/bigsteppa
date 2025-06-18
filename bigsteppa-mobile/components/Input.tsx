import { colors } from "@/constants/colors";
import { Eye, EyeOff } from "lucide-react-native";
import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  inputStyle?: ViewStyle;
  errorStyle?: TextStyle;
  secureTextEntry?: boolean;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  labelStyle,
  inputStyle,
  errorStyle,
  secureTextEntry,
  rightIcon,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, error ? styles.inputError : null, inputStyle]}
          placeholderTextColor={colors.text.tertiary}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          {...props}
        />

        {secureTextEntry && (
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={togglePasswordVisibility}
          >
            {isPasswordVisible ? (
              <EyeOff size={20} color={colors.text.tertiary} />
            ) : (
              <Eye size={20} color={colors.text.tertiary} />
            )}
          </TouchableOpacity>
        )}

        {rightIcon && <View style={styles.iconContainer}>{rightIcon}</View>}
      </View>

      {error && <Text style={[styles.errorText, errorStyle]}>{error}</Text>}
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.text.primary,
    backgroundColor: colors.background.primary,
    flex: 1,
  },
  inputError: {
    borderColor: colors.status.error,
  },
  iconContainer: {
    position: "absolute",
    right: 16,
  },
  errorText: {
    color: colors.status.error,
    fontSize: 14,
    marginTop: 4,
  },
});
