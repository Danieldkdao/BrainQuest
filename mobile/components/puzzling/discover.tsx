import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { usePuzzle } from "@/hooks/usePuzzle";
import { Ionicons } from "@expo/vector-icons";
import { Puzzle, Response } from "@/utils/types";
import useApi from "@/utils/api";
import PuzzleCard from "./puzzle-card";

const DiscoverPage = () => {
  const api = useApi();
  const { colors } = useTheme();
  const { changeSelectedComponent, categories } = usePuzzle();

  const [popularPuzzles, setPopularPuzzles] = useState<Puzzle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [popularPuzzlesResponse] = await Promise.all([
        api.get<Response<"popularPuzzles", { popularPuzzles: Puzzle[] }>>(
          "/puzzles/get-popular-puzzles"
        ),
      ]);
      if (
        popularPuzzlesResponse.data.success &&
        popularPuzzlesResponse.data.popularPuzzles
      ) {
        setPopularPuzzles(popularPuzzlesResponse.data.popularPuzzles);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="w-full h-full">
      <View className="flex-row justify-center relative py-2">
        <TouchableOpacity
          className="justify-self-start absolute left-0 top-0 bottom-0 justify-center"
          style={{
            zIndex: 100,
          }}
          onPress={() => changeSelectedComponent(null)}
        >
          <Ionicons name="arrow-back-circle" color={colors.text} size={45} />
        </TouchableOpacity>
        <Text
          className="text-3xl font-bold"
          style={{
            color: colors.text,
          }}
        >
          Discover
        </Text>
      </View>
      <ScrollView
        horizontal
        className="flex-none"
        contentContainerClassName="flex-row items-start justify-start gap-2"
      >
        {categories.map((item) => {
          return (
            <View
              key={item.id}
              className="py-5 rounded-xl border-2 items-center w-28"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
              }}
            >
              <Ionicons name={item.iconName} size={30} color={colors.text} />
              <Text
                className="text-xl font-medium"
                style={{ color: colors.text }}
              >
                {item.category.toUpperCase()[0] +
                  item.category
                    .split("")
                    .filter((_, i) => i !== 0)
                    .join("")}
              </Text>
            </View>
          );
        })}
      </ScrollView>
      <View>
        <Text className="text-2xl font-bold" style={{ color: colors.text }}>
          Popular
        </Text>
        {loading ? (
          <ActivityIndicator color={colors.text} size={50} className="mt-32" />
        ) : (
          <View className="gap-3">
            {popularPuzzles.map((item) => {
              return <PuzzleCard key={item._id} item={item} />;
            })}
          </View>
        )}
      </View>
    </View>
  );
};

export default DiscoverPage;
