import { View, Text, ScrollView } from "react-native";
import React, { useEffect } from "react";
import { useTheme } from "@/hooks/useTheme";
import LeaderboardUserRow from "./leaderboard-user-row";
import { useAppUser } from "@/hooks/useAppUser";
import { LinearGradient } from "expo-linear-gradient";

const LeaderboardPage = () => {
  const { colors } = useTheme();
  const {fetchLeaderboardUsers, leaderboardUsers} = useAppUser();

  useEffect(() => {
    fetchLeaderboardUsers();
  }, []);

  return (
    <View
      className="w-full items-center justify-center"
      style={{ backgroundColor: colors.bg }}
    >
      <ScrollView
        contentContainerClassName="items-start justify-center pb-10"
        className="w-[90%]"
      >
        <Text
          className="text-3xl font-bold mb-5"
          style={{ color: colors.text }}
        >
          Leaderboard
        </Text>
        <View className="rounded-xl overflow-hidden">
          <LinearGradient
            colors={colors.gradients.empty}
            className="w-full"
            style={{ backgroundColor: colors.surface }}
          >
            <View
              className="w-full flex-row border-2 border-b-0 rounded-t-xl py-5 px-7 gap-2"
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
              className="w-full border-2 rounded-b-xl pt-5 pb-5 gap-1 px-3"
              style={{ borderColor: colors.border }}
            >
              {leaderboardUsers.map((item, index) => {
                return (
                  <LeaderboardUserRow
                    key={index}
                    rank={index + 1}
                    userId={item.userId}
                    name={item.name}
                    points={item.points}
                    puzzles={item.puzzles}
                  />
                );
              })}
            </View>
          </LinearGradient>
        </View>
      </ScrollView>
    </View>
  );
};

export default LeaderboardPage;
