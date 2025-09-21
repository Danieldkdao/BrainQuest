import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import useApi from "@/utils/api";
import { Puzzle, Response } from "@/utils/types";
import { TrainingStatsType } from "./train";

type PuzzleScreenProps = {
  puzzles: Puzzle[];
  currentPuzzle: number;
  pause: boolean;
  setCurrentPuzzle: React.Dispatch<React.SetStateAction<number>>;
  setPause: React.Dispatch<React.SetStateAction<boolean>>;
  setTrainingStats: React.Dispatch<React.SetStateAction<TrainingStatsType>>;
  finish: () => void;
};

type AnswerType = {
  isCorrect: boolean;
  text: string;
};

const PuzzleScreen = ({
  puzzles,
  currentPuzzle,
  pause,
  setCurrentPuzzle,
  setPause,
  setTrainingStats,
  finish,
}: PuzzleScreenProps) => {
  const PointsReference = {
    easy: 1,
    medium: 2,
    hard: 3,
  };

  const api = useApi();
  const { colors } = useTheme();

  const [isCorrect, setIsCorrect] = useState<AnswerType>({
    isCorrect: false,
    text: "",
  });
  const [userRes, setUserRes] = useState("");
  const [loading, setLoading] = useState(false);
  const [noShowPrevAnswer, setNoShowPrevAnswer] = useState(false);

  const checkAnswer = async () => {
    setLoading(true);
    setPause(true);
    try {
      const response = await api.post<
        Response<"correct", { correct: boolean }>
      >("/train/check-answer", {
        response: userRes,
        answer: puzzles[currentPuzzle].answer,
      });

      if (response.data.success) {
        if (response.data.correct === true) {
          const points =
            PointsReference[puzzles[currentPuzzle].difficulty] * 15;
          setTrainingStats((prev) => ({
            ...prev,
            pointsEarned: prev.pointsEarned + points,
            puzzlesSolved: prev.puzzlesSolved + 1,
          }));
        }
        setTrainingStats((prev) => ({
          ...prev,
          puzzlesAttempted: prev.puzzlesAttempted + 1,
        }));
        setIsCorrect({
          text: response.data.message,
          isCorrect: response.data.correct ? response.data.correct : false,
        });
        setNoShowPrevAnswer(true);
      }
      console.log(response.data.message);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const next = () => {
    setNoShowPrevAnswer(false);
    const isDone = currentPuzzle + 1 === puzzles.length;
    if (isDone) {
      setPause(true);
      finish();
      return;
    }
    setUserRes("");
    setCurrentPuzzle((prev) => prev + 1);
    setPause(false);
  };

  return (
    <ScrollView contentContainerClassName="gap-5" className="mt-10">
      <Image
        source={{ uri: puzzles[currentPuzzle].image.url }}
        className="w-full h-[200px] rounded-xl"
      />
      <View
        className="rounded-lg overflow-hidden"
        style={{ display: noShowPrevAnswer ? "flex" : "none" }}
      >
        <LinearGradient
          colors={
            isCorrect.isCorrect
              ? colors.gradients.success
              : colors.gradients.danger
          }
        >
          <Text className="text-lg font-medium text-white py-2 px-4">
            {isCorrect.text}
          </Text>
        </LinearGradient>
      </View>
      <Text className="text-xl font-medium" style={{ color: colors.text }}>
        {puzzles[currentPuzzle].question}
      </Text>
      <TextInput
        value={userRes}
        onChangeText={(text) => setUserRes(text)}
        multiline
        textAlignVertical="top"
        className="border-2 rounded-xl px-4 h-36 text-lg"
        style={{
          backgroundColor: colors.surface,
          borderColor: colors.border,
          color: colors.text,
        }}
      />
      <TouchableOpacity
        disabled={loading}
        onPress={pause ? next : checkAnswer}
        className="rounded-xl overflow-hidden"
        style={{ opacity: loading ? 0.6 : 1 }}
      >
        <LinearGradient className="py-3" colors={colors.gradients.empty}>
          {loading ? (
            <View className="w-full flex-row items-center justify-center gap-2">
              <ActivityIndicator size={25} color={colors.text} />
              <Text className="text-xl font-bold" style={{color: colors.text}}>Checking...</Text>
            </View>
          ) : (
            <Text
              className="text-center text-xl font-bold"
              style={{ color: colors.text }}
            >
              {pause
                ? currentPuzzle + 1 === puzzles.length
                  ? "Finish"
                  : "Next"
                : "Check Answer"}
            </Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
      <TouchableOpacity className="rounded-xl overflow-hidden">
        <LinearGradient
          className="py-3 flex-row items-center justify-center gap-3 w-full"
          colors={colors.gradients.empty}
        >
          <Ionicons name="bulb" size={25} color={colors.text} />
          <Text
            className="text-center text-xl font-bold"
            style={{ color: colors.text }}
          >
            Hint
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default PuzzleScreen;
