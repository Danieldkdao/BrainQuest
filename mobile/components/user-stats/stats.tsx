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

const StatsPage = () => {
  const { userSettings, changeUserSettingState } = useAppUser();
  const { colors } = useTheme();

  const width = Dimensions.get("screen").width;
  const fallbackBarData = [{ value: 0, label: "" }];
  const fallbackPieData = [{ value: 1, label: "Loading", color: "#ccc" }];

  const [selectedPiece, setSelectedPiece] = useState<PuzzleCategoryData | null>(
    () => (userSettings?.puzzleCategoryData ?? [])[0] ?? null
  );

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

  return (
    <View
      className="w-full items-center justify-center"
      style={{ backgroundColor: colors.bg }}
    >
      <ScrollView
        contentContainerClassName="items-center justify-center gap-5"
        className="w-[90%] pb-10"
      >
        {/* <View className="w-full items-start">
                    <Text className="text-3xl font-bold" style={{color: colors.text}}>Stats</Text>
                </View> */}
        <View
          className="border-2 rounded-xl p-5 gap-3"
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
          }}
        >
          <Text className="text-2xl font-bold" style={{ color: colors.text }}>
            Weekly Puzzles
          </Text>
          <View className="w-full items-center justify-center flex-row">
            <TouchableOpacity>
              <Ionicons name="chevron-back" color={colors.text} size={28} />
            </TouchableOpacity>
            <Text style={{ color: colors.text }}>
              {convertDate(userSettings?.weekPuzzles?.[0]?.from)} -{" "}
              {convertDate(userSettings?.weekPuzzles?.[0]?.to)}
            </Text>
            <TouchableOpacity>
              <Ionicons name="chevron-forward" color={colors.text} size={28} />
            </TouchableOpacity>
          </View>
          <BarChart
            data={
              userSettings?.weekPuzzles?.[0]?.data?.length
                ? userSettings.weekPuzzles[0].data
                : fallbackBarData
            }
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
            showGradient
            frontColor={colors.gradients.muted[1]}
            gradientColor={colors.gradients.muted[0]}
            hideRules
            showValuesAsTopLabel
            topLabelTextStyle={{
              color: colors.text,
            }}
            width={width * 0.75}
          />
        </View>
        <View
          className="border-2 rounded-xl p-5 gap-3"
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
          }}
        >
          <Text className="text-2xl font-bold" style={{ color: colors.text }}>
            Weekly Points
          </Text>
          <View className="w-full items-center justify-center flex-row">
            <TouchableOpacity>
              <Ionicons name="chevron-back" color={colors.text} size={28} />
            </TouchableOpacity>
            <Text style={{ color: colors.text }}>
              {convertDate(userSettings?.weekPoints?.[0]?.from)} -{" "}
              {convertDate(userSettings?.weekPoints?.[0]?.to)}
            </Text>
            <TouchableOpacity>
              <Ionicons name="chevron-forward" color={colors.text} size={28} />
            </TouchableOpacity>
          </View>
          <BarChart
            data={
              userSettings?.weekPoints?.[0]?.data?.length
                ? userSettings.weekPoints[0].data
                : fallbackBarData
            }
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
            showGradient
            frontColor={colors.gradients.muted[1]}
            gradientColor={colors.gradients.muted[0]}
            hideRules
            showValuesAsTopLabel
            topLabelTextStyle={{
              color: colors.text,
            }}
            width={width * 0.75}
          />
        </View>
        <View
          className="border-2 rounded-xl p-5 gap-3 flex-row w-full justify-center"
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
          }}
        >
          <View className="gap-3">
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
            <View className="w-full items-center justify-start flex-row flex-wrap max-w-[240px] gap-2">
              {(userSettings?.puzzleCategoryData ?? []).map((item, index) => {
                return (
                  <View
                    key={index}
                    className="flex-row items-center gap-2 max-w-[120px]"
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
              <Progress.Circle
                progress={
                  userSettings?.todayPuzzles && userSettings?.puzzleGoal
                    ? userSettings.todayPuzzles / userSettings.puzzleGoal
                    : 0
                }
                size={width * 0.35}
                borderWidth={0}
                unfilledColor={colors.textMuted}
                thickness={15}
                showsText
                textStyle={{
                  color: colors.text,
                  fontWeight: "bold",
                }}
              />
            </View>
            <View className="gap-3">
              <Text
                className="text-xl font-medium text-center"
                style={{ color: colors.text }}
              >
                Points
              </Text>
              <Progress.Circle
                progress={
                  userSettings?.todayPoints && userSettings?.pointsGoal
                    ? userSettings.todayPoints / userSettings.pointsGoal
                    : 0
                }
                size={width * 0.35}
                borderWidth={0}
                unfilledColor={colors.textMuted}
                thickness={15}
                showsText
                textStyle={{
                  color: colors.text,
                  fontWeight: "bold",
                }}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default StatsPage;
