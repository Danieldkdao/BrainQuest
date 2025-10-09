import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Modal,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { type Href, useRouter } from "expo-router";
import * as Progress from "react-native-progress";
import { LinearGradient } from "expo-linear-gradient";
import useApi from "@/utils/api";
import { Response } from "@/utils/types";
import { useAppUser } from "@/hooks/useAppUser";
import { usePuzzle } from "@/hooks/usePuzzle";
import { tabs, toast } from "@/utils/utils";
import LeaderboardUserRow from "@/components/user-stats/leaderboard-user-row";
import ReactNativeModal from "react-native-modal";
import { type Result } from "@/components/puzzling/puzzle-card";

const Home = () => {
  const api = useApi();
  const { user } = useUser();
  const router = useRouter();
  const { colors } = useTheme();
  const { fetchUserSettings, userSettings, leaderboardUsers, getDailyPuzzle, dailyPuzzle } = useAppUser();
  const { changeSelectedTab } = usePuzzle();

  const [openDailyExercise, setOpenDailyExercise] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userRes, setUserRes] = useState("");
  const [result, setResult] = useState<Result>({
    isCorrect: true,
    text: null,
  });
  const [checkLoading, setCheckLoading] = useState(false);
  const [timeTaken, setTimeTaken] = useState(0);

  const screenWidth = Dimensions.get("window").width;

  useEffect(() => {
    const wait = async () => {
      await addUserToDB();
      await checkResetStreak();
      await fetchUserSettings();
      await getDailyPuzzle();
      setLoading(false);
    };
    wait();
  }, []);

  useEffect(() => {
    if (!openDailyExercise) return;
    if (result.text || checkLoading) return;
    const interval = setInterval(() => {
      setTimeTaken((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [openDailyExercise, result.text, checkLoading]);

  const checkResetStreak = async () => {
    try {
      await api.get("/users/check-reset-streak");
    } catch (error) {
      console.error(error);
    }
  };

  const addUserToDB = async () => {
    try {
      const response = await api.post<Response>("/users/add-user-db", {
        name: user?.fullName,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const navTo = (path: Href) => {
    router.push(path);
    changeSelectedTab(tabs[2].id);
  };

  const checkHoursMessage = () => {
    const now = new Date();
    const twelvePm = new Date();
    const sixPm = new Date();
    twelvePm.setHours(12, 0, 0, 0);
    sixPm.setHours(18, 0, 0, 0);
    if (now < twelvePm) return "Good Morning";
    if (twelvePm <= now && now < sixPm) return "Good Afternoon";
    return "Good Evening";
  };

  const checkAnswer = async () => {
    setCheckLoading(true);
    setResult((prev) => ({ ...prev, text: null }));
    try {
      const response = await api.post<
        Response<"correct", { correct: boolean }>
      >("/train/check-answer", {
        puzzle: dailyPuzzle?.question,
        response: userRes,
        answer: dailyPuzzle?.answer,
        difficulty: dailyPuzzle?.difficulty,
        category: dailyPuzzle?.category,
        id: dailyPuzzle?._id,
        timeTaken,
        isDaily: true,
      });
      if (response.data.success && response.data.correct !== undefined) {
        setResult({
          isCorrect: response.data.correct,
          text: response.data.message,
        });
        return;
      }
      toast(
        "error",
        "Process Error",
        "Error checking response. Please try again later."
      );
      closeModal();
    } catch (error) {
      console.error(error);
      toast(
        "error",
        "Process Error",
        "Error checking response. Please try again later."
      );
      closeModal();
    } finally {
      setCheckLoading(false);
      fetchUserSettings();
    }
  };

  const closeModal = () => {
    setOpenDailyExercise(false);
    setUserRes("");
    setResult({ isCorrect: true, text: null });
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
            {checkHoursMessage()}, {user?.firstName}!
          </Text>
          <Text className="text-3xl font-bold" style={{ color: colors.text }}>
            Ready to train your brain?
          </Text>
        </View>
        {loading ? (
          <View className="w-full items-center justify-center">
            <ActivityIndicator
              size={50}
              color={colors.text}
              className="mt-52"
            />
          </View>
        ) : (
          <>
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
                      {userSettings?.streak ? userSettings.streak : 0}
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
                      name={
                        userSettings?.level.icon
                          ? userSettings.level.icon
                          : "extension-puzzle"
                      }
                      size={50}
                      color={
                        userSettings?.level.color
                          ? userSettings.level.color
                          : colors.primary
                      }
                    />
                    <Text
                      className="text-3xl font-bold"
                      style={{ color: colors.text }}
                    >
                      Level{" "}
                      {userSettings?.level.level ? userSettings.level.level : 1}
                    </Text>
                    <Text className="text-xl" style={{ color: colors.text }}>
                      {userSettings?.level.title
                        ? userSettings.level.title
                        : "Loading..."}
                    </Text>
                  </LinearGradient>
                </View>
              </View>
              <View className="gap-2">
                <Text
                  className="text-xl font-bold"
                  style={{ color: colors.text }}
                >
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
                    {userSettings?.todayStats.puzzles
                      ? userSettings.todayStats.puzzles.correct
                      : 0}
                    /{userSettings?.puzzleGoal ? userSettings.puzzleGoal : 0}
                  </Text>
                </View>
                <Progress.Bar
                  progress={
                    userSettings?.todayStats.puzzles.correct &&
                    userSettings?.puzzleGoal
                      ? userSettings.todayStats.puzzles.correct /
                        userSettings.puzzleGoal
                      : 0
                  }
                  color={
                    userSettings?.todayStats.puzzles.correct &&
                    userSettings?.puzzleGoal
                      ? userSettings.todayStats.puzzles.correct >=
                        userSettings.puzzleGoal
                        ? colors.success
                        : colors.gradients.muted[0]
                      : colors.gradients.muted[0]
                  }
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
                    {userSettings?.todayStats.points
                      ? userSettings.todayStats.points
                      : 0}
                    /{userSettings?.pointsGoal ? userSettings.pointsGoal : 0}
                  </Text>
                </View>
                <Progress.Bar
                  progress={
                    userSettings?.todayStats.points && userSettings?.pointsGoal
                      ? userSettings.todayStats.points / userSettings.pointsGoal
                      : 0
                  }
                  color={
                    userSettings?.todayStats.points && userSettings?.pointsGoal
                      ? userSettings.todayStats.points >=
                        userSettings.pointsGoal
                        ? colors.success
                        : colors.gradients.muted[0]
                      : colors.gradients.muted[0]
                  }
                  unfilledColor={colors.gradients.empty[1]}
                  width={screenWidth * 0.9}
                  height={20}
                  borderRadius={9999}
                  borderWidth={0}
                />
              </View>
            </View>
            <ReactNativeModal
              isVisible={openDailyExercise}
              animationIn="slideInUp"
            >
              <View
                className="h-full w-full rounded-xl p-5"
                style={{ backgroundColor: colors.bg }}
              >
                {dailyPuzzle ? (
                  <ScrollView contentContainerClassName="gap-5">
                    <View className="w-full flex-row items-center justify-between">
                      <Text
                        className="text-3xl font-bold"
                        style={{ color: colors.text }}
                      >
                        Daily Puzzle
                      </Text>
                      <TouchableOpacity onPress={closeModal}>
                        <Ionicons
                          name="close-circle"
                          color={colors.text}
                          size={48}
                        />
                      </TouchableOpacity>
                    </View>
                    <Image
                      source={{ uri: dailyPuzzle?.image.url }}
                      className="w-full h-[200px] rounded-xl"
                    />
                    <View
                      className="rounded-lg overflow-hidden"
                      style={{ display: result.text ? "flex" : "none" }}
                    >
                      <LinearGradient
                        colors={
                          result.isCorrect
                            ? colors.gradients.success
                            : colors.gradients.danger
                        }
                      >
                        <Text className="text-lg font-medium text-white py-2 px-4">
                          {result.text}
                        </Text>
                      </LinearGradient>
                    </View>
                    <Text
                      className="text-xl font-medium"
                      style={{ color: colors.text }}
                    >
                      {dailyPuzzle?.question}
                    </Text>
                    <TextInput
                      value={userRes}
                      onChangeText={(text) => setUserRes(text)}
                      multiline
                      textAlignVertical="top"
                      className="border-2 rounded-xl px-4 h-36 text-lg"
                      style={{
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                        color: colors.text,
                      }}
                    />
                    <TouchableOpacity
                      onPress={checkAnswer}
                      disabled={checkLoading}
                      className="rounded-xl overflow-hidden"
                      style={{ opacity: checkLoading ? 0.6 : 1 }}
                    >
                      <LinearGradient
                        className="py-3"
                        colors={colors.gradients.empty}
                      >
                        {checkLoading ? (
                          <View className="w-full flex-row items-center justify-center gap-2">
                            <ActivityIndicator size={25} color={colors.text} />
                            <Text
                              className="text-xl font-bold"
                              style={{ color: colors.text }}
                            >
                              Checking...
                            </Text>
                          </View>
                        ) : (
                          <Text
                            className="text-center text-xl font-bold"
                            style={{ color: colors.text }}
                          >
                            Check Answer
                          </Text>
                        )}
                      </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity className="rounded-xl overflow-hidden">
                      <LinearGradient
                        className="py-3 flex-row items-center justify-center gap-3 w-full"
                        colors={colors.gradients.empty}
                      >
                        <Ionicons name="bulb" size={25} color={colors.text} />
                        <Text
                          className="text-center text-xl font-bold"
                          style={{ color: colors.text }}
                        >
                          Hint
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </ScrollView>
                ) : (
                  <View className="rounded-xl overflow-hidden">
                    <LinearGradient
                      colors={colors.gradients.danger}
                      className="gap-2 p-5"
                    >
                      <Ionicons
                        name="close-circle"
                        size={50}
                        color={colors.text}
                      />
                      <Text
                        className="text-3xl font-bold"
                        style={{ color: colors.text }}
                      >
                        Error
                      </Text>
                      <Text
                        className="text-xl font-medium"
                        style={{ color: colors.textMuted }}
                      >
                        We are currently experiencing issues and are unable to
                        fetch this puzzle. If you can, try the other features in
                        the meantime while we get this fixed. Otherwise come
                        back later.
                      </Text>
                    </LinearGradient>
                  </View>
                )}
              </View>
            </ReactNativeModal>
            <View className="gap-2">
              <Text
                className="text-xl font-bold"
                style={{ color: colors.text }}
              >
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
                  <Ionicons
                    name="arrow-forward"
                    color={colors.text}
                    size={20}
                  />
                </LinearGradient>
              </TouchableOpacity>
            </View>
            {userSettings?.enableLeaderboard ? (
              <View className="gap-2">
                <Text
                  className="text-xl font-bold"
                  style={{ color: colors.text }}
                >
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
                        puzzles={
                          userSettings?.puzzles
                            ? userSettings.puzzles
                            : { correct: 0, incorrect: 0 }
                        }
                        rank={
                          leaderboardUsers.findIndex(
                            (item) => item.userId === userSettings?.userId
                          ) + 1
                        }
                      />
                    )}
                    <TouchableOpacity
                      onPress={() => navTo("/(main)/user-stats")}
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
            ) : (
              <View>
                <View className="rounded-xl overflow-hidden">
                  <LinearGradient
                    className="gap-2 p-4 items-center"
                    colors={colors.gradients.empty}
                  >
                    <Ionicons
                      name="trophy"
                      size={50}
                      color={colors.textMuted}
                    />
                    <Text
                      className="text-xl font-bold"
                      style={{ color: colors.text }}
                    >
                      Leaderboard Disabled
                    </Text>
                    <Text
                      className="text-center"
                      style={{ color: colors.textMuted }}
                    >
                      You have disabled the leaderboard. This means that you
                      won't be on the leaderboard and you will not be able to
                      see the leaderboard. To enable, go to user settings.
                    </Text>
                    <TouchableOpacity
                      onPress={() => navTo("/(main)/user-profile")}
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
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default Home;
