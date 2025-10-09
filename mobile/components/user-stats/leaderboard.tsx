import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import { useTheme } from "@/hooks/useTheme";
import LeaderboardUserRow from "./leaderboard-user-row";
import { useAppUser } from "@/hooks/useAppUser";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const LeaderboardPage = () => {
  const { colors } = useTheme();
  const { fetchLeaderboardUsers, leaderboardUsers, userSettings } =
    useAppUser();
  const router = useRouter();

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
        {userSettings?.enableLeaderboard && (
          <Text
            className="text-3xl font-bold mb-5"
            style={{ color: colors.text }}
          >
            Leaderboard
          </Text>
        )}
        {userSettings?.enableLeaderboard ? (
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
        ) : (
          <View className="rounded-xl overflow-hidden">
            <LinearGradient
              className="gap-2 p-4 items-center"
              colors={colors.gradients.empty}
            >
              <Ionicons name="trophy" size={50} color={colors.textMuted} />
              <Text
                className="text-xl font-bold"
                style={{ color: colors.text }}
              >
                Leaderboard Disabled
              </Text>
              <Text className="text-center" style={{ color: colors.textMuted }}>
                You have disabled the leaderboard. This means that you won't be
                on the leaderboard and you will not be able to see the
                leaderboard. To enable, go to user settings.
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/(main)/user-profile")}
                className="w-full rounded-lg overflow-hidden mt-2"
              >
                <LinearGradient
                  colors={colors.gradients.primary}
                  className="p-2"
                >
                  <Text className="text-center text-xl font-medium text-white">
                    Head to settings
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default LeaderboardPage;
