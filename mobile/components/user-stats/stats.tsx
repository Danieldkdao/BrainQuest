import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { BarChart, PieChart } from "react-native-gifted-charts";
import { Ionicons } from "@expo/vector-icons";
import * as Progress from "react-native-progress";

type ExerciseData = {
  value: number;
  color: string;
  text: string;
  label: string;
  focused: boolean;
};

const StatsPage = () => {
  const weeklyExerciseData = [
    { value: 5, label: "Mon" },
    { value: 8, label: "Tue" },
    { value: 6, label: "Wed" },
    { value: 0, label: "Thu" },
    { value: 7, label: "Fri" },
    { value: 10, label: "Sat" },
    { value: 4, label: "Sun" },
  ];

  const weeklyExerciseData2 = [
    { value: 50, label: "Mon" },
    { value: 80, label: "Tue" },
    { value: 60, label: "Wed" },
    { value: 38, label: "Thu" },
    { value: 71, label: "Fri" },
    { value: 19, label: "Sat" },
    { value: 41, label: "Sun" },
  ];

  const exerciseCategoryData: ExerciseData[] = [
    {
      value: 20,
      color: "#4F46E5", // indigo
      text: "20%",
      label: "Logic",
      focused: true,
    },
    {
      value: 18,
      color: "#10B981", // emerald
      text: "18%",
      label: "Math",
      focused: false,
    },
    {
      value: 22,
      color: "#F59E0B", // amber
      text: "22%",
      label: "Wordplay",
      focused: false,
    },
    {
      value: 16,
      color: "#EF4444", // red
      text: "16%",
      label: "Lateral",
      focused: false,
    },
    {
      value: 12,
      color: "#3B82F6", // blue
      text: "12%",
      label: "Patterns",
      focused: false,
    },
    {
      value: 8,
      color: "#8B5CF6", // violet
      text: "8%",
      label: "Classic",
      focused: false,
    },
    {
      value: 4,
      color: "#06B6D4", // cyan
      text: "4%",
      label: "Trivia",
      focused: false,
    },
  ];

  const width = Dimensions.get("screen").width;

  const { colors } = useTheme();

  const [categoryData, setCategoryData] =
    useState<ExerciseData[]>(exerciseCategoryData);
  const [selectedPiece, setSelectedPiece] = useState<ExerciseData>(
    exerciseCategoryData[0]
  );

  const toggleSelectedPiece = (data: ExerciseData) => {
    setCategoryData(
      (prev) =>
        (prev = exerciseCategoryData.map((item) => {
          if (item.label === data.label) return { ...item, focused: true };
          return { ...item, focused: false };
        }))
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
            Weekly Exercises
          </Text>
          <View className="w-full items-center justify-center flex-row">
            <TouchableOpacity>
              <Ionicons name="chevron-back" color={colors.text} size={28} />
            </TouchableOpacity>
            <Text style={{ color: colors.text }}>
              Mon Sep 8 2025 - Sun Sep 14 2025
            </Text>
            <TouchableOpacity>
              <Ionicons name="chevron-forward" color={colors.text} size={28} />
            </TouchableOpacity>
          </View>
          <BarChart
            data={weeklyExerciseData}
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
              Mon Sep 8 2025 - Sun Sep 14 2025
            </Text>
            <TouchableOpacity>
              <Ionicons name="chevron-forward" color={colors.text} size={28} />
            </TouchableOpacity>
          </View>
          <BarChart
            data={weeklyExerciseData2}
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
              data={categoryData}
              donut
              fontWeight="bold"
              innerCircleColor={colors.surface}
              sectionAutoFocus
              onPress={(item: ExerciseData) => toggleSelectedPiece(item)}
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
                      {selectedPiece.text}
                    </Text>
                    <Text className="text-2xl" style={{ color: colors.text }}>
                      {selectedPiece.label}
                    </Text>
                  </View>
                );
              }}
            />
            <View className="w-full items-center justify-start flex-row flex-wrap max-w-[240px] gap-2">
              {categoryData.map((item, index) => {
                return (
                  <View key={index} className="flex-row items-center gap-2 max-w-[120px]">
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
          <Text className="text-center text-2xl font-bold" style={{color: colors.text}}>Goal Progress</Text>
          <View className="w-full flex-row justify-between">
            <View className="gap-3">
              <Text className="text-xl font-medium text-center" style={{color: colors.text}}>Exercises</Text>
              <Progress.Circle
                progress={0.4}
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
              <Text className="text-xl font-medium text-center" style={{color: colors.text}}>Points</Text>
              <Progress.Circle
                progress={0.4}
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
