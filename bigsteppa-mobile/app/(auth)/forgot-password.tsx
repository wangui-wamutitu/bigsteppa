import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { colors } from "@/constants/colors";
import { authAPI } from "@/utils/api";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft } from "lucide-react-native";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ForgotPasswordScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const validateEmail = () => {
    if (!email) {
      setError("Email is required");
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Email is invalid");
      return false;
    }
    return true;
  };

  const handleResetPassword = async () => {
    setError("");

    if (validateEmail()) {
      setIsLoading(true);

      try {
        await authAPI.resetPassword(email);
        setEmailSent(true);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to send reset email"
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  const navigateBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity style={styles.backButton} onPress={navigateBack}>
            <ArrowLeft size={24} color={colors.text.primary} />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>
              {emailSent
                ? "We've sent you an email with instructions to reset your password."
                : "Enter your email and we'll send you instructions to reset your password."}
            </Text>
          </View>

          {!emailSent ? (
            <View style={styles.form}>
              <Input
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                error={error}
              />

              <Button
                title="Send Reset Link"
                onPress={handleResetPassword}
                loading={isLoading}
                style={styles.resetButton}
              />
            </View>
          ) : (
            <View style={styles.successContainer}>
              <Button
                title="Back to Login"
                onPress={() => router.push("/login")}
                style={styles.backToLoginButton}
              />

              <TouchableOpacity
                onPress={handleResetPassword}
                style={styles.resendContainer}
              >
                <Text style={styles.resendText}>
                  Didn't receive the email? Resend
                </Text>
              </TouchableOpacity>
            </View>
          )}
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
    flexGrow: 1,
    padding: 24,
  },
  backButton: {
    marginBottom: 24,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    lineHeight: 24,
  },
  form: {
    marginBottom: 24,
  },
  resetButton: {
    marginTop: 16,
  },
  successContainer: {
    marginTop: 24,
  },
  backToLoginButton: {
    marginBottom: 16,
  },
  resendContainer: {
    alignItems: "center",
    marginTop: 16,
  },
  resendText: {
    color: colors.primary,
    fontSize: 14,
  },
});
