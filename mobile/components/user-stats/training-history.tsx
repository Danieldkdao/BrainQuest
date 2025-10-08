import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import useApi from "@/utils/api";
import { Response, Session } from "@/utils/types";
import SessionCard from "./session-card";
import { usePuzzle } from "@/hooks/usePuzzle";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import TrainPage from "../puzzling/train";
import { toast } from "@/utils/utils";

const TrainingHistoryPage = () => {
  const api = useApi();
  const { confirm, changeSelectedComponent } = usePuzzle();
  const { colors } = useTheme();
  const router = useRouter();

  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const response = await api.get<
        Response<"sessions", { sessions: Session[] }>
      >("/train/get-sessions");
      if (response.data.success && response.data.sessions) {
        setSessions(response.data.sessions);
        return;
      }
      toast(
        "error",
        "Fetch error",
        "Error fetching sessions. Please come back later."
      );
    } catch (error) {
      console.error(error);
      toast(
        "error",
        "Fetch error",
        "Error fetching sessions. Please come back later."
      );
    } finally {
      setLoading(false);
    }
  };

  const clearSessionHistory = async () => {
    if (sessions.length === 0) return;
    const isOk = await confirm(
      "Confirm Delete Action",
      "Are you sure you want to clear your session history? This action is irreversable."
    );
    if (!isOk) return;
    try {
      const response = await api.delete<Response>(
        "/train/clear-session-history"
      );
      if (response.data.success) {
        fetchSessions();
        return;
      }
      toast(
        "error",
        "Deletion error",
        "Error deleting sessions. Please come back later."
      );
    } catch (error) {
      console.error(error);
      toast(
        "error",
        "Deletion error",
        "Error deleting sessions. Please come back later."
      );
    }
  };

  const redirectTrain = () => {
    router.push("/(main)/puzzling");
    changeSelectedComponent(<TrainPage />);
  };

  return (
    <View className="w-[90%]">
      <View className="flex-row justify-between items-center mb-5">
        <Text className="text-3xl font-bold" style={{ color: colors.text }}>
          Training History
        </Text>
        <TouchableOpacity
          disabled={sessions.length === 0}
          className="rounded-xl overflow-hidden"
          style={{ opacity: sessions.length === 0 ? 0.6 : 1 }}
          onPress={clearSessionHistory}
        >
          <LinearGradient
            colors={colors.gradients.danger}
            className="flex-row items-center gap-2 py-2 px-3"
          >
            <Ionicons name="trash" color="white" size={25} />
            <Text className="text-xl font-medium text-white">Clear</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator color={colors.text} size={50} className="mt-52" />
      ) : sessions.length === 0 ? (
        <View
          className="border-2 p-5 rounded-xl items-center gap-2"
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
          }}
        >
          <Ionicons name="barbell" color={colors.text} size={70} />
          <Text className="text-2xl font-bold" style={{ color: colors.text }}>
            No Sessions Yet
          </Text>
          <Text className="text-center" style={{ color: colors.textMuted }}>
            Start a training session to level up your critical thinking skills
            and rise up the leaderboard!
          </Text>
          <TouchableOpacity
            onPress={redirectTrain}
            className="rounded-xl overflow-hidden"
          >
            <LinearGradient
              className="flex-row items-center gap-2 py-2 px-4"
              colors={colors.gradients.empty}
            >
              <Ionicons
                name="arrow-forward-circle"
                color={colors.text}
                size={30}
              />
              <Text
                className="text-xl font-medium"
                style={{ color: colors.text }}
              >
                Start Session
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="gap-4 pb-10">
          {sessions.map((item) => {
            return (
              <SessionCard
                key={item._id}
                item={item}
                fetchSessions={fetchSessions}
              />
            );
          })}
        </View>
      )}
    </View>
  );
};

export default TrainingHistoryPage;
