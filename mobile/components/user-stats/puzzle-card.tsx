import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Puzzle, Response } from "@/utils/types";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { convertDate } from "@/app/(main)/user-profile";
import { usePuzzle } from "@/hooks/usePuzzle";
import useApi from "@/utils/api";

type PuzzleCardProps = {
  item: Puzzle;
  fetchUserPuzzles: (page: number) => Promise<void>;
  pages: {
    currentPage: number;
    maxPage: number;
  };
};

const PuzzleCard = ({ item, fetchUserPuzzles, pages }: PuzzleCardProps) => {
  const api = useApi();
  const { colors } = useTheme();
  const { confirm } = usePuzzle();

  const [isDeleting, setIsDeleting] = useState(false);

  const deletePuzzle = async () => {
    if(isDeleting) return;
    const isOk = await confirm(
      "Confirm Delete",
      "Are you sure you want to delete this puzzle?"
    );
    if (!isOk) return;
    setIsDeleting(true);
    try {
      const response = await api.delete<Response>(
        `/puzzles/delete-puzzle/${item._id}`
      );
      if (response.data.success) {
        console.log(response.data.message);
        fetchUserPuzzles(pages.currentPage);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <View
      className="w-full rounded-xl border-2 p-5 flex-row gap-5"
      style={{ backgroundColor: colors.surface, borderColor: colors.border }}
    >
      <View>
        <Image
          source={{ uri: item.image.url }}
          className="w-32 h-48 rounded-xl"
        />
      </View>
      <View className="flex-1">
        <View className="gap-1">
          <Text
            className="text-xl font-semibold"
            style={{ color: colors.text }}
            numberOfLines={2}
          >
            {item.question}
          </Text>
          <Text
            className="text-lg font-medium"
            style={{ color: colors.textMuted }}
            numberOfLines={1}
          >
            {item.answer}
          </Text>
        </View>
        <View className="flex-row items-center gap-2 mt-1 mb-2">
          <View
            className="py-1 px-3 rounded"
            style={{ backgroundColor: colors.gradients.empty[1] }}
          >
            <Text style={{ color: colors.text }}>{item.category}</Text>
          </View>
          <View
            className="py-1 px-3 rounded"
            style={{ backgroundColor: colors.gradients.empty[1] }}
          >
            <Text style={{ color: colors.text }}>{item.difficulty}</Text>
          </View>
        </View>
        <View className="flex-row gap-4">
          <View className="flex-row gap-2">
            <Ionicons name="thumbs-up" color={colors.text} size={20} />
            <Text className="text-lg" style={{ color: colors.text }}>
              {item.likes.length}
            </Text>
          </View>
          <View className="flex-row gap-2">
            <Ionicons name="thumbs-down" color={colors.text} size={20} />
            <Text className="text-lg" style={{ color: colors.text }}>
              {item.dislikes.length}
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Ionicons name="chatbox" size={20} color={colors.text} />
            <Text className="text-lg" style={{ color: colors.text }}>
              {item.comments.length}
            </Text>
          </View>
        </View>
        <View className="flex-1 flex-row items-center justify-between">
          <Text
            className="text-sm self-end"
            style={{ color: colors.textMuted }}
          >
            {convertDate(item.createdAt)}
          </Text>
          <TouchableOpacity onPress={deletePuzzle}>
            <Ionicons name="trash" size={25} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default PuzzleCard;
