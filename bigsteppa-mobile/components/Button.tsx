import { colors } from "@/constants/colors";
import React from "react";
import {
    ActivityIndicator,
    StyleProp,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    ViewStyle,
} from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "text";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
}) => {
  const getButtonStyle = (): StyleProp<ViewStyle> => {
    const baseStyle: ViewStyle[] = [styles.button, styles[size]];

    if (variant === "primary") baseStyle.push(styles.primaryButton);
    else if (variant === "secondary") baseStyle.push(styles.secondaryButton);
    else if (variant === "outline") baseStyle.push(styles.outlineButton);
    else if (variant === "text") baseStyle.push(styles.textButton);

    if (disabled) baseStyle.push(styles.disabledButton);

    return baseStyle;
  };

  const getTextStyle = (): StyleProp<TextStyle> => {
    const baseStyle: TextStyle[] = [styles.buttonText];

    if (variant === "primary") baseStyle.push(styles.primaryButtonText);
    else if (variant === "secondary")
      baseStyle.push(styles.secondaryButtonText);
    else if (variant === "outline") baseStyle.push(styles.outlineButtonText);
    else if (variant === "text") baseStyle.push(styles.textButtonText);

    if (disabled) baseStyle.push(styles.disabledButtonText);

    if (size === "small") baseStyle.push(styles.smallButtonText);
    else if (size === "large") baseStyle.push(styles.largeButtonText);

    return baseStyle;
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "primary" ? colors.white : colors.primary}
          size="small"
        />
      ) : (
        <>
          {icon}
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: 16,
  },
  small: {
    height: 36,
  },
  medium: {
    height: 48,
  },
  large: {
    height: 56,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.secondary,
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.primary,
  },
  textButton: {
    backgroundColor: "transparent",
    paddingHorizontal: 0,
  },
  disabledButton: {
    backgroundColor: colors.background.tertiary,
    borderColor: colors.border,
  },
  buttonText: {
    fontWeight: "600",
    textAlign: "center",
    marginLeft: 4,
  },
  primaryButtonText: {
    color: colors.white,
  },
  secondaryButtonText: {
    color: colors.text.primary,
  },
  outlineButtonText: {
    color: colors.primary,
  },
  textButtonText: {
    color: colors.primary,
  },
  disabledButtonText: {
    color: colors.text.tertiary,
  },
  smallButtonText: {
    fontSize: 14,
  },
  largeButtonText: {
    fontSize: 18,
  },
});
