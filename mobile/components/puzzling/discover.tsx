import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  TextInput,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { usePuzzle } from "@/hooks/usePuzzle";
import { Ionicons } from "@expo/vector-icons";
import {
  type Puzzle,
  type Response,
  type Category,
  type PuzzleCategory,
  type PuzzleDifficulty,
} from "@/utils/types";
import useApi from "@/utils/api";
import PuzzleCard from "./puzzle-card";
import { categories, difficulties, toast } from "@/utils/utils";
import { ReactNativeModal } from "react-native-modal";
import { useWaitedText } from "@/hooks/useWaitedText";

const DiscoverPage = () => {
  const api = useApi();
  const { colors } = useTheme();
  const { changeSelectedComponent } = usePuzzle();

  const pageSize = 4;

  const [popularPuzzles, setPopularPuzzles] = useState<Puzzle[]>([]);
  const [categoryPuzzles, setCategoryPuzzles] = useState<Puzzle[]>([]);
  const [searchPuzzles, setSearchPuzzles] = useState<Puzzle[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [infiniteScrollLoad, setInfiniteScrollLoad] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category>(
    categories[0]
  );
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<
    PuzzleCategory[]
  >([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<
    PuzzleDifficulty[]
  >([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  const waitedText = useWaitedText(search, 2000);

  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
    if (loading) return;
    const wait = async () => {
      setCategoryLoading(true);
      await getCategoryPuzzles();
      setCategoryLoading(false);
    };

    wait();
  }, [selectedCategory]);

  useEffect(() => {
    fetchPuzzles(0, true);
  }, [waitedText, selectedCategories, selectedDifficulties]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      await Promise.all([getPopularPuzzles(), getCategoryPuzzles()]);
    } catch (error) {
      console.error(error);
      toast(
        "error",
        "Fetch error",
        "Error fetching puzzles. Please come back later."
      );
    } finally {
      setLoading(false);
    }
  };

  const getPopularPuzzles = async () => {
    try {
      const response = await api.get<
        Response<"popularPuzzles", { popularPuzzles: Puzzle[] }>
      >("/puzzles/get-popular-puzzles");
      if (response.data.success && response.data.popularPuzzles) {
        setPopularPuzzles(response.data.popularPuzzles);
        return;
      }
      toast(
        "error",
        "Fetch error",
        "Error fetching popular puzzles. Please come back later."
      );
    } catch (error) {
      console.error(error);
      toast(
        "error",
        "Fetch error",
        "Error fetching popular puzzles. Please come back later."
      );
    }
  };

  const getCategoryPuzzles = async () => {
    try {
      const response = await api.get<
        Response<"puzzles", { puzzles: Puzzle[] }>
      >(
        `/puzzles/get-discover-category-puzzles?category=${selectedCategory.category}`
      );
      if (response.data.success && response.data.puzzles) {
        setCategoryPuzzles(response.data.puzzles);
        return;
      }
      toast(
        "error",
        "Fetch error",
        "Error fetching category puzzles. Please come back later."
      );
    } catch (error) {
      console.error(error);
      toast(
        "error",
        "Fetch error",
        "Error fetching category puzzles. Please come back later."
      );
    }
  };

  const fetchPuzzles = async (pageNum: number, isRefresh = false) => {
    if (infiniteScrollLoad || (!isRefresh && !hasMore)) return;
    setInfiniteScrollLoad(true);
    try {
      const response = await api.post<
        Response<"puzzles", { puzzles: Puzzle[] }>
      >("/puzzles/get-scroll-puzzles", {
        search: waitedText,
        categories: selectedCategories,
        difficulties: selectedDifficulties,
        skip: pageNum * pageSize,
        limit: pageSize,
      });
      if (response.data.success && response.data.puzzles) {
        if (isRefresh) {
          setSearchPuzzles(response.data.puzzles);
        } else {
          setSearchPuzzles((p) => [
            ...p,
            ...(response.data.puzzles as Puzzle[]),
          ]);
        }
        setHasMore(response.data.puzzles.length === pageSize);
        setPage(pageNum);
        return;
      }
      toast(
        "error",
        "Fetch error",
        "Error fetching puzzles. Please come back later."
      );
    } catch (error) {
      console.error(error);
      toast(
        "error",
        "Fetch error",
        "Error fetching puzzles. Please come back later."
      );
    } finally {
      setInfiniteScrollLoad(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchPuzzles(page + 1);
    }
  };

  const refresh = async () => {
    setPage(0);
    setHasMore(true);
    await fetchPuzzles(0, true);
  };

  return (
    <ScrollView
      className="w-full h-full"
      contentContainerClassName="gap-4 pb-10"
    >
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
        <TouchableOpacity
          className="justify-self-start absolute right-0 top-0 bottom-0 justify-center"
          style={{
            zIndex: 100,
          }}
          onPress={() => setShowSearchModal(!showSearchModal)}
        >
          <Ionicons name="search" color={colors.text} size={45} />
        </TouchableOpacity>
      </View>
      <ReactNativeModal
        isVisible={showSearchModal}
        animationIn="zoomIn"
        animationOut="zoomOut"
      >
        <View className="h-full w-full items-center justify-center">
          <View
            className="w-full p-5 rounded-xl gap-4"
            style={{ backgroundColor: colors.bg }}
          >
            <View className="flex-row items-center justify-between">
              <Text
                className="text-3xl font-bold"
                style={{ color: colors.text }}
              >
                Search
              </Text>
              <TouchableOpacity onPress={() => setShowSearchModal(false)}>
                <Ionicons name="close" color={colors.text} size={32} />
              </TouchableOpacity>
            </View>
            <TextInput
              className="border rounded-xl text-xl px-4"
              placeholder="Search for puzzles by question"
              placeholderTextColor={colors.textMuted}
              value={search}
              onChangeText={(text) => setSearch(text)}
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
                color: colors.text,
              }}
            />
            <Text className="text-xl font-bold" style={{ color: colors.text }}>
              Filter By
            </Text>
            <View className="gap-2">
              <Text
                className="text-xl font-medium"
                style={{ color: colors.textMuted }}
              >
                Category
              </Text>
              <ScrollView horizontal contentContainerClassName="flex-row gap-4">
                {categories.map((item) => {
                  const isSelected = selectedCategories.includes(item.category);
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        isSelected
                          ? setSelectedCategories((p) =>
                              p.filter((c) => c !== item.category)
                            )
                          : setSelectedCategories((p) => [...p, item.category]);
                      }}
                      key={item.id}
                      className="px-4 py-2 rounded-xl"
                      style={{
                        backgroundColor: isSelected
                          ? colors.textMuted
                          : colors.surface,
                      }}
                    >
                      <Text
                        style={{
                          color: isSelected ? colors.surface : colors.textMuted,
                        }}
                      >
                        {item.category.charAt(0).toUpperCase() +
                          item.category.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
            <View className="gap-2">
              <Text
                className="text-xl font-medium"
                style={{ color: colors.textMuted }}
              >
                Difficulty
              </Text>
              <ScrollView horizontal contentContainerClassName="flex-row gap-4">
                {difficulties.map((item) => {
                  const isSelected = selectedDifficulties.includes(
                    item.difficulty
                  );
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        isSelected
                          ? setSelectedDifficulties((p) =>
                              p.filter((p) => p !== item.difficulty)
                            )
                          : setSelectedDifficulties((p) => [
                              ...p,
                              item.difficulty,
                            ]);
                      }}
                      key={item.id}
                      className="px-4 py-2 rounded-xl"
                      style={{
                        backgroundColor: isSelected
                          ? colors.textMuted
                          : colors.surface,
                      }}
                    >
                      <Text
                        style={{
                          color: isSelected ? colors.surface : colors.textMuted,
                        }}
                      >
                        {item.difficulty.charAt(0).toUpperCase() +
                          item.difficulty.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
            <FlatList
              className="max-h-[500] w-full"
              contentContainerClassName="gap-4 flex-row flex-wrap items-center justify-center pb-10 w-full"
              keyExtractor={(item) => item._id}
              data={searchPuzzles}
              renderItem={({ item }) => (
                <PuzzleCard key={item._id} width={160} item={item} />
              )}
              onEndReached={loadMore}
              onEndReachedThreshold={0.5}
              refreshing={loading && page === 0}
              onRefresh={refresh}
              ListFooterComponent={
                infiniteScrollLoad && page >= 0 ? (
                  <View className="items-center justify-center w-full">
                    <ActivityIndicator color={colors.text} size={50} />
                  </View>
                ) : null
              }
              ListEmptyComponent={
                !infiniteScrollLoad ? (
                  <View
                    className="w-full items-center justify-center p-4 border-2 rounded-xl gap-2"
                    style={{
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                    }}
                  >
                    <Ionicons name="book" color={colors.text} size={25} />
                    <Text
                      className="text-xl font-medium text-center"
                      style={{ color: colors.text }}
                    >
                      No items found matching those parameters! Try something
                      else.
                    </Text>
                  </View>
                ) : null
              }
            />
          </View>
        </View>
      </ReactNativeModal>
      <ScrollView
        horizontal
        className="flex-none"
        contentContainerClassName="flex-row items-start justify-start gap-2"
      >
        {categories.map((item) => {
          const isSelected = selectedCategory.id === item.id;
          return (
            <TouchableOpacity
              onPress={() => setSelectedCategory(item)}
              key={item.id}
              className="py-5 rounded-xl border-2 items-center w-28"
              style={{
                backgroundColor: isSelected ? colors.text : colors.surface,
                borderColor: isSelected ? colors.text : colors.border,
              }}
            >
              <Ionicons
                name={item.iconName}
                size={30}
                color={isSelected ? colors.bg : colors.text}
              />
              <Text
                className="text-xl font-medium"
                style={{ color: isSelected ? colors.bg : colors.text }}
              >
                {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <View className="gap-4">
        <Text className="text-2xl font-bold" style={{ color: colors.text }}>
          Popular
        </Text>
        {loading ? (
          <ActivityIndicator color={colors.text} size={50} className="mt-32" />
        ) : (
          <ScrollView horizontal contentContainerClassName="gap-4 flex-row">
            {popularPuzzles.map((item) => {
              return <PuzzleCard key={item._id} width={240} item={item} />;
            })}
          </ScrollView>
        )}
      </View>
      <View className="gap-4">
        <Text className="text-2xl font-bold" style={{ color: colors.text }}>
          {selectedCategory.category.charAt(0).toUpperCase() +
            selectedCategory.category.slice(1)}
        </Text>
        {loading || categoryLoading ? (
          <ActivityIndicator color={colors.text} size={50} className="mt-32" />
        ) : (
          <ScrollView horizontal contentContainerClassName="gap-4 flex-row">
            {categoryPuzzles.map((item) => {
              return <PuzzleCard key={item._id} width={240} item={item} />;
            })}
          </ScrollView>
        )}
      </View>
    </ScrollView>
  );
};

export default DiscoverPage;
