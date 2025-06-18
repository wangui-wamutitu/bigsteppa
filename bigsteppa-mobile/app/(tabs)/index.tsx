import { ChallengeCard } from "@/components/ChallengeCard";
import { EmptyState } from "@/components/EmptyState";
import { StatusFilter } from "@/components/StatusFilter";
import { colors } from "@/constants/colors";
import { useChallengeStore } from "@/store/challengeStore";
import { ChallengeStatus } from "@/types";
import { useRouter } from "expo-router";
import { RefreshCw } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();
  const {
    challenges,
    filteredChallenges,
    currentFilter,
    isLoading,
    error,
    fetchChallenges,
    filterChallenges,
  } = useChallengeStore();

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchChallenges();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchChallenges();
    setRefreshing(false);
  };

  const handleFilterChange = (filter: ChallengeStatus | "All") => {
    filterChallenges(filter);
  };

  const navigateToCreateChallenge = () => {
    router.push("/challenge/create");
  };

  if (isLoading && !refreshing && challenges.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <StatusFilter
        currentFilter={currentFilter}
        onFilterChange={handleFilterChange}
      />

      {filteredChallenges.length === 0 ? (
        <EmptyState
          title={
            currentFilter === "All"
              ? "You don't have any challenges yet"
              : `No ${currentFilter.toLowerCase()} challenges`
          }
          description={
            currentFilter === "All"
              ? "Create your first challenge to start tracking your progress"
              : `Try a different filter or create a new challenge`
          }
          buttonTitle="Create Challenge"
          onButtonPress={navigateToCreateChallenge}
          icon={<RefreshCw size={48} color={colors.text.tertiary} />}
        />
      ) : (
        <FlatList
          data={filteredChallenges}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ChallengeCard challenge={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background.secondary,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  // fabContainer: {
  //   position: "absolute",
  //   bottom: 24,
  //   right: 24,
  // },
  // fab: {
  //   borderRadius: 30,
  //   paddingHorizontal: 20,
  //   shadowColor: colors.shadow,
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.3,
  //   shadowRadius: 4,
  //   elevation: 5,
  // },
});
