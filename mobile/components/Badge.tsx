import { View, Text } from "react-native";
import React from "react";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";

type BadgePropsType = {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const Badge = ({ title, description, icon }: BadgePropsType) => {
  const { colors } = useTheme();

  return (
    <View
      className="w-full flex-row border-2 items-center p-5 rounded-xl gap-5"
      style={{ backgroundColor: colors.surface, borderColor: colors.border }}
    >
      <View
        className="rounded-full items-center p-5 justify-center border-2"
        style={{ backgroundColor: colors.surface, borderColor: colors.border }}
      >
        <View
          className="size-[75px] rounded-full items-center justify-center border-2"
          style={{ backgroundColor: colors.bg, borderColor: colors.border }}
        >
          <Ionicons name={icon} size={48} color={colors.text} />
        </View>
      </View>
      <View className="flex-1">
        <Text className="text-xl font-bold" style={{ color: colors.text }}>
          {title}
        </Text>
        <Text style={{ color: colors.textMuted }}>{description}</Text>
      </View>
    </View>
  );
};

export default Badge;
