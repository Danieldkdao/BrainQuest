import { View, Text, Dimensions, TouchableOpacity } from "react-native";
import React from "react";
import { Response, Session } from "@/utils/types";
import { useTheme } from "@/hooks/useTheme";
import useApi from "@/utils/api";
import * as Progress from "react-native-progress";
import { Ionicons } from "@expo/vector-icons";
import { usePuzzle } from "@/hooks/usePuzzle";
import { toast } from "@/utils/utils";

type SessionCardProps = {
  item: Session;
  fetchSessions: () => Promise<void>;
};

const SessionCard = ({ item, fetchSessions }: SessionCardProps) => {
  const api = useApi();
  const { confirm } = usePuzzle();
  const { colors } = useTheme();

  const width = Dimensions.get("screen").width;
  const ratio =
    item.puzzlesAttempted > 0 ? item.puzzlesSolved / item.puzzlesAttempted : 0;

  const convertDate = (d: string) => {
    if (!d) return;
    const newDate = new Date(d);
    const time = newDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    const date = newDate.toDateString();
    return `Completed at ${time} on ${date}`;
  };

  const deleteSession = async () => {
    const isOk = await confirm(
      "Confirm Delete Action",
      "Are you sure you want to delete this session?"
    );
    if (!isOk) return;
    try {
      const response = await api.delete<Response>(
        `/train/delete-session/${item._id}`
      );
      if (response.data.success) {
        fetchSessions();
        return;
      }
      toast(
        "error",
        "Deletion error",
        "Error deleting session. Please come back later."
      );
    } catch (error) {
      console.error(error);
      toast(
        "error",
        "Deletion error",
        "Error deleting session. Please come back later."
      );
    }
  };

  return (
    <View
      className="border-2 rounded-xl p-5"
      style={{ borderColor: colors.border, backgroundColor: colors.surface }}
    >
      <View className="flex-row gap-4">
        <View className="relative">
          <Progress.Circle
            progress={ratio}
            thickness={15}
            size={width / 3}
            borderWidth={0}
            unfilledColor={colors.danger}
            color={colors.success}
          />
          <View className="items-center justify-center absolute inset-0">
            <Text className="text-2xl font-bold" style={{ color: colors.text }}>
              {Math.round(ratio * 100)}%
            </Text>
            <Text
              className="text text-sm text-center"
              style={{ color: colors.textMuted }}
            >
              Puzzles Solved
            </Text>
          </View>
        </View>
        <View className="flex-1 gap-2">
          <View className="flex-row items-center gap-2">
            <Ionicons name="sparkles" color={colors.text} size={30} />
            <Text className="text-xl" style={{ color: colors.text }}>
              Points Earned:{" "}
              <Text className="font-extrabold">{item.pointsEarned}</Text>
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Ionicons name="hourglass" color={colors.text} size={30} />
            <Text className="text-xl" style={{ color: colors.text }}>
              Time Limit:{" "}
              <Text className="font-extrabold">{item.timeLimit}</Text>
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Ionicons name="time" color={colors.text} size={30} />
            <Text className="text-xl" style={{ color: colors.text }}>
              Time Taken:{" "}
              <Text className="font-extrabold">{item.timeTaken}</Text>
            </Text>
          </View>
        </View>
      </View>
      <View className="flex-row items-end justify-between">
        <Text className="text-sm" style={{ color: colors.textMuted }}>
          {convertDate(item.createdAt)}
        </Text>
        <TouchableOpacity onPress={deleteSession}>
          <Ionicons name="trash" size={30} color={colors.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SessionCard;
