import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Modal,
} from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Progress from "react-native-progress";
import { LinearGradient } from "expo-linear-gradient";
import useApi from "@/utils/api";
import { Response } from "@/utils/types";
import { useAppUser } from "@/hooks/useAppUser";
import { usePuzzle } from "@/hooks/usePuzzle";
import { tabs } from "@/utils/utils";
import LeaderboardUserRow from "@/components/user-stats/leaderboard-user-row";

const Home = () => {
  const api = useApi();
  const { user } = useUser();
  const router = useRouter();
  const { colors } = useTheme();
  const { fetchUserSettings, userSettings, leaderboardUsers } = useAppUser();
  const { changeSelectedTab } = usePuzzle();

  const [openDailyExercise, setOpenDailyExercise] = useState(false);

  const screenWidth = Dimensions.get("window").width;

  useEffect(() => {
    const wait = async () => {
      await addUserToDB();
      await fetchUserSettings();
    };
    wait();
  }, []);

  const addUserToDB = async () => {
    try {
      const response = await api.post<Response>("/users/add-user-db", {
        name: user?.fullName,
      });
      if (response.data.success) {
        console.log(response.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const navToLeaderboard = () => {
    router.push("/(main)/user-stats");
    changeSelectedTab(tabs[2].id);
  };

  return (
    <View
      className="w-full h-full items-center justify-start"
      style={{ backgroundColor: colors.bg }}
    >
      <ScrollView contentContainerClassName="gap-4 pb-10" className="w-[90%]">
        <View className="items-center gap-4">
          <Image
            source={{ uri: user?.imageUrl }}
            className="size-24 rounded-full"
          />
          <Text className="text-3xl font-bold" style={{ color: colors.text }}>
            Good Morning, {user?.firstName}!
          </Text>
          <Text className="text-3xl font-bold" style={{ color: colors.text }}>
            Ready to train your brain?
          </Text>
        </View>
        <View className="gap-4">
          <View className="flex-row w-full gap-4">
            <View className="flex-1 rounded-xl overflow-hidden">
              <LinearGradient
                colors={colors.gradients.empty}
                className="items-center gap-1 p-4"
              >
                <Ionicons name="flame" size={50} color={colors.danger} />
                <Text
                  className="text-3xl font-bold"
                  style={{ color: colors.text }}
                >
                  30
                </Text>
                <Text className="text-xl" style={{ color: colors.text }}>
                  Day Streak
                </Text>
              </LinearGradient>
            </View>
            <View className="flex-1 rounded-xl overflow-hidden">
              <LinearGradient
                colors={colors.gradients.empty}
                className="items-center gap-1 p-4"
              >
                <Ionicons
                  name="extension-puzzle"
                  size={50}
                  color={colors.primary}
                />
                <Text
                  className="text-3xl font-bold"
                  style={{ color: colors.text }}
                >
                  Level 1
                </Text>
                <Text className="text-xl" style={{ color: colors.text }}>
                  Puzzle Novice
                </Text>
              </LinearGradient>
            </View>
          </View>
          <View className="gap-2">
            <Text className="text-xl font-bold" style={{ color: colors.text }}>
              Today's Goal Progress
            </Text>
            <View className="flex-row items-center justify-between">
              <Text
                className="text-xl font-bold"
                style={{ color: colors.textMuted }}
              >
                Puzzles
              </Text>
              <Text
                className="text-xl font-bold"
                style={{ color: colors.text }}
              >
                {userSettings?.todayPuzzles ? userSettings.todayPuzzles : 0}/
                {userSettings?.puzzleGoal ? userSettings.puzzleGoal : 0}
              </Text>
            </View>
            <Progress.Bar
              progress={
                userSettings?.todayPuzzles && userSettings?.puzzleGoal
                  ? userSettings.todayPuzzles / userSettings.puzzleGoal
                  : 0
              }
              color={colors.gradients.muted[0]}
              unfilledColor={colors.gradients.empty[1]}
              width={screenWidth * 0.9}
              height={20}
              borderRadius={9999}
              borderWidth={0}
            />
            <View className="flex-row items-center justify-between">
              <Text
                className="text-xl font-bold"
                style={{ color: colors.textMuted }}
              >
                Points
              </Text>
              <Text
                className="text-xl font-bold"
                style={{ color: colors.text }}
              >
                {userSettings?.todayPoints ? userSettings.todayPoints : 0}/
                {userSettings?.pointsGoal ? userSettings.pointsGoal : 0}
              </Text>
            </View>
            <Progress.Bar
              progress={
                userSettings?.todayPoints && userSettings?.pointsGoal
                  ? userSettings.todayPoints / userSettings.pointsGoal
                  : 0
              }
              color={colors.gradients.muted[0]}
              unfilledColor={colors.gradients.empty[1]}
              width={screenWidth * 0.9}
              height={20}
              borderRadius={9999}
              borderWidth={0}
            />
          </View>
        </View>
        <Modal visible={openDailyExercise} animationType="slide">
          <View className="p-5 h-full" style={{ backgroundColor: colors.bg }}>
            <View className="w-full flex-row items-center justify-between">
              <Text
                className="text-3xl font-bold"
                style={{ color: colors.text }}
              >
                Daily Puzzle
              </Text>
              <TouchableOpacity onPress={() => setOpenDailyExercise(false)}>
                <Ionicons name="close-circle" color={colors.text} size={48} />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <View className="gap-2">
          <Text className="text-xl font-bold" style={{ color: colors.text }}>
            Daily Puzzle
          </Text>
          <TouchableOpacity
            onPress={() => setOpenDailyExercise(true)}
            className="rounded-xl overflow-hidden"
            style={{
              backgroundColor: colors.surface,
              borderBottomColor: colors.primary,
            }}
          >
            <LinearGradient
              colors={colors.gradients.empty}
              className="flex-row items-center justify-center gap-2 w-full py-3"
            >
              <Text
                className="text-xl font-medium"
                style={{ color: colors.text }}
              >
                Start Now
              </Text>
              <Ionicons name="arrow-forward" color={colors.text} size={20} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <View className="gap-2">
          <Text className="text-xl font-bold" style={{ color: colors.text }}>
            Leaderboard
          </Text>
          <View className="rounded-xl overflow-hidden">
            <LinearGradient
              colors={colors.gradients.empty}
              className="items-center gap-2 p-4"
            >
              <Ionicons name="trophy" size={50} color="#FFD700" />
              <View className="gap-1">
                {leaderboardUsers.map((item, index) => {
                  if (index === 3) return;
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
              <View
                className="border-2 w-full"
                style={{
                  backgroundColor: colors.textMuted,
                  borderColor: colors.textMuted,
                }}
              ></View>
              {leaderboardUsers.find(
                (item, index) =>
                  index < 3 && item.userId === userSettings?.userId
              ) ? (
                <></>
              ) : (
                <LeaderboardUserRow
                  userId={userSettings?.userId ? userSettings.userId : ""}
                  name={userSettings?.name ? userSettings.name : ""}
                  points={userSettings?.points ? userSettings.points : 0}
                  puzzles={userSettings?.puzzles ? userSettings.puzzles : 0}
                  rank={
                    leaderboardUsers.findIndex(
                      (item) => item.userId === userSettings?.userId
                    ) + 1
                  }
                />
              )}
              <TouchableOpacity
                onPress={navToLeaderboard}
                className="w-full rounded-lg overflow-hidden mt-2"
              >
                <LinearGradient
                  colors={colors.gradients.primary}
                  className="p-2"
                >
                  <Text className="text-center text-xl font-medium text-white">
                    Head to leaderboard
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Home;
