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
import React, { useEffect, useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useClerk, useUser } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import ToolTip from "@/components/ToolTip";
import { usePuzzle } from "@/hooks/usePuzzle";
import useApi from "@/utils/api";
import { Response, User } from "@/utils/types";
import { useAppUser } from "@/hooks/useAppUser";

type ToolTipProps = {
  darkMode: boolean;
  notifications: boolean;
  leaderboard: boolean;
  puzzleGoal: boolean;
  pointsGoal: boolean;
};

export const convertDate = (d: Date | null | undefined | string | number) => {
  if (!d) return "";
  const date = new Date(d);
  return date.toDateString();
};

const UserProfilePage = () => {
  const api = useApi();
  const { colors, isDarkMode, toggleDarkMode } = useTheme();
  const { signOut } = useClerk();
  const { user } = useUser();
  const { confirm } = usePuzzle();
  const { userSettings, fetchUserSettings, changeUserSettingState } =
    useAppUser();

  const [visible, setVisible] = useState<ToolTipProps>({
    darkMode: false,
    notifications: false,
    leaderboard: false,
    puzzleGoal: false,
    pointsGoal: false,
  });

  useEffect(() => {
    if (userSettings) return;
    fetchUserSettings();
  }, []);

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

  const handleGoalInput = async (num?: number, forPoints?: boolean) => {
    if (forPoints) {
      if (!num || num <= 0 || num % 1 !== 0 || !Number(num)) {
        changeUserSettingState<"pointsGoal">("pointsGoal", 500);
        await updatePointsGoal(500);
        return;
      }
      changeUserSettingState<"pointsGoal">("pointsGoal", num);
      await updatePointsGoal(num);
      return;
    }
    if (!num || num <= 0 || num % 1 !== 0 || !Number(num) || num > 100) {
      changeUserSettingState<"puzzleGoal">("puzzleGoal", 50);
      await updatePuzzleGoal(50);
      return;
    }
    changeUserSettingState<"puzzleGoal">("puzzleGoal", num);
    updatePuzzleGoal(num);
  };

  const changeEnableNotifications = async () => {
    try {
      changeUserSettingState<"enableNotifications">("enableNotifications");
      const response = await api.put<Response>("/users/enable-notifications");
      if (!response.data.success) {
        console.log(response.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const changeEnableLeaderboard = async () => {
    try {
      changeUserSettingState<"enableLeaderboard">("enableLeaderboard");
      const response = await api.put<Response>("/users/enable-leaderboard");
      if (!response.data.success) {
        console.log(response.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updatePuzzleGoal = async (newValue: number) => {
    try {
      const response = await api.put<Response>("/users/update-puzzle-goal", {
        newValue,
      });
      if (!response.data.success) {
        console.log(response.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updatePointsGoal = async (newValue: number) => {
    try {
      const response = await api.put<Response>("/users/update-points-goal", {
        newValue,
      });
      if (!response.data.success) {
        console.log(response.data.message);
      }
    } catch (error) {
      console.error(error);
    }
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
              onValueChange={toggleDarkMode}
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
            <Switch
              value={userSettings?.enableNotifications}
              onValueChange={changeEnableNotifications}
              thumbColor={colors.text}
            />
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
                  <Ionicons name="trophy" color={colors.text} size={32} />
                </LinearGradient>
              </TouchableOpacity>
              <Text
                className="text-2xl font-semibold ml-3"
                style={{ color: colors.text }}
              >
                Enable Leaderboard
              </Text>
            </View>
            <Switch
              value={userSettings?.enableLeaderboard}
              onValueChange={changeEnableLeaderboard}
              thumbColor={colors.text}
            />
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
              {visible.puzzleGoal && (
                <ToolTip text="Controls your daily puzzle goal. Cannot be larger than 100." />
              )}
              <TouchableOpacity
                onPress={() =>
                  setVisible((prev) => ({
                    ...prev,
                    puzzleGoal: !prev.puzzleGoal,
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
                Puzzle Goal
              </Text>
            </View>
            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={() => handleGoalInput(userSettings?.puzzleGoal! - 1)}
              >
                <Ionicons name="chevron-back" color={colors.text} size={32} />
              </TouchableOpacity>
              <TextInput
                value={String(userSettings?.puzzleGoal)}
                onChangeText={(text) => handleGoalInput(Number(text))}
                keyboardType="numeric"
                className="border-2 w-16 text-3xl text-center rounded-lg"
                style={{ color: colors.text, borderColor: colors.border }}
              />
              <TouchableOpacity
                onPress={() => handleGoalInput(userSettings?.puzzleGoal! + 1)}
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
              {visible.pointsGoal && (
                <ToolTip text="Controls your daily points goal." />
              )}
              <TouchableOpacity
                onPress={() =>
                  setVisible((prev) => ({
                    ...prev,
                    pointsGoal: !prev.pointsGoal,
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
                  handleGoalInput(userSettings?.pointsGoal! - 1, true)
                }
              >
                <Ionicons name="chevron-back" color={colors.text} size={32} />
              </TouchableOpacity>
              <TextInput
                value={String(userSettings?.pointsGoal!)}
                onChangeText={(text) => handleGoalInput(Number(text), true)}
                keyboardType="numeric"
                className="border-2 w-16 text-3xl text-center rounded-lg"
                style={{ color: colors.text, borderColor: colors.border }}
              />
              <TouchableOpacity
                onPress={() =>
                  handleGoalInput(userSettings?.pointsGoal! + 1, true)
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
