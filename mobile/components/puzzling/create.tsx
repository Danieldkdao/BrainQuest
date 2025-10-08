import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { usePuzzle } from "@/hooks/usePuzzle";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import {
  Response,
  type PuzzleCategory,
  type PuzzleDifficulty,
} from "@/utils/types";
import { useUser } from "@clerk/clerk-expo";
import useApi from "@/utils/api";
import { categories, difficulties, toast } from "@/utils/utils";

type InputFieldsType = {
  puzzle: string;
  answer: string;
  category: PuzzleCategory;
  difficulty: PuzzleDifficulty;
  image: string | null;
  imageBase64: string | null;
};

const CreatePage = () => {
  const api = useApi();
  const { user } = useUser();
  const { colors } = useTheme();
  const { changeSelectedComponent } = usePuzzle();

  const [inputFields, setInputFields] = useState<InputFieldsType>({
    puzzle: "",
    answer: "",
    category: "logic",
    difficulty: "easy",
    image: null,
    imageBase64: null,
  });
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    try {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission Denied",
            "We camera library access to upload images."
          );
          return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: "images",
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.5,
          base64: true,
        });

        if (!result.canceled) {
          setInputFields((prev) => ({ ...prev, image: result.assets[0].uri }));
          if (result.assets[0].base64) {
            setInputFields((prev) => ({
              ...prev,
              imageBase64: result.assets[0].base64 as string | null,
            }));
          } else {
            const base64 = await FileSystem.readAsStringAsync(
              result.assets[0].uri,
              {
                encoding: FileSystem.EncodingType.Base64,
              }
            );
            setInputFields((prev) => ({ ...prev, imageBase64: base64 }));
          }
        }
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred while uploading your image.");
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const uriParts = inputFields.image?.split(".");
      const fileType = uriParts && uriParts[uriParts.length - 1];
      const imageType =
        fileType && fileType ? `image/${fileType.toLowerCase()}` : "image/jpeg";

      const imageDataUrl = `data:${imageType};base64,${inputFields.imageBase64}`;
      if (
        inputFields.puzzle.trim() === "" ||
        inputFields.answer.trim() === "" ||
        !imageDataUrl
      ) {
        toast("error", "Missing Information", "All fields must be filled out.");
        return;
      }
      const body = {
        question: inputFields.puzzle,
        answer: inputFields.answer,
        category: inputFields.category,
        difficulty: inputFields.difficulty,
        image: imageDataUrl,
        creator: {
          id: user?.id,
          name: user?.fullName,
          profileImage: user?.imageUrl,
        },
      };
      const response = await api.post<Response>(
        "/puzzles/create-puzzle",
        body,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.success) {
        setInputFields({
          puzzle: "",
          answer: "",
          category: "logic",
          difficulty: "easy",
          image: null,
          imageBase64: null,
        });
        changeSelectedComponent(null);
      }
      toast(
        response.data.success ? "success" : "error",
        response.data.success ? "Success" : "Error",
        response.data.success
          ? "Puzzle created successfully!"
          : "An error occurred while creating your puzzle. Please try again later."
      );
    } catch (error) {
      console.error(error);
      toast(
        "error",
        "Error",
        "An error occurred while creating your puzzle. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="w-full h-full items-center">
      <ScrollView className="w-full" contentContainerClassName="pb-10">
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
            Create
          </Text>
        </View>
        <View className="gap-4 mt-5">
          <Text className="text-xl font-medium" style={{ color: colors.text }}>
            Puzzle
          </Text>
          <TextInput
            value={inputFields.puzzle}
            onChangeText={(text) =>
              setInputFields((prev) => ({ ...prev, puzzle: text }))
            }
            placeholder="Enter the puzzle/riddle/brain teaser here"
            placeholderTextColor={colors.textMuted}
            multiline
            textAlignVertical="top"
            className="border-2 px-4 h-48 rounded-xl text-lg"
            style={{
              color: colors.text,
              borderColor: colors.border,
              backgroundColor: colors.surface,
            }}
          />
          <Text className="text-xl font-medium" style={{ color: colors.text }}>
            Answer
          </Text>
          <TextInput
            value={inputFields.answer}
            onChangeText={(text) =>
              setInputFields((prev) => ({ ...prev, answer: text }))
            }
            placeholder="Enter the puzzle answer here"
            placeholderTextColor={colors.textMuted}
            multiline
            textAlignVertical="top"
            className="border-2 px-4 h-28 rounded-xl text-lg"
            style={{
              color: colors.text,
              borderColor: colors.border,
              backgroundColor: colors.surface,
            }}
          />
          <Text className="text-xl font-medium" style={{ color: colors.text }}>
            Puzzle Image
          </Text>
          <TouchableOpacity
            className="rounded-xl flex-col items-center justify-center border-2 h-52"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
            }}
            onPress={pickImage}
          >
            {inputFields.image ? (
              <Image
                source={{ uri: inputFields.image }}
                className="w-full h-full rounded-xl"
              />
            ) : (
              <>
                <Ionicons
                  name="image-outline"
                  color={colors.textMuted}
                  size={48}
                />
                <Text className="text-lg" style={{ color: colors.textMuted }}>
                  Upload your image
                </Text>
              </>
            )}
          </TouchableOpacity>
          <Text className="text-xl font-medium" style={{ color: colors.text }}>
            Category
          </Text>
          <View className="flex-row flex-wrap gap-3">
            {categories.map((item) => {
              const isSelected = item.category === inputFields.category;
              return (
                <TouchableOpacity
                  onPress={() =>
                    setInputFields((prev) => ({
                      ...prev,
                      category: item.category,
                    }))
                  }
                  key={item.id}
                  className="py-3 px-4 rounded-xl border-2 flex flex-row items-center gap-2"
                  style={{
                    backgroundColor: isSelected ? colors.text : colors.surface,
                    borderColor: isSelected ? colors.text : colors.border,
                  }}
                >
                  <Ionicons
                    name={item.iconName}
                    color={isSelected ? colors.bg : colors.textMuted}
                    size={20}
                  />
                  <Text
                    className="text-lg"
                    style={{ color: isSelected ? colors.bg : colors.textMuted }}
                  >
                    {item.category[0].toUpperCase() +
                      item.category
                        .split("")
                        .filter((_, i) => i !== 0)
                        .join("")}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <Text className="text-xl font-medium" style={{ color: colors.text }}>
            Difficulty
          </Text>
          <View className="flex-row flex-wrap gap-3">
            {difficulties.map((item) => {
              const isSelected = item.difficulty === inputFields.difficulty;
              return (
                <TouchableOpacity
                  key={item.id}
                  className="py-3 px-4 rounded-xl border-2 flex flex-row items-center gap-2"
                  style={{
                    backgroundColor: isSelected ? colors.text : colors.surface,
                    borderColor: isSelected ? colors.text : colors.border,
                  }}
                  onPress={() =>
                    setInputFields((prev) => ({
                      ...prev,
                      difficulty: item.difficulty,
                    }))
                  }
                >
                  <Ionicons
                    name={item.iconName}
                    color={isSelected ? colors.bg : colors.textMuted}
                    size={20}
                  />
                  <Text
                    className="text-lg"
                    style={{ color: isSelected ? colors.bg : colors.textMuted }}
                  >
                    {item.difficulty[0].toUpperCase() +
                      item.difficulty
                        .split("")
                        .filter((_, i) => i !== 0)
                        .join("")}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <TouchableOpacity
            disabled={loading}
            onPress={handleSubmit}
            className="rounded-xl border-2 py-3 mt-6"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? (
              <View className="flex-row items-center gap-2 justify-center">
                <ActivityIndicator color={colors.text} size={25} />
                <Text
                  className="text-xl font-bold text-center"
                  style={{ color: colors.text }}
                >
                  Creating...
                </Text>
              </View>
            ) : (
              <Text
                className="text-xl font-bold text-center"
                style={{ color: colors.text }}
              >
                Create Puzzle
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default CreatePage;
