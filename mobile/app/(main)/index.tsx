import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Modal,
} from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Progress from "react-native-progress";

const Home = () => {
  const { user } = useUser();
  const router = useRouter();
  const { colors } = useTheme();

  const [openDailyExercise, setOpenDailyExercise] = useState(false);

  const screenWidth = Dimensions.get("window").width;

  return (
    <View
      className="w-full h-full items-center justify-start"
      style={{ backgroundColor: colors.bg }}
    >
      <ScrollView
        contentContainerClassName="items-center justify-center gap-8"
        className="w-[90%]"
      >
        <Text className="text-3xl font-bold" style={{ color: colors.text }}>
          Welcome, {user?.firstName}!
        </Text>
        <View className="relative w-[90%] items-center justify-center">
          <Progress.Bar
            progress={0.4}
            width={screenWidth * 0.9}
            height={30}
            borderRadius={20}
            borderColor={colors.border}
            unfilledColor={colors.surface}
          />
          <View className="absolute inset-0 items-center justify-center">
            <Text className="text-center" style={{ color: colors.text }}>
              0/5 Exercises Complete
            </Text>
          </View>
        </View>
        <View className="flex-row w-full gap-8">
          <View
            className="flex-1 items-center p-4 rounded-xl border-2 gap-1"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
            }}
          >
            <Ionicons name="flame" size={40} color={colors.text} />
            <Text className="text-3xl font-bold" style={{ color: colors.text }}>
              30
            </Text>
            <Text className="text-xl" style={{ color: colors.textMuted }}>
              Day Streak
            </Text>
          </View>
          <View
            className="flex-1 items-center p-4 rounded-xl border-2 gap-1"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
            }}
          >
            <Ionicons name="extension-puzzle" size={40} color={colors.text} />
            <Text className="text-3xl font-bold" style={{ color: colors.text }}>
              139
            </Text>
            <Text className="text-xl" style={{ color: colors.textMuted }}>
              Puzzles Complete
            </Text>
          </View>
        </View>
        <Modal visible={openDailyExercise} animationType="slide">
          <View className="p-5 h-full" style={{ backgroundColor: colors.bg }}>
            <View className="w-full flex-row items-center justify-between">
              <Text className="text-3xl font-bold">Daily Exercise</Text>
              <TouchableOpacity onPress={() => setOpenDailyExercise(false)}>
                <Ionicons name="close-circle" color={colors.text} size={48} />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <TouchableOpacity
          onPress={() => setOpenDailyExercise(true)}
          className="flex flex-row items-center justify-center gap-2 w-full py-3 rounded-xl border-b-4"
          style={{
            backgroundColor: colors.surface,
            borderBottomColor: colors.primary,
          }}
        >
          <Text className="text-xl" style={{ color: colors.text }}>
            Try the daily exercise
          </Text>
          <Ionicons name="arrow-forward" color={colors.text} size={20} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default Home;
