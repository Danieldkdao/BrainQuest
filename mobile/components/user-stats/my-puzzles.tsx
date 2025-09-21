import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { Puzzle, Response } from "@/utils/types";
import PuzzleCard from "./puzzle-card";
import useApi from "@/utils/api";
import { Ionicons } from "@expo/vector-icons";

type PagesType = {
  currentPage: number;
  maxPage: number;
};

const MyPuzzlesPage = () => {
  const api = useApi();
  const { colors } = useTheme();

  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const [pages, setPages] = useState<PagesType>({
    currentPage: 0,
    maxPage: 1,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserPuzzles(0);
  }, []);

  const fetchUserPuzzles = async (page: number) => {
    setLoading(true);
    try {
      const response = await api.get<
        Response<"puzzles" | "pages", { puzzles: Puzzle[]; pages: number }>
      >(`/puzzles/get-user-puzzles?limit=${5}&page=${page}`);
      if (response.data.success && response.data.puzzles) {
        console.log(response.data.puzzles);
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
        <View className="">
          <Text>No Puzzles Added Yet</Text>
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
