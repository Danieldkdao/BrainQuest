import { View, Text, ScrollView, FlatList } from "react-native";
import React from "react";
import { useTheme } from "@/hooks/useTheme";
import Badge from "../Badge";
import { Ionicons } from "@expo/vector-icons";

type BadgeType = {
  id: number;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const BadgesPage = () => {
  const { colors } = useTheme();

  const badges: BadgeType[] = [
    {
      id: 1,
      title: "Brain Spark",
      icon: "flash", // ⚡
      description: "Earned for completing your very first brain exercise.",
    },
    {
      id: 4,
      title: "Logic Master",
      icon: "extension-puzzle", // 🧩
      description: "Earned for solving 20 logic puzzles.",
    },
    {
      id: 5,
      title: "Early Bird",
      icon: "sunny", // 🌅
      description: "You trained your brain before 9 AM.",
    },
    {
      id: 6,
      title: "Night Owl",
      icon: "moon", // 🌙
      description: "You did an exercise session after 11 PM.",
    },
    {
      id: 8,
      title: "Hot Streak",
      icon: "flame", // 👑
      description: "Logged in and trained 7 days in a row.",
    },
    {
      id: 9,
      title: "Braniac",
      icon: "school", // 🎓 brainy
      description: "Reached 5000 points in one day.",
    },
    {
      id: 10,
      title: "Master",
      icon: "star", // 🎓 brainy
      description: "Reached 100,000 total points across all exercises.",
    },
  ];

  return (
    <View
      className="w-full items-center justify-center"
      style={{ backgroundColor: colors.bg }}
    >
      <ScrollView
        contentContainerClassName="items-start justify-center gap-5"
        className="w-[90%] pb-10"
      >
        <Text className="text-3xl font-bold" style={{ color: colors.text }}>
          Your Badges
        </Text>
        <View className="justify-center items-center w-full gap-4">
          {badges.map((item) => {
            return (
              <Badge
                key={item.id}
                title={item.title}
                description={item.description}
                icon={item.icon}
              />
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default BadgesPage;
