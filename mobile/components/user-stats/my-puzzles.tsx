import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { Puzzle, Response } from "@/utils/types";
import PuzzleCard from "./puzzle-card";
import useApi from "@/utils/api";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { usePuzzle } from "@/hooks/usePuzzle";
import { useRouter } from "expo-router";
import CreatePage from "../puzzling/create";

type PagesType = {
  currentPage: number;
  maxPage: number;
};

const MyPuzzlesPage = () => {
  const api = useApi();
  const { colors } = useTheme();
  const { changeSelectedComponent } = usePuzzle();
  const router = useRouter();

  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const [pages, setPages] = useState<PagesType>({
    currentPage: 0,
    maxPage: 1,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserPuzzles(0);
  }, []);

  const redirectCreate = () => {
    router.push("/(main)/puzzling");
    changeSelectedComponent(<CreatePage />);
  };

  const fetchUserPuzzles = async (page: number) => {
    setLoading(true);
    try {
      const response = await api.get<
        Response<"puzzles" | "pages", { puzzles: Puzzle[]; pages: number }>
      >(`/puzzles/get-user-puzzles?limit=${5}&page=${page}`);
      if (response.data.success && response.data.puzzles) {
        setPuzzles(response.data.puzzles);
        setPages((prev) => ({
          ...prev,
          maxPage: response.data.pages === 0 ? 1 : response.data.pages!,
        }));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const paginateUp = () => {
    if (pages.currentPage + 1 === pages.maxPage) return;
    setPages((prev) => ({ ...prev, currentPage: prev.currentPage + 1 }));
    fetchUserPuzzles(pages.currentPage + 1);
  };

  const paginateDown = () => {
    if (pages.currentPage - 1 < 0) return;
    setPages((prev) => ({ ...prev, currentPage: prev.currentPage - 1 }));
    fetchUserPuzzles(pages.currentPage - 1);
  };

  return (
    <View className="w-[90%] pb-10">
      <View className="justify-between items-center flex-row mb-5">
        <Text className="text-3xl font-bold" style={{ color: colors.text }}>
          My Puzzles
        </Text>
        <View className="flex-row items-center gap-2">
          <TouchableOpacity onPress={paginateDown}>
            <Ionicons
              name="chevron-back-circle"
              color={colors.text}
              size={36}
            />
          </TouchableOpacity>
          <Text className="text-xl font-medium" style={{ color: colors.text }}>
            {pages.currentPage + 1} of {pages.maxPage}
          </Text>
          <TouchableOpacity onPress={paginateUp}>
            <Ionicons
              name="chevron-forward-circle"
              color={colors.text}
              size={36}
            />
          </TouchableOpacity>
        </View>
      </View>
      {loading ? (
        <ActivityIndicator color={colors.text} size={50} className="mt-52" />
      ) : puzzles.length === 0 ? (
        <View
          className="border-2 p-5 rounded-xl items-center gap-2"
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
          }}
        >
          <Ionicons name="extension-puzzle" color={colors.text} size={70} />
          <Text className="text-2xl font-bold" style={{ color: colors.text }}>
            No Puzzles Added Yet
          </Text>
          <Text className="text-center" style={{ color: colors.textMuted }}>
            Create your first puzzle to use in training and share with the
            community!
          </Text>
          <TouchableOpacity
            onPress={redirectCreate}
            className="rounded-xl overflow-hidden"
          >
            <LinearGradient
              className="flex-row items-center gap-2 py-2 px-4"
              colors={colors.gradients.empty}
            >
              <Ionicons name="add-circle" color={colors.text} size={30} />
              <Text
                className="text-xl font-medium"
                style={{ color: colors.text }}
              >
                Create Puzzle
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="gap-4">
          {puzzles.map((item) => {
            return (
              <PuzzleCard
                key={item._id}
                item={item}
                fetchUserPuzzles={fetchUserPuzzles}
                pages={pages}
              />
            );
          })}
        </View>
      )}
    </View>
  );
};

export default MyPuzzlesPage;
