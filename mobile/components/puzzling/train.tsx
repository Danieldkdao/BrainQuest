import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { usePuzzle } from "@/hooks/usePuzzle";
import { Ionicons } from "@expo/vector-icons";
import ReactNativeModal from "react-native-modal";
import { LinearGradient } from "expo-linear-gradient";
import {
  type PuzzleDifficulty,
  type PuzzleCategory,
  Puzzle,
  Response,
} from "@/utils/types";
import PuzzleScreen from "./puzzle-screen";
import useApi from "@/utils/api";

type SettingsType = {
  difficulties: PuzzleDifficulty[];
  categories: PuzzleCategory[];
  answerAfterPuzzle: boolean;
  hints: boolean;
  timePerQuestion: string;
  timeLimit: string | number;
};

export type TrainingStatsType = {
  pointsEarned: number;
  puzzlesSolved: number;
  puzzlesAttempted: number;
};

const TrainPage = () => {
  const api = useApi();
  const { colors } = useTheme();
  const {
    changeSelectedComponent,
    confirm,
    categories,
    difficulties,
    fetchPuzzles,
  } = usePuzzle();

  const [settings, setSettings] = useState<SettingsType>({
    difficulties: [],
    categories: [],
    answerAfterPuzzle: true,
    hints: true,
    timePerQuestion: "",
    timeLimit: "",
  });
  const [trainingStats, setTrainingStats] = useState<TrainingStatsType>({
    pointsEarned: 0,
    puzzlesSolved: 0,
    puzzlesAttempted: 0,
  });
  const [startSession, setStartSession] = useState(false);
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [pause, setPause] = useState(false);
  const [end, setEnd] = useState(false);

  useEffect(() => {
    if (typeof settings.timeLimit === "string") return;
    const timer = setTimeout(() => {
      if (pause) return;
      if (settings.timeLimit === 0) {
        finish();
        return;
      }
      setSettings((prev) => ({
        ...prev,
        timeLimit: Number(prev.timeLimit) - 1,
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [startSession, pause, settings.timeLimit]);

  const saveSession = async (leave: boolean) => {
    setLoading(true);
    try {
      const times = calcTimeTaken();
      const body = {
        pointsEarned: trainingStats.pointsEarned,
        puzzlesAttempted: trainingStats.puzzlesAttempted,
        puzzlesSolved: trainingStats.puzzlesSolved,
        timeLimit: times.timeLimit,
        timeTaken: times.timeTaken,
      };
      const response = await api.post<Response>("/train/save-session", body);
      if (response.data.success) {
        if (leave) {
          changeSelectedComponent(null);
        } else {
          reset();
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const confirmQuit = async () => {
    const isOk = await confirm(
      "Confirm leave",
      "Are you sure you want to quit now? All your progress will be lost."
    );
    if (!isOk) return;

    changeSelectedComponent(null);
  };

  const start = async () => {
    setLoading(true);
    const noLimit = settings.timePerQuestion.trim() === "";
    if (!noLimit && !Number(settings.timePerQuestion)) {
      setLoading(false);
      console.log("invalid time");
      return;
    }
    const response = await fetchPuzzles(
      settings.categories,
      settings.difficulties
    );
    if (!response || response.length === 0) {
      setLoading(false);
      console.log("no response");
      return;
    }
    const timeLimit = noLimit
      ? "None"
      : Number(settings.timePerQuestion) * response.length;
    setSettings((prev) => ({ ...prev, timeLimit }));
    setPuzzles(response);
    setStartSession(true);
    setPause(false);
    setLoading(false);
  };

  const reset = () => {
    setSettings({
      difficulties: [],
      categories: [],
      answerAfterPuzzle: true,
      hints: true,
      timePerQuestion: "",
      timeLimit: "",
    });
    setTrainingStats({
      pointsEarned: 0,
      puzzlesSolved: 0,
      puzzlesAttempted: 0,
    });
    setPuzzles([]);
    setCurrentPuzzle(0);
    setEnd(false);
  };

  const finish = () => {
    setEnd(true);
    setStartSession(false);
  };

  const calcTimeTaken = () => {
    if (settings.timeLimit === "None")
      return { timeLimit: "None", timeTaken: "None Specified" };
    const timeTaken =
      Number(settings.timePerQuestion) * puzzles.length -
      Number(settings.timeLimit);
    const timeLimit = Number(settings.timePerQuestion) * puzzles.length;
    const timeTakenString = `${String(Math.floor(timeTaken / 60)).padStart(2, "0")}:${String(timeTaken % 60).padStart(2, "0")}`;
    const timeLimitString = `${String(Math.floor(timeLimit / 60)).padStart(2, "0")}:${String(timeLimit % 60).padStart(2, "0")}`;
    return { timeTaken: timeTakenString, timeLimit: timeLimitString };
  };

  return (
    <View className="w-full h-full items-center">
      <ReactNativeModal isVisible={!startSession} animationOut="slideOutUp">
        <View className="items-center justify-center h-full w-full">
          {end ? (
            <View
              className="p-5 rounded-xl w-[80%] items-center gap-1"
              style={{ backgroundColor: colors.surface }}
            >
              <Ionicons
                name="checkmark-circle"
                size={80}
                color={colors.success}
              />
              <Text
                className="text-3xl font-bold text-center"
                style={{ color: colors.text }}
              >
                Training Complete!
              </Text>
              <Text
                className="text-2xl font-bold my-3"
                style={{ color: colors.text }}
              >
                Points Earned: {trainingStats.pointsEarned}
              </Text>
              <Text className="text-lg" style={{ color: colors.text }}>
                Time Taken:{" "}
                <Text className="text-xl font-medium">
                  {calcTimeTaken().timeTaken}
                </Text>
              </Text>
              <Text className="text-lg" style={{ color: colors.text }}>
                Puzzles Attempted:{" "}
                <Text className="text-xl font-medium">
                  {trainingStats.puzzlesAttempted}
                </Text>
              </Text>
              <Text className="text-lg" style={{ color: colors.text }}>
                Puzzles Solved:{" "}
                <Text className="text-xl font-medium">
                  {trainingStats.puzzlesSolved}
                </Text>
              </Text>
              <View className="flex-row gap-3 mt-3">
                <TouchableOpacity
                  disabled={loading}
                  className="flex-1 rounded-xl overflow-hidden"
                  onPress={() => saveSession(true)}
                  style={{ opacity: loading ? 0.6 : 1 }}
                >
                  <LinearGradient
                    colors={colors.gradients.danger}
                    className="py-3"
                  >
                    {loading ? (
                      <ActivityIndicator color="white" size={25} />
                    ) : (
                      <Text className="text-center text-xl font-semibold text-white">
                        Leave
                      </Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={loading}
                  onPress={() => saveSession(false)}
                  className="flex-1 rounded-xl overflow-hidden"
                  style={{ opacity: loading ? 0.6 : 1 }}
                >
                  <LinearGradient
                    colors={colors.gradients.success}
                    className=" py-3"
                  >
                    {loading ? (
                      <ActivityIndicator color="white" size={25} />
                    ) : (
                      <Text className="text-center text-xl font-semibold text-white">
                        Start New
                      </Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View
              className="w-full rounded-xl p-5 gap-5"
              style={{ backgroundColor: colors.surface }}
            >
              <View className="flex-row items-center justify-between">
                <Text
                  className="text-3xl font-bold"
                  style={{ color: colors.text }}
                >
                  Settings
                </Text>
                <TouchableOpacity onPress={() => changeSelectedComponent(null)}>
                  <Ionicons name="close-circle" size={32} color={colors.text} />
                </TouchableOpacity>
              </View>
              <Text style={{ color: colors.textMuted }}>
                Note: Selecting none of the fields will select all of them by
                default.
              </Text>
              <Text
                className="text-xl font-medium"
                style={{ color: colors.text }}
              >
                Diffculty Level
              </Text>
              <View className="flex-row flex-wrap gap-3">
                {difficulties.map((item) => {
                  const isSelected = settings.difficulties.includes(
                    item.difficulty
                  );
                  return (
                    <TouchableOpacity
                      onPress={() =>
                        setSettings((prev) => {
                          if (prev.difficulties.includes(item.difficulty)) {
                            return {
                              ...prev,
                              difficulties: prev.difficulties.filter(
                                (c) => c !== item.difficulty
                              ),
                            };
                          }

                          return {
                            ...prev,
                            difficulties: [
                              ...prev.difficulties,
                              item.difficulty,
                            ],
                          };
                        })
                      }
                      key={item.id}
                      className="py-3 px-4 rounded-xl border-2 flex flex-row items-center gap-2"
                      style={{
                        backgroundColor: isSelected
                          ? colors.text
                          : colors.surface,
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
                        style={{
                          color: isSelected ? colors.bg : colors.textMuted,
                        }}
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
              <Text
                className="text-xl font-medium"
                style={{ color: colors.text }}
              >
                Included Categories
              </Text>
              <View className="flex-row flex-wrap gap-3">
                {categories.map((item) => {
                  const isSelected = settings.categories.includes(
                    item.category
                  );
                  return (
                    <TouchableOpacity
                      onPress={() =>
                        setSettings((prev) => {
                          if (prev.categories.includes(item.category)) {
                            return {
                              ...prev,
                              categories: prev.categories.filter(
                                (c) => c !== item.category
                              ),
                            };
                          }
                          return {
                            ...prev,
                            categories: [...prev.categories, item.category],
                          };
                        })
                      }
                      key={item.id}
                      className="py-3 px-4 rounded-xl border-2 flex flex-row items-center gap-2"
                      style={{
                        backgroundColor: isSelected
                          ? colors.text
                          : colors.surface,
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
                        style={{
                          color: isSelected ? colors.bg : colors.textMuted,
                        }}
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
              <View>
                <View className="flex-row items-center gap-3">
                  <Text
                    className="text-xl font-medium"
                    style={{ color: colors.text }}
                  >
                    Show Answer After Puzzle
                  </Text>
                  <Switch
                    value={settings.answerAfterPuzzle}
                    onChange={() =>
                      setSettings((prev) => ({
                        ...prev,
                        answerAfterPuzzle: !prev.answerAfterPuzzle,
                      }))
                    }
                  />
                </View>
                <View className="flex-row items-center gap-3">
                  <Text
                    className="text-xl font-medium"
                    style={{ color: colors.text }}
                  >
                    Hints
                  </Text>
                  <Switch
                    value={settings.hints}
                    onChange={() =>
                      setSettings((prev) => ({ ...prev, hints: !prev.hints }))
                    }
                  />
                </View>
                <View className="gap-3 mt-4">
                  <Text
                    className="text-xl font-medium"
                    style={{ color: colors.text }}
                  >
                    Time Limit Per Question
                  </Text>
                  <Text style={{ color: colors.textMuted }}>
                    Enter in seconds. If you don't want one, leave it blank.
                  </Text>
                  <TextInput
                    placeholder="300"
                    placeholderTextColor={colors.textMuted}
                    value={settings.timePerQuestion}
                    onChangeText={(text) =>
                      setSettings((prev) => ({
                        ...prev,
                        timePerQuestion: text,
                      }))
                    }
                    className="border-2 self-start w-28 px-4 text-xl rounded-xl"
                    style={{ color: colors.text, borderColor: colors.border }}
                  />
                </View>
              </View>
              <TouchableOpacity
                disabled={loading}
                onPress={start}
                className="w-full rounded-xl overflow-hidden"
                style={{
                  borderColor: colors.border,
                  opacity: loading ? 0.6 : 1,
                }}
              >
                <LinearGradient
                  className="py-3"
                  colors={colors.gradients.empty}
                >
                  {loading ? (
                    <ActivityIndicator color={colors.text} size={25} />
                  ) : (
                    <Text
                      className="text-xl font-bold text-center"
                      style={{ color: colors.text }}
                    >
                      Begin
                    </Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ReactNativeModal>

      <ScrollView className="w-full" contentContainerClassName="pb-10">
        <View className="flex-row justify-center relative py-2">
          <TouchableOpacity
            className="absolute left-0 top-0 bottom-0 justify-center"
            style={{
              zIndex: 100,
            }}
            onPress={confirmQuit}
          >
            <Ionicons
              name="exit-outline"
              color={colors.text}
              size={45}
              className="rotate-180"
            />
          </TouchableOpacity>
          <Text
            className="text-3xl font-bold"
            style={{
              color: colors.text,
            }}
          >
            Train
          </Text>
          <View className="absolute right-0 top-0 bottom-0 justify-center">
            <Text className="text-lg" style={{ color: colors.text }}>
              {typeof settings.timeLimit === "string"
                ? settings.timeLimit
                : `${String(Math.floor(settings.timeLimit / 60)).padStart(2, "0")}:${String(settings.timeLimit % 60).padStart(2, "0")}`}
            </Text>
          </View>
        </View>
        <Text className="text-center text-xl" style={{ color: colors.text }}>
          {startSession && `${currentPuzzle + 1} of ${puzzles.length} puzzles`}
        </Text>
        {startSession ? (
          <PuzzleScreen
            puzzles={puzzles}
            currentPuzzle={currentPuzzle}
            pause={pause}
            setCurrentPuzzle={setCurrentPuzzle}
            setPause={setPause}
            setTrainingStats={setTrainingStats}
            finish={finish}
          />
        ) : (
          <View></View>
        )}
      </ScrollView>
    </View>
  );
};

export default TrainPage;
