import { View, Text, Dimensions, TouchableOpacity } from "react-native";
import React from "react";
import { useTheme } from "@/hooks/useTheme";
import * as Progress from "react-native-progress";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { type UserProgress, type Challenge } from "@/utils/types";
import { useAuth } from "@clerk/clerk-expo";
import { usePuzzle } from "@/hooks/usePuzzle";
import TrainPage from "./train";

type ChallengeCardProps = {
  item: Challenge;
};

const ChallengeCard = ({ item }: ChallengeCardProps) => {
  const { colors } = useTheme();
  const { userId } = useAuth();
  const { changeSelectedComponent } = usePuzzle();

  const screenWidth = Dimensions.get("screen").width;
  const pendingUser = item.usersComplete.filter(item => item.user === userId)[0];
  const user = pendingUser ? pendingUser : {} as UserProgress;
  const progress =
    Object.keys(user).length === 0 ? 0 : user.progress / item.final;

  return (
    <View
      className="gap-2 p-5 rounded-xl border-2"
      style={{ backgroundColor: colors.surface, borderColor: colors.border }}
    >
      <View className="gap-1">
        <View className="flex-row items-center">
          <Text
            className="text-xl font-bold flex-1"
            style={{ color: colors.text }}
          >
            {item.title}
          </Text>
          <Text
            style={{
              color:
                progress === 0
                  ? colors.danger
                  : user.isCompleted
                    ? colors.success
                    : colors.warning,
            }}
          >
            {progress === 0
              ? "Not started"
              : user.isCompleted
                ? "Completed"
                : "In progress"}
          </Text>
        </View>
        <Text className="text-xl" style={{ color: colors.textMuted }}>
          Task: {item.task}
        </Text>
        <Text className="text-xl" style={{ color: colors.textMuted }}>
          Reward:{" "}
          <Text className="font-bold" style={{ color: colors.text }}>
            {item.reward} Points ✨
          </Text>
        </Text>
      </View>
      <Text className="text-xl font-medium" style={{ color: colors.text }}>
        Progress:
      </Text>
      <View className="flex-row flex-wrap items-center gap-2">
        <Progress.Bar
          progress={progress}
          borderWidth={0}
          height={15}
          borderRadius={10}
          color={colors.success}
          unfilledColor={colors.gradients.empty[1]}
          width={screenWidth * 0.5}
        />
        <Text className="text-xl font-medium" style={{ color: colors.text }}>
          {user.progress ? user.progress : 0}/{item.final}
        </Text>
      </View>
      <TouchableOpacity
        disabled={user.isCompleted}
        onPress={() => changeSelectedComponent(<TrainPage />)}
        className="rounded-xl overflow-hidden w-full"
      >
        <LinearGradient
          colors={
            user.isCompleted
              ? colors.gradients.success
              : colors.gradients.primary
          }
          className="flex-row gap-2 py-2 items-center justify-center"
        >
          <Text className="text-xl font-bold" style={{ color: colors.text }}>
            {user.isCompleted ? "Challenge Complete" : "Go"}
          </Text>
          <Ionicons
            name={
              user.isCompleted ? "checkmark-circle" : "chevron-forward-circle"
            }
            color={colors.text}
            size={25}
          />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

export default ChallengeCard;
