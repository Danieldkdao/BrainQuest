import {
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { ReactNode, useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import StatsPage from "@/components/user-stats/stats";
import BadgesPage from "@/components/user-stats/badges";
import LeaderboardPage from "@/components/user-stats/leaderboard";
import TrainingHistoryPage from "@/components/user-stats/training-history";
import MyPuzzlesPage from "@/components/user-stats/my-puzzles";

type TAB = {
  id: number;
  icon: keyof typeof Ionicons.glyphMap;
  page: ReactNode;
};

const ChartsPage = () => {
  const TABS: TAB[] = [
    {
      id: 1,
      icon: "bar-chart",
      page: <StatsPage />,
    },
    {
      id: 2,
      icon: "medal",
      page: <BadgesPage />,
    },
    {
      id: 3,
      icon: "podium",
      page: <LeaderboardPage />,
    },
    {
      id: 4,
      icon: "extension-puzzle",
      page: <MyPuzzlesPage />,
    },
    {
      id: 5,
      icon: "barbell",
      page: <TrainingHistoryPage />,
    },
  ];

  const { colors } = useTheme();

  const [selectedTab, setSelectedTab] = useState<TAB>(TABS[0]);

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
          {TABS.map((item) => {
            const isSelected = selectedTab.id === item.id;
            return (
              <TouchableOpacity
                onPress={() => setSelectedTab(item)}
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
        {selectedTab.page}
      </ScrollView>
    </View>
  );
};

export default ChartsPage;
