import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { StatusBar } from "react-native";

const MainLayout = () => {
  const { colors } = useTheme();

  return (
    <>
      <StatusBar barStyle={colors.statusBarStyle} />
      <Tabs
        screenOptions={{
          headerShown: false,

          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarLabelStyle: {
            display: "none",
          },
          tabBarIconStyle: {
            marginTop: 8,
          },
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopWidth: 1,
            borderTopColor: colors.border,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ color, size }) => {
              return <Ionicons name="home" color={color} size={size} />;
            },
          }}
        />
        <Tabs.Screen
          name="user-stats"
          options={{
            tabBarIcon: ({ color, size }) => {
              return <Ionicons name="stats-chart" color={color} size={size} />;
            },
          }}
        />
        <Tabs.Screen
          name="puzzling"
          options={{
            tabBarIcon: ({ color, size }) => {
              return (
                <Ionicons name="extension-puzzle" color={color} size={size} />
              );
            },
          }}
        />
        <Tabs.Screen
          name="user-profile"
          options={{
            tabBarIcon: ({ color, size }) => {
              return (
                <Ionicons name="person-circle" color={color} size={size} />
              );
            },
          }}
        />
      </Tabs>
    </>
  );
};

export default MainLayout;
