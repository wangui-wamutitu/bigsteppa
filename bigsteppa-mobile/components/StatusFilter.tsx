import { colors } from "@/constants/colors";
import { ChallengeStatus } from "@/types";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface StatusFilterProps {
  currentFilter: ChallengeStatus | "All";
  onFilterChange: (filter: ChallengeStatus | "All") => void;
}

const filters: Array<{ value: ChallengeStatus | "All"; label: string }> = [
  { value: "All", label: "All" },
  { value: ChallengeStatus.Ongoing, label: "In Progress" },
  { value: ChallengeStatus.SetToHappen, label: "Upcoming" },
  { value: ChallengeStatus.Stalled, label: "Paused" },
  { value: ChallengeStatus.Completed, label: "Completed" },
];

export const StatusFilter: React.FC<StatusFilterProps> = ({
  currentFilter,
  onFilterChange,
}) => {
  return (
    <View style={styles.wrapper}>
      <FlatList
        horizontal
        data={filters}
        keyExtractor={(item) => item.value}
        contentContainerStyle={styles.container}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.filterItem,
              currentFilter === item.value && styles.activeFilterItem,
            ]}
            onPress={() => onFilterChange(item.value)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.filterText,
                currentFilter === item.value && styles.activeFilterText,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    height: 60,
    backgroundColor: colors.background.tertiary,
  },
  container: {
    paddingHorizontal: 16,
    alignItems: "center",
    gap: 8,
  },
  filterItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background.secondary,
  },
  activeFilterItem: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text.secondary,
  },
  activeFilterText: {
    color: colors.white,
  },
});
