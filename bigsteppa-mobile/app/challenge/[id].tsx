import { Button } from "@/components/Button";
import { colors } from "@/constants/colors";
import { useChallengeStore } from "@/store/challengeStore";
import { ChallengeStatus } from "@/types";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
    AlertCircle,
    Calendar,
    Clock,
    Edit,
    Pause,
    Play,
    RefreshCw,
    Trash2,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChallengeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const {
    getChallenge,
    pauseChallenge,
    resumeChallenge,
    restartChallenge,
    deleteChallenge,
    isLoading,
  } = useChallengeStore();

  const [challenge, setChallenge] = useState(getChallenge(id));

  useEffect(() => {
    if (!challenge) {
      Alert.alert("Error", "Challenge not found", [
        { text: "OK", onPress: () => router.back() },
      ]);
    }
  }, [challenge, router]);

  useEffect(() => {
    // Update challenge when store changes
    setChallenge(getChallenge(id));
  }, [getChallenge, id]);

  if (!challenge) {
    return null;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusText = (status: ChallengeStatus) => {
    switch (status) {
      case ChallengeStatus.SetToHappen:
        return "Upcoming";
      case ChallengeStatus.Ongoing:
        return "In Progress";
      case ChallengeStatus.Completed:
        return "Completed";
      case ChallengeStatus.Stalled:
        return "Paused";
      default:
        return "Unknown";
    }
  };

  const getStatusColor = (status: ChallengeStatus) => {
    switch (status) {
      case ChallengeStatus.SetToHappen:
        return colors.status.upcoming;
      case ChallengeStatus.Ongoing:
        return colors.status.info;
      case ChallengeStatus.Completed:
        return colors.status.success;
      case ChallengeStatus.Stalled:
        return colors.status.paused;
      default:
        return colors.text.tertiary;
    }
  };

  const handlePauseChallenge = async () => {
    try {
      await pauseChallenge(challenge.id);
      Alert.alert("Success", "Challenge paused successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to pause challenge");
    }
  };

  const handleResumeChallenge = async () => {
    try {
      await resumeChallenge(challenge.id);
      Alert.alert("Success", "Challenge resumed successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to resume challenge");
    }
  };

  const handleRestartChallenge = async () => {
    Alert.alert(
      "Restart Challenge",
      "Are you sure you want to restart this challenge? This will reset your progress.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Restart",
          onPress: async () => {
            try {
              await restartChallenge(challenge.id);
              Alert.alert("Success", "Challenge restarted successfully");
            } catch (error) {
              Alert.alert("Error", "Failed to restart challenge");
            }
          },
        },
      ]
    );
  };

  const handleDeleteChallenge = async () => {
    Alert.alert(
      "Delete Challenge",
      "Are you sure you want to delete this challenge? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteChallenge(challenge.id);
              router.back();
            } catch (error) {
              Alert.alert("Error", "Failed to delete challenge");
            }
          },
        },
      ]
    );
  };

  const handleEditChallenge = () => {
    router.push(`/challenge/edit/${challenge.id}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>{challenge.name}</Text>

          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(challenge.status) },
            ]}
          >
            <Text style={styles.statusText}>
              {getStatusText(challenge.status)}
            </Text>
          </View>
        </View>

        {challenge.description && (
          <View style={styles.section}>
            <Text style={styles.description}>{challenge.description}</Text>
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.infoItem}>
            <Calendar size={20} color={colors.text.secondary} />
            <Text style={styles.infoLabel}>Start Date:</Text>
            <Text style={styles.infoValue}>
              {formatDate(challenge.startDate)}
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Clock size={20} color={colors.text.secondary} />
            <Text style={styles.infoLabel}>Duration:</Text>
            <Text style={styles.infoValue}>
              {challenge.durationValue} {challenge.durationUnit.toLowerCase()}
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Clock size={20} color={colors.text.secondary} />
            <Text style={styles.infoLabel}>Daily Reminder:</Text>
            <Text style={styles.infoValue}>{challenge.reminderTime}</Text>
          </View>

          {challenge.isPaused && (
            <View style={styles.infoItem}>
              <AlertCircle size={20} color={colors.status.paused} />
              <Text style={styles.infoLabel}>Status:</Text>
              <Text style={[styles.infoValue, { color: colors.status.paused }]}>
                Paused
              </Text>
            </View>
          )}
        </View>

        <View style={styles.actionsContainer}>
          <Button
            title="Edit"
            onPress={handleEditChallenge}
            variant="outline"
            icon={
              <Edit
                size={18}
                color={colors.primary}
                style={{ marginRight: 8 }}
              />
            }
            style={styles.actionButton}
          />

          {challenge.status === ChallengeStatus.Ongoing &&
          !challenge.isPaused ? (
            <Button
              title="Pause"
              onPress={handlePauseChallenge}
              variant="outline"
              icon={
                <Pause
                  size={18}
                  color={colors.primary}
                  style={{ marginRight: 8 }}
                />
              }
              style={styles.actionButton}
              loading={isLoading}
            />
          ) : challenge.status === ChallengeStatus.Stalled ? (
            <Button
              title="Resume"
              onPress={handleResumeChallenge}
              variant="outline"
              icon={
                <Play
                  size={18}
                  color={colors.primary}
                  style={{ marginRight: 8 }}
                />
              }
              style={styles.actionButton}
              loading={isLoading}
            />
          ) : null}

          <Button
            title="Restart"
            onPress={handleRestartChallenge}
            variant="outline"
            icon={
              <RefreshCw
                size={18}
                color={colors.primary}
                style={{ marginRight: 8 }}
              />
            }
            style={styles.actionButton}
            loading={isLoading}
          />
        </View>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeleteChallenge}
        >
          <Trash2 size={20} color={colors.status.error} />
          <Text style={styles.deleteButtonText}>Delete Challenge</Text>
        </TouchableOpacity>
      </ScrollView>
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
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 12,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "500",
  },
  section: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: colors.background.tertiary,
    borderRadius: 12,
  },
  description: {
    fontSize: 16,
    color: colors.text.secondary,
    lineHeight: 24,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text.secondary,
    marginLeft: 8,
    marginRight: 8,
  },
  infoValue: {
    fontSize: 16,
    color: colors.text.primary,
  },
  actionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    minWidth: "45%",
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderWidth: 1,
    borderColor: colors.status.error,
    borderRadius: 12,
    marginTop: 8,
  },
  deleteButtonText: {
    color: colors.status.error,
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
});
