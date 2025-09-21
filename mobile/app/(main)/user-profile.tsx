import {
  View,
  Text,
  Switch,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useClerk, useUser } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import ToolTip from "@/components/ToolTip";
import { usePuzzle } from "@/hooks/usePuzzle";

type Goal = {
  goal: number;
  shown: boolean;
};

type ToolTipProps = {
  darkMode: boolean;
  notifications: boolean;
  leaderboard: boolean;
  exerciseGoal: Goal;
  pointsGoal: Goal;
};

export const convertDate = (d: Date | null | undefined | string) => {
  if (!d) return "";
  const date = new Date(d);
  return date.toDateString();
};

const UserProfilePage = () => {
  const { colors, isDarkMode, toggleDarkMode } = useTheme();
  const { signOut } = useClerk();
  const { user } = useUser();
  const { confirm } = usePuzzle();

  const [visible, setVisible] = useState<ToolTipProps>({
    darkMode: false,
    notifications: false,
    leaderboard: false,
    exerciseGoal: {
      goal: 5,
      shown: false,
    },
    pointsGoal: {
      goal: 500,
      shown: false,
    },
  });

  const handleSignOut = async () => {
    const isOk = await confirm(
      "Confirm Logout",
      "Are you sure you want to logout?"
    );
    if (!isOk) return;
    try {
      await signOut();
      Linking.openURL(Linking.createURL("/(auth)"));
      Alert.alert("Success", "User logged out successfully!");
    } catch (error) {
      console.error(error);
      Alert.alert(
        "An Error Occurred",
        "Logout failed due to error. Please try again later."
      );
    }
  };

  const handleGoalInput = (num?: number, forPoints?: boolean) => {
    if (forPoints) {
      if (!num || num <= 0 || num % 1 !== 0 || !Number(num))
        return setVisible((prev) => ({
          ...prev,
          pointsGoal: { ...prev.pointsGoal, goal: 50 },
        }));
      return setVisible((prev) => ({
        ...prev,
        pointsGoal: { ...prev.pointsGoal, goal: num },
      }));
    }
    if (!num || num <= 0 || num % 1 !== 0 || !Number(num) || num > 100)
      return setVisible((prev) => ({
        ...prev,
        exerciseGoal: { ...prev.exerciseGoal, goal: 5 },
      }));
    setVisible((prev) => ({
      ...prev,
      exerciseGoal: { ...prev.exerciseGoal, goal: num },
    }));
  };

  return (
    <View
      className="w-full h-full items-center justify-start"
      style={{ backgroundColor: colors.bg }}
    >
      <ScrollView className="w-[90%]">
        <View
          className="w-full p-5 rounded-xl border-2 mb-8"
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
          }}
        >
          <View className="flex flex-row items-center justify-between mb-4">
            <View className="flex flex-row items-center">
              <Image
                source={{ uri: user?.imageUrl }}
                resizeMode="contain"
                className="size-16 rounded-full mr-3"
              />
              <View>
                <Text
                  className="text-2xl font-semibold"
                  style={{ color: colors.text }}
                >
                  {user?.fullName}
                </Text>
                <Text className="text-xl" style={{ color: colors.text }}>
                  {user?.primaryEmailAddress?.emailAddress}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={handleSignOut}>
              <Ionicons name="log-out-outline" color={colors.text} size={44} />
            </TouchableOpacity>
          </View>
          <Text className="text-xl" style={{ color: colors.textMuted }}>
            Joined on {convertDate(user?.createdAt)}
          </Text>
        </View>
        <View
          className="w-full border-2 p-5 rounded-xl gap-4 mb-8"
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
          }}
        >
          <View className="flex flex-row items-center">
            <View className="flex flex-row items-center flex-1 relative">
              {visible.darkMode && <ToolTip text="Toggle dark mode theme" />}
              <TouchableOpacity
                onPress={() =>
                  setVisible((prev) => ({
                    ...prev,
                    darkMode: !visible.darkMode,
                  }))
                }
                className="overflow-hidden rounded-lg flex flex-row"
              >
                <LinearGradient colors={colors.gradients.empty} className="p-2">
                  <Ionicons name="moon" color={colors.text} size={32} />
                </LinearGradient>
              </TouchableOpacity>
              <Text
                className="text-2xl font-semibold ml-3"
                style={{ color: colors.text }}
              >
                Dark Mode
              </Text>
            </View>
            <Switch
              value={isDarkMode}
              onChange={toggleDarkMode}
              thumbColor={colors.text}
            />
          </View>
          <View className="flex flex-row items-center">
            <View className="flex flex-row items-center flex-1 relative">
              {visible.notifications && (
                <ToolTip text="Allow daily notification reminders" />
              )}
              <TouchableOpacity
                onPress={() =>
                  setVisible((prev) => ({
                    ...prev,
                    notifications: !visible.notifications,
                  }))
                }
                className="overflow-hidden rounded-lg flex flex-row"
              >
                <LinearGradient colors={colors.gradients.empty} className="p-2">
                  <Ionicons
                    name="notifications"
                    color={colors.text}
                    size={32}
                  />
                </LinearGradient>
              </TouchableOpacity>
              <Text
                className="text-2xl font-semibold ml-3"
                style={{ color: colors.text }}
              >
                Enable Notifications
              </Text>
            </View>
            <Switch thumbColor={colors.text} />
          </View>
          <View className="flex flex-row items-center">
            <View className="flex flex-row items-center flex-1">
              {visible.leaderboard && (
                <ToolTip text="Allows you to see the leaderboard and be placed" />
              )}
              <TouchableOpacity
                onPress={() =>
                  setVisible((prev) => ({
                    ...prev,
                    leaderboard: !visible.leaderboard,
                  }))
                }
                className="overflow-hidden rounded-lg flex flex-row"
              >
                <LinearGradient colors={colors.gradients.empty} className="p-2">
                  <Ionicons name="podium" color={colors.text} size={32} />
                </LinearGradient>
              </TouchableOpacity>
              <Text
                className="text-2xl font-semibold ml-3"
                style={{ color: colors.text }}
              >
                Enable Leaderboard
              </Text>
            </View>
            <Switch thumbColor={colors.text} />
          </View>
        </View>
        <View
          className="w-full border-2 p-5 rounded-xl gap-4"
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
          }}
        >
          <View className="flex flex-row items-center">
            <View className="flex flex-row items-center flex-1">
              {visible.exerciseGoal.shown && (
                <ToolTip text="Controls your daily exercise goal. Cannot be larger than 100." />
              )}
              <TouchableOpacity
                onPress={() =>
                  setVisible((prev) => ({
                    ...prev,
                    exerciseGoal: {
                      ...prev.exerciseGoal,
                      shown: !prev.exerciseGoal.shown,
                    },
                  }))
                }
                className="overflow-hidden rounded-lg flex flex-row"
              >
                <LinearGradient colors={colors.gradients.empty} className="p-2">
                  <Ionicons name="barbell" color={colors.text} size={32} />
                </LinearGradient>
              </TouchableOpacity>
              <Text
                className="text-2xl font-semibold ml-3"
                style={{ color: colors.text }}
              >
                Exercise Goal
              </Text>
            </View>
            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={() => handleGoalInput(visible.exerciseGoal.goal - 1)}
              >
                <Ionicons name="chevron-back" color={colors.text} size={32} />
              </TouchableOpacity>
              <TextInput
                value={String(visible.exerciseGoal.goal)}
                onChangeText={(text) => handleGoalInput(Number(text))}
                keyboardType="numeric"
                className="border-2 w-16 text-3xl text-center rounded-lg"
                style={{ color: colors.text, borderColor: colors.border }}
              />
              <TouchableOpacity
                onPress={() => handleGoalInput(visible.exerciseGoal.goal + 1)}
              >
                <Ionicons
                  name="chevron-forward"
                  color={colors.text}
                  size={32}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View className="flex flex-row items-center">
            <View className="flex flex-row items-center flex-1">
              {visible.pointsGoal.shown && (
                <ToolTip text="Controls your daily points goal." />
              )}
              <TouchableOpacity
                onPress={() =>
                  setVisible((prev) => ({
                    ...prev,
                    pointsGoal: {
                      ...prev.pointsGoal,
                      shown: !prev.pointsGoal.shown,
                    },
                  }))
                }
                className="overflow-hidden rounded-lg flex flex-row"
              >
                <LinearGradient colors={colors.gradients.empty} className="p-2">
                  <Ionicons name="sparkles" color={colors.text} size={32} />
                </LinearGradient>
              </TouchableOpacity>
              <Text
                className="text-2xl font-semibold ml-3"
                style={{ color: colors.text }}
              >
                Points Goal
              </Text>
            </View>
            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={() =>
                  handleGoalInput(visible.pointsGoal.goal - 1, true)
                }
              >
                <Ionicons name="chevron-back" color={colors.text} size={32} />
              </TouchableOpacity>
              <TextInput
                value={String(visible.pointsGoal.goal)}
                onChangeText={(text) => handleGoalInput(Number(text), true)}
                keyboardType="numeric"
                className="border-2 w-16 text-3xl text-center rounded-lg"
                style={{ color: colors.text, borderColor: colors.border }}
              />
              <TouchableOpacity
                onPress={() =>
                  handleGoalInput(visible.pointsGoal.goal + 1, true)
                }
              >
                <Ionicons
                  name="chevron-forward"
                  color={colors.text}
                  size={32}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default UserProfilePage;
