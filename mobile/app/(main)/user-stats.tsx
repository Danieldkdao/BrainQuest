import { View, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { usePuzzle } from "@/hooks/usePuzzle";
import StatsPage from "@/components/user-stats/stats";
import BadgesPage from "@/components/user-stats/badges";
import LeaderboardPage from "@/components/user-stats/leaderboard";
import MyPuzzlesPage from "@/components/user-stats/my-puzzles";
import TrainingHistoryPage from "@/components/user-stats/training-history";
import { tabs } from "@/utils/utils";

const UserStatsPage = () => {
  const { colors } = useTheme();
  const { selectedTab, changeSelectedTab } = usePuzzle();

  const tabPages = [
    <StatsPage />,
    <BadgesPage />,
    <LeaderboardPage />,
    <MyPuzzlesPage />,
    <TrainingHistoryPage />,
  ]

  return (
    <View
      className="w-full h-full items-center justify-start"
      style={{ backgroundColor: colors.bg }}
    >
      <ScrollView
        contentContainerClassName="items-center justify-center"
        className="w-full"
      >
        <View className="flex-row items-center justify-between mb-8 w-[90%]">
          {tabs.map((item) => {
            const isSelected = selectedTab === item.id;
            return (
              <TouchableOpacity
                onPress={() => changeSelectedTab(item.id)}
                key={item.id}
                className="flex flex-row items-center gap-3 rounded-xl p-4"
                style={{
                  backgroundColor: isSelected ? colors.text : "transparent",
                }}
              >
                <Ionicons
                  name={item.icon}
                  color={isSelected ? colors.surface : colors.text}
                  size={32}
                />
              </TouchableOpacity>
            );
          })}
        </View>
        {tabPages[selectedTab - 1]}
      </ScrollView>
    </View>
  );
};

export default UserStatsPage;
