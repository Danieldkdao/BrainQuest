import { View, Text, ScrollView } from "react-native";
import React from "react";
import { useTheme } from "@/hooks/useTheme";

const LeaderboardPage = () => {
  const { colors } = useTheme();

  return (
    <View
      className="w-full items-center justify-center"
      style={{ backgroundColor: colors.bg }}
    >
      <ScrollView
        contentContainerClassName="items-start justify-center"
        className="w-[90%]"
      >
        <Text
          className="text-3xl font-bold mb-5"
          style={{ color: colors.text }}
        >
          Leaderboard
        </Text>
        <View className="w-full" style={{ backgroundColor: colors.surface }}>
          <View
            className="w-full flex-row border-2 border-b-0 rounded-t-xl p-5 gap-2"
            style={{ borderColor: colors.border }}
          >
            <View className="flex-1">
              <Text className="font-bold" style={{ color: colors.text }}>
                Rank
              </Text>
            </View>
            <View className="flex-[1.8]">
              <Text className="font-bold" style={{ color: colors.text }}>
                Name
              </Text>
            </View>
            <View className="flex-1">
              <Text className="font-bold" style={{ color: colors.text }}>
                Points
              </Text>
            </View>
            <View className="flex-1">
              <Text className="font-bold" style={{ color: colors.text }}>
                Exercises
              </Text>
            </View>
          </View>
          <View
            className="w-full flex-row border-2 rounded-b-xl pt-5 pb-5"
            style={{ borderColor: colors.border }}
          >
            <View className="flex-row px-5 items-center w-full gap-2">
              <View className="flex-1">
                <Text
                  className="text-xl font-medium"
                  style={{ color: colors.text }}
                >
                  1
                </Text>
              </View>
              <View className="flex-[1.8]">
                <Text
                  className="text-xl font-medium"
                  style={{ color: colors.text }}
                >
                  Daniel Dao
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-xl" style={{ color: colors.text }}>
                  95
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-xl" style={{ color: colors.text }}>
                  48
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default LeaderboardPage;
