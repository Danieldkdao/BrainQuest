import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { usePuzzle } from "@/hooks/usePuzzle";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import ChallengeCard from "./challenge-card";
import useApi from "@/utils/api";
import { type Response, type Challenge } from "@/utils/types";
import { toast } from "@/utils/utils";

export const calcMins = (time: number) => {
  return Math.floor((time - Math.floor(time / 3600) * 3600) / 60);
};

export const calcSeconds = (time: number) => {
  return (time - Math.floor(time / 3600) * 3600) % 60;
};

const ChallengePage = () => {
  const api = useApi();
  const { colors } = useTheme();
  const { changeSelectedComponent } = usePuzzle();

  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState(24 * 60 * 60);

  useEffect(() => {
    fetchDailyChallenges();
  }, []);

  useEffect(() => {
    const now = Date.now();
    const endOfDay = new Date(now);
    endOfDay.setHours(24, 0, 0, 0);
    const timeToEndOfDay = endOfDay.getTime() - now;
    setTimer(Math.floor(timeToEndOfDay / 1000));
    const interval = setInterval(async () => {
      if (timer === 0) {
        await fetchDailyChallenges();
        setTimer(24 * 60 * 60);
        return;
      }
      setTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const fetchDailyChallenges = async () => {
    setLoading(true);
    try {
      const response = await api.get<
        Response<"challenges", { challenges: Challenge[] }>
      >("/challenges/get-daily-challenges");
      if (response.data.success && response.data.challenges) {
        setChallenges(response.data.challenges);
        return;
      }
      toast(
        "error",
        "Fetch error",
        "Error fetching daily challenges. Please come back later."
      );
    } catch (error) {
      console.error(error);
      toast(
        "error",
        "Fetch error",
        "Error fetching daily challenges. Please come back later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="h-full w-full gap-4">
      <View className="flex-row justify-center relative py-2">
        <TouchableOpacity
          className="absolute left-0 top-0 bottom-0 justify-center"
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
          Challenges
        </Text>
      </View>
      <View className="flex-row gap-4 justify-center">
        <Text
          className="text-xl font-bold pt-2"
          style={{ color: colors.textMuted }}
        >
          Resets in
        </Text>
        <View className="flex-row gap-2">
          <View className="items-center">
            <View className="rounded-lg overflow-hidden">
              <LinearGradient colors={colors.gradients.empty} className="p-2">
                <Text
                  className="text-2xl font-medium"
                  style={{ color: colors.text }}
                >
                  {String(Math.floor(timer / 3600)).padStart(2, "0")}
                </Text>
              </LinearGradient>
            </View>
            <Text className="font-medium" style={{ color: colors.textMuted }}>
              Hrs
            </Text>
          </View>
          <Text
            className="text-xl font-bold pt-2"
            style={{ color: colors.text }}
          >
            :
          </Text>
          <View className="items-center">
            <View className="rounded-lg overflow-hidden">
              <LinearGradient colors={colors.gradients.empty} className="p-2">
                <Text
                  className="text-2xl font-medium"
                  style={{ color: colors.text }}
                >
                  {String(calcMins(timer)).padStart(2, "0")}
                </Text>
              </LinearGradient>
            </View>
            <Text className="font-medium" style={{ color: colors.textMuted }}>
              Min
            </Text>
          </View>
          <Text
            className="text-xl font-bold pt-2"
            style={{ color: colors.text }}
          >
            :
          </Text>
          <View className="items-center">
            <View className="rounded-lg overflow-hidden">
              <LinearGradient colors={colors.gradients.empty} className="p-2">
                <Text
                  className="text-2xl font-medium"
                  style={{ color: colors.text }}
                >
                  {String(calcSeconds(timer)).padStart(2, "0")}
                </Text>
              </LinearGradient>
            </View>
            <Text className="font-medium" style={{ color: colors.textMuted }}>
              Sec
            </Text>
          </View>
        </View>
      </View>
      <View
        className="items-center rounded-xl border-2 p-2"
        style={{ backgroundColor: colors.surface, borderColor: colors.border }}
      >
        <Text
          className="text-lg text-center"
          style={{ color: colors.textMuted }}
        >
          Complete the challenges to earn points and meet your goals! Hurry
          before the challenges reset!
        </Text>
      </View>
      {loading ? (
        <View className="items-center justify-center w-full">
          <ActivityIndicator color={colors.text} size={50} className="mt-32" />
        </View>
      ) : (
        <FlatList
          data={challenges}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <ChallengeCard item={item} />}
          contentContainerClassName="gap-4 pb-10"
          ListEmptyComponent={() => {
            return (
              <View>
                <Text
                  className="text-xl font-medium"
                  style={{ color: colors.text }}
                >
                  No challenges today! Check back another time!
                </Text>
              </View>
            );
          }}
        />
      )}
    </View>
  );
};

export default ChallengePage;
