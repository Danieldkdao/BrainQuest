import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { BarChart, PieChart } from "react-native-gifted-charts";
import { Ionicons } from "@expo/vector-icons";
import * as Progress from "react-native-progress";
import { type PuzzleCategoryData } from "@/utils/types";
import { useAppUser } from "@/hooks/useAppUser";
import { convertDate } from "@/app/(main)/user-profile";
import { LinearGradient } from "expo-linear-gradient";
import { calcMins, calcSeconds } from "../puzzling/challenge";

const StatsPage = () => {
  const { userSettings, changeUserSettingState } = useAppUser();
  const { colors } = useTheme();

  const lastIndex = userSettings?.weekPuzzles
    ? userSettings.weekPuzzles.length - 1
    : 0;
  const width = Dimensions.get("screen").width;
  const fallbackBarData = [{ value: 0, label: "" }];
  const fallbackPieData = [{ value: 1, label: "Loading", color: "#ccc" }];

  const [selectedPiece, setSelectedPiece] = useState<PuzzleCategoryData | null>(
    () => (userSettings?.puzzleCategoryData ?? [])[0] ?? null
  );
  const [currentWeek, setCurrentWeek] = useState(lastIndex);

  useEffect(() => {
    if (
      !selectedPiece &&
      userSettings?.puzzleCategoryData &&
      userSettings.puzzleCategoryData.length > 0
    ) {
      setSelectedPiece(userSettings?.puzzleCategoryData[0]);
    }
  }, [userSettings, selectedPiece]);

  const toggleSelectedPiece = (data: PuzzleCategoryData) => {
    if (selectedPiece?.label === data.label) return;
    const changedArray = (userSettings?.puzzleCategoryData ?? []).map(
      (item) => ({ ...item, focused: item.label === data.label })
    );
    changeUserSettingState<"puzzleCategoryData">(
      "puzzleCategoryData",
      changedArray
    );
    setSelectedPiece(data);
  };

  const decrementCondition = currentWeek - 1 < 0;
  const incrementCondition = currentWeek + 1 > lastIndex;

  const changeCurrentWeek = (value: number) => {
    if (value === -1 && decrementCondition) return;
    if (value === 1 && incrementCondition) return;
    setCurrentWeek((prev) => prev + value);
  };

  const timeSpentToday = userSettings?.todayStats.timeSpent
    ? userSettings.todayStats.timeSpent
    : 0;
  const timeSpentThisWeek = userSettings?.weekTimeSpent
    ? userSettings.weekTimeSpent[currentWeek].data.reduce(
        (a, b) => a + b.value,
        0
      )
    : 0;
  const incorrectCategoryPuzzles =
    selectedPiece?.value && selectedPiece?.correct
      ? selectedPiece.value - selectedPiece.correct
      : 0;
  const timeSpentOnCategoryPuzzles = selectedPiece?.timeSpent
    ? selectedPiece.timeSpent
    : 0;
  const correctPuzzlesToday = userSettings?.todayStats.puzzles.correct
    ? userSettings.todayStats.puzzles.correct
    : 0;
  const incorrectPuzzlesToday = userSettings?.todayStats.puzzles.incorrect
    ? userSettings.todayStats.puzzles.incorrect
    : 0;

  return (
    <View
      className="w-full items-center justify-center"
      style={{ backgroundColor: colors.bg }}
    >
      <ScrollView
        contentContainerClassName="items-center justify-center gap-5"
        className="w-[90%] pb-10"
      >
        <View
          className="border-2 rounded-xl p-5 gap-4 w-full"
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
          }}
        >
          <Text
            className="text-2xl font-bold text-center"
            style={{ color: colors.text }}
          >
            Activity Today
          </Text>
          <View>
            <View className="flex-row gap-2 w-full">
              <View className="rounded-xl overflow-hidden flex-1">
                <LinearGradient
                  colors={colors.gradients.success}
                  className="p-2 items-center"
                >
                  <Text
                    className="text-xl font-medium"
                    style={{ color: colors.text }}
                  >
                    Correct
                  </Text>
                  <Text
                    className="text-3xl font-bold"
                    style={{ color: colors.text }}
                  >
                    {correctPuzzlesToday}
                  </Text>
                </LinearGradient>
              </View>
              <View className="rounded-xl overflow-hidden flex-1">
                <LinearGradient
                  colors={colors.gradients.danger}
                  className="p-2 items-center"
                >
                  <Text
                    className="text-xl font-medium"
                    style={{ color: colors.text }}
                  >
                    Incorrect
                  </Text>
                  <Text
                    className="text-3xl font-bold"
                    style={{ color: colors.text }}
                  >
                    {incorrectPuzzlesToday}
                  </Text>
                </LinearGradient>
              </View>
            </View>
          </View>
        </View>
        <View
          className="border-2 rounded-xl p-5 gap-4"
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
          }}
        >
          <View>
            <Text
              className="text-2xl font-bold text-center"
              style={{ color: colors.text }}
            >
              Weekly Activity
            </Text>
            <View className="w-full items-center justify-center flex-row">
              <TouchableOpacity
                disabled={decrementCondition}
                style={{ opacity: decrementCondition ? 0.6 : 1 }}
                onPress={() => changeCurrentWeek(-1)}
              >
                <Ionicons name="chevron-back" color={colors.text} size={28} />
              </TouchableOpacity>
              <View className="flex-row gap-2">
                <Text className="text-lg" style={{ color: colors.text }}>
                  {convertDate(userSettings?.weekPuzzles?.[currentWeek]?.from)}
                </Text>
                <Text className="text-lg" style={{ color: colors.text }}>
                  -
                </Text>
                <Text className="text-lg" style={{ color: colors.text }}>
                  {convertDate(userSettings?.weekPuzzles?.[currentWeek]?.to)}
                </Text>
              </View>
              <TouchableOpacity
                disabled={incrementCondition}
                style={{ opacity: incrementCondition ? 0.6 : 1 }}
                onPress={() => changeCurrentWeek(1)}
              >
                <Ionicons
                  name="chevron-forward"
                  color={colors.text}
                  size={28}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View className="gap-2">
            <Text
              className="text-xl font-bold text-center"
              style={{ color: colors.text }}
            >
              Puzzles
            </Text>
            <View className="flex-row items-center justify-center w-full gap-4">
              <View className="flex-row items-center gap-2">
                <View className="rounded-full overflow-hidden">
                  <LinearGradient
                    className="size-4"
                    colors={colors.gradients.success}
                  ></LinearGradient>
                </View>
                <Text
                  className="font-medium"
                  style={{ color: colors.textMuted }}
                >
                  Correct
                </Text>
              </View>
              <View className="flex-row items-center gap-2">
                <View className="rounded-full overflow-hidden">
                  <LinearGradient
                    className="size-4"
                    colors={colors.gradients.danger}
                  ></LinearGradient>
                </View>
                <Text
                  className="font-medium"
                  style={{ color: colors.textMuted }}
                >
                  Incorrect
                </Text>
              </View>
            </View>
            <BarChart
              data={
                userSettings?.weekPuzzles?.[currentWeek]
                  ? userSettings.weekPuzzles[currentWeek].data
                  : fallbackBarData
              }
              height={300}
              yAxisIndicesColor={colors.text}
              xAxisLabelTextStyle={{
                color: colors.text,
              }}
              yAxisTextStyle={{
                color: colors.text,
              }}
              xAxisThickness={0}
              yAxisThickness={0}
              isAnimated
              barWidth={25}
              barBorderRadius={4}
              hideRules
              showValuesAsTopLabel
              topLabelTextStyle={{
                color: colors.text,
                textAlign: "center",
              }}
              showGradient
              width={width * 0.75}
            />
          </View>
          <View className="gap-2 mt-2">
            <Text
              className="text-xl font-bold text-center"
              style={{ color: colors.text }}
            >
              Points Earned
            </Text>
            <BarChart
              data={
                userSettings?.weekPoints?.[currentWeek]?.data?.length
                  ? userSettings.weekPoints[currentWeek].data
                  : fallbackBarData
              }
              height={300}
              yAxisIndicesColor={colors.text}
              xAxisLabelTextStyle={{
                color: colors.text,
              }}
              yAxisTextStyle={{
                color: colors.text,
              }}
              xAxisThickness={0}
              yAxisThickness={0}
              isAnimated
              barWidth={25}
              barBorderRadius={4}
              hideRules
              showValuesAsTopLabel
              topLabelTextStyle={{
                color: colors.text,
                textAlign: "center",
              }}
              showGradient
              width={width * 0.75}
            />
          </View>
          <View className="gap-2 mt-2 items-center">
            <Text
              className="text-xl font-bold text-center"
              style={{ color: colors.text }}
            >
              Time Spent
            </Text>
            <View className="flex-row gap-2">
              <View className="items-center">
                <View className="rounded-lg overflow-hidden">
                  <LinearGradient
                    colors={colors.gradients.empty}
                    className="p-2"
                  >
                    <Text
                      className="text-2xl font-medium"
                      style={{ color: colors.text }}
                    >
                      {String(Math.floor(timeSpentThisWeek / 3600)).padStart(
                        2,
                        "0"
                      )}
                    </Text>
                  </LinearGradient>
                </View>
                <Text
                  className="font-medium"
                  style={{ color: colors.textMuted }}
                >
                  Hrs
                </Text>
              </View>
              <Text
                className="text-xl font-bold pt-2"
                style={{ color: colors.text }}
              >
                :
              </Text>
              <View className="items-center">
                <View className="rounded-lg overflow-hidden">
                  <LinearGradient
                    colors={colors.gradients.empty}
                    className="p-2"
                  >
                    <Text
                      className="text-2xl font-medium"
                      style={{ color: colors.text }}
                    >
                      {String(calcMins(timeSpentThisWeek)).padStart(2, "0")}
                    </Text>
                  </LinearGradient>
                </View>
                <Text
                  className="font-medium"
                  style={{ color: colors.textMuted }}
                >
                  Min
                </Text>
              </View>
              <Text
                className="text-xl font-bold pt-2"
                style={{ color: colors.text }}
              >
                :
              </Text>
              <View className="items-center">
                <View className="rounded-lg overflow-hidden">
                  <LinearGradient
                    colors={colors.gradients.empty}
                    className="p-2"
                  >
                    <Text
                      className="text-2xl font-medium"
                      style={{ color: colors.text }}
                    >
                      {String(calcSeconds(timeSpentThisWeek)).padStart(2, "0")}
                    </Text>
                  </LinearGradient>
                </View>
                <Text
                  className="font-medium"
                  style={{ color: colors.textMuted }}
                >
                  Sec
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View
          className="border-2 rounded-xl p-5 gap-3 w-full"
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
          }}
        >
          <Text
            className="text-2xl font-bold text-center"
            style={{ color: colors.text }}
          >
            Time Spent
          </Text>
          <View className="gap-4">
            <View className="items-center gap-2">
              <Text
                className="text-xl font-medium"
                style={{ color: colors.text }}
              >
                Today
              </Text>
              <View className="flex-row gap-2">
                <View className="items-center">
                  <View className="rounded-lg overflow-hidden">
                    <LinearGradient
                      colors={colors.gradients.empty}
                      className="p-2"
                    >
                      <Text
                        className="text-2xl font-medium"
                        style={{ color: colors.text }}
                      >
                        {String(Math.floor(timeSpentToday / 3600)).padStart(
                          2,
                          "0"
                        )}
                      </Text>
                    </LinearGradient>
                  </View>
                  <Text
                    className="font-medium"
                    style={{ color: colors.textMuted }}
                  >
                    Hrs
                  </Text>
                </View>
                <Text
                  className="text-xl font-bold pt-2"
                  style={{ color: colors.text }}
                >
                  :
                </Text>
                <View className="items-center">
                  <View className="rounded-lg overflow-hidden">
                    <LinearGradient
                      colors={colors.gradients.empty}
                      className="p-2"
                    >
                      <Text
                        className="text-2xl font-medium"
                        style={{ color: colors.text }}
                      >
                        {String(calcMins(timeSpentToday)).padStart(2, "0")}
                      </Text>
                    </LinearGradient>
                  </View>
                  <Text
                    className="font-medium"
                    style={{ color: colors.textMuted }}
                  >
                    Min
                  </Text>
                </View>
                <Text
                  className="text-xl font-bold pt-2"
                  style={{ color: colors.text }}
                >
                  :
                </Text>
                <View className="items-center">
                  <View className="rounded-lg overflow-hidden">
                    <LinearGradient
                      colors={colors.gradients.empty}
                      className="p-2"
                    >
                      <Text
                        className="text-2xl font-medium"
                        style={{ color: colors.text }}
                      >
                        {String(calcSeconds(timeSpentToday)).padStart(2, "0")}
                      </Text>
                    </LinearGradient>
                  </View>
                  <Text
                    className="font-medium"
                    style={{ color: colors.textMuted }}
                  >
                    Sec
                  </Text>
                </View>
              </View>
            </View>
            <View className="items-center gap-2">
              <Text
                className="text-xl font-medium"
                style={{ color: colors.text }}
              >
                This Week
              </Text>
              <View className="flex-row gap-2">
                <View className="items-center">
                  <View className="rounded-lg overflow-hidden">
                    <LinearGradient
                      colors={colors.gradients.empty}
                      className="p-2"
                    >
                      <Text
                        className="text-2xl font-medium"
                        style={{ color: colors.text }}
                      >
                        {String(Math.floor(timeSpentThisWeek / 3600)).padStart(
                          2,
                          "0"
                        )}
                      </Text>
                    </LinearGradient>
                  </View>
                  <Text
                    className="font-medium"
                    style={{ color: colors.textMuted }}
                  >
                    Hrs
                  </Text>
                </View>
                <Text
                  className="text-xl font-bold pt-2"
                  style={{ color: colors.text }}
                >
                  :
                </Text>
                <View className="items-center">
                  <View className="rounded-lg overflow-hidden">
                    <LinearGradient
                      colors={colors.gradients.empty}
                      className="p-2"
                    >
                      <Text
                        className="text-2xl font-medium"
                        style={{ color: colors.text }}
                      >
                        {String(calcMins(timeSpentThisWeek)).padStart(2, "0")}
                      </Text>
                    </LinearGradient>
                  </View>
                  <Text
                    className="font-medium"
                    style={{ color: colors.textMuted }}
                  >
                    Min
                  </Text>
                </View>
                <Text
                  className="text-xl font-bold pt-2"
                  style={{ color: colors.text }}
                >
                  :
                </Text>
                <View className="items-center">
                  <View className="rounded-lg overflow-hidden">
                    <LinearGradient
                      colors={colors.gradients.empty}
                      className="p-2"
                    >
                      <Text
                        className="text-2xl font-medium"
                        style={{ color: colors.text }}
                      >
                        {String(calcSeconds(timeSpentThisWeek)).padStart(
                          2,
                          "0"
                        )}
                      </Text>
                    </LinearGradient>
                  </View>
                  <Text
                    className="font-medium"
                    style={{ color: colors.textMuted }}
                  >
                    Sec
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View
          className="border-2 rounded-xl p-5 gap-3 flex-row w-full justify-center"
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
          }}
        >
          <View className="gap-3 items-center">
            <Text
              className="text-center text-2xl font-bold"
              style={{ color: colors.text }}
            >
              Puzzles by Category
            </Text>
            <PieChart
              radius={width * 0.3}
              data={
                userSettings?.puzzleCategoryData.length
                  ? userSettings.puzzleCategoryData
                  : fallbackPieData
              }
              donut
              fontWeight="bold"
              innerCircleColor={colors.surface}
              sectionAutoFocus
              onPress={(item: PuzzleCategoryData) => toggleSelectedPiece(item)}
              innerRadius={width * 0.2}
              centerLabelComponent={() => {
                return (
                  <View className="items-center justify-center">
                    <Text
                      className="font-bold text-3xl"
                      style={{
                        color: colors.text,
                      }}
                    >
                      {selectedPiece?.text}
                    </Text>
                    <Text className="text-2xl" style={{ color: colors.text }}>
                      {selectedPiece?.label}
                    </Text>
                  </View>
                );
              }}
            />
            <View className="gap-3 my-2">
              <View className="flex-row gap-2 w-full">
                <View className="rounded-xl overflow-hidden flex-1">
                  <LinearGradient
                    colors={colors.gradients.success}
                    className="p-2 items-center"
                  >
                    <Text
                      className="text-xl font-medium"
                      style={{ color: colors.text }}
                    >
                      Correct
                    </Text>
                    <Text
                      className="text-3xl font-bold"
                      style={{ color: colors.text }}
                    >
                      {selectedPiece?.correct}
                    </Text>
                  </LinearGradient>
                </View>
                <View className="rounded-xl overflow-hidden flex-1">
                  <LinearGradient
                    colors={colors.gradients.danger}
                    className="p-2 items-center"
                  >
                    <Text
                      className="text-xl font-medium"
                      style={{ color: colors.text }}
                    >
                      Incorrect
                    </Text>
                    <Text
                      className="text-3xl font-bold"
                      style={{ color: colors.text }}
                    >
                      {incorrectCategoryPuzzles}
                    </Text>
                  </LinearGradient>
                </View>
              </View>
              <View className="items-center gap-3">
                <Text
                  className="text-xl font-medium"
                  style={{ color: colors.text }}
                >
                  Time Spent on {selectedPiece?.label} Puzzles
                </Text>
                <View className="flex-row gap-2">
                  <View className="items-center">
                    <View className="rounded-lg overflow-hidden">
                      <LinearGradient
                        colors={colors.gradients.empty}
                        className="p-2"
                      >
                        <Text
                          className="text-2xl font-medium"
                          style={{ color: colors.text }}
                        >
                          {String(
                            Math.floor(timeSpentOnCategoryPuzzles / 3600)
                          ).padStart(2, "0")}
                        </Text>
                      </LinearGradient>
                    </View>
                    <Text
                      className="font-medium"
                      style={{ color: colors.textMuted }}
                    >
                      Hrs
                    </Text>
                  </View>
                  <Text
                    className="text-xl font-bold pt-2"
                    style={{ color: colors.text }}
                  >
                    :
                  </Text>
                  <View className="items-center">
                    <View className="rounded-lg overflow-hidden">
                      <LinearGradient
                        colors={colors.gradients.empty}
                        className="p-2"
                      >
                        <Text
                          className="text-2xl font-medium"
                          style={{ color: colors.text }}
                        >
                          {String(
                            calcMins(timeSpentOnCategoryPuzzles)
                          ).padStart(2, "0")}
                        </Text>
                      </LinearGradient>
                    </View>
                    <Text
                      className="font-medium"
                      style={{ color: colors.textMuted }}
                    >
                      Min
                    </Text>
                  </View>
                  <Text
                    className="text-xl font-bold pt-2"
                    style={{ color: colors.text }}
                  >
                    :
                  </Text>
                  <View className="items-center">
                    <View className="rounded-lg overflow-hidden">
                      <LinearGradient
                        colors={colors.gradients.empty}
                        className="p-2"
                      >
                        <Text
                          className="text-2xl font-medium"
                          style={{ color: colors.text }}
                        >
                          {String(
                            calcSeconds(timeSpentOnCategoryPuzzles)
                          ).padStart(2, "0")}
                        </Text>
                      </LinearGradient>
                    </View>
                    <Text
                      className="font-medium"
                      style={{ color: colors.textMuted }}
                    >
                      Sec
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View className="w-full items-center justify-start flex-row flex-wrap max-w-[260px] gap-2">
              {(userSettings?.puzzleCategoryData ?? []).map((item, index) => {
                const isSelected = selectedPiece?.label === item.label;
                return (
                  <View
                    key={index}
                    className="flex-row items-center gap-2 p-2 rounded-lg"
                    style={{
                      backgroundColor: isSelected ? colors.bg : "transparent",
                    }}
                  >
                    <View
                      className="h-4 w-4 rounded-full"
                      style={{
                        backgroundColor: item.color,
                      }}
                    ></View>
                    <Text
                      className="font-medium"
                      style={{
                        color: colors.text,
                      }}
                    >
                      {`${item.label}: ${item.text}`}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
        <View
          className="border-2 rounded-xl p-5 gap-3 w-full justify-between"
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
          }}
        >
          <Text
            className="text-center text-2xl font-bold"
            style={{ color: colors.text }}
          >
            Goal Progress
          </Text>
          <View className="w-full flex-row justify-between">
            <View className="gap-3">
              <Text
                className="text-xl font-medium text-center"
                style={{ color: colors.text }}
              >
                Puzzles
              </Text>
              <View className="relative">
                <Progress.Circle
                  progress={
                    userSettings?.todayStats.puzzles && userSettings?.puzzleGoal
                      ? userSettings.todayStats.puzzles.correct /
                        userSettings.puzzleGoal
                      : 0
                  }
                  color={
                    userSettings?.todayStats.puzzles && userSettings?.puzzleGoal
                      ? userSettings.todayStats.puzzles.correct >=
                        userSettings.puzzleGoal
                        ? colors.success
                        : colors.gradients.muted[0]
                      : colors.gradients.muted[0]
                  }
                  size={width * 0.35}
                  borderWidth={0}
                  unfilledColor={colors.gradients.empty[1]}
                  thickness={15}
                />
                <View className="items-center justify-center absolute inset-0">
                  <Text
                    className="text-2xl font-bold"
                    style={{ color: colors.text }}
                  >
                    {userSettings?.todayStats.puzzles &&
                    userSettings?.puzzleGoal
                      ? Math.round(
                          (userSettings.todayStats.puzzles.correct /
                            userSettings.puzzleGoal) *
                            100
                        )
                      : 0}
                    %
                  </Text>
                  <Text className="text-xl" style={{ color: colors.textMuted }}>
                    {userSettings?.todayStats.puzzles.correct}/
                    {userSettings?.puzzleGoal}
                  </Text>
                </View>
              </View>
            </View>
            <View className="gap-3">
              <Text
                className="text-xl font-medium text-center"
                style={{ color: colors.text }}
              >
                Points
              </Text>
              <View className="relative">
                <Progress.Circle
                  progress={
                    userSettings?.todayStats?.points && userSettings?.pointsGoal
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
                  size={width * 0.35}
                  borderWidth={0}
                  unfilledColor={colors.gradients.empty[1]}
                  thickness={15}
                />
                <View className="items-center justify-center absolute inset-0">
                  <Text
                    className="text-2xl font-bold"
                    style={{ color: colors.text }}
                  >
                    {userSettings?.todayStats.points && userSettings?.pointsGoal
                      ? Math.round(
                          (userSettings.todayStats.points /
                            userSettings.pointsGoal) *
                            100
                        )
                      : 0}
                    %
                  </Text>
                  <Text className="text-xl" style={{ color: colors.textMuted }}>
                    {userSettings?.todayStats.points}/{userSettings?.pointsGoal}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default StatsPage;
