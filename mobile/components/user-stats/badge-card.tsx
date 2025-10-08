import { View, Text } from "react-native";
import React from "react";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { useAppUser } from "@/hooks/useAppUser";

type BadgePropsType = {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const BadgeCard = ({ id, title, description, icon }: BadgePropsType) => {
  const { colors } = useTheme();
  const { userSettings } = useAppUser();

  const isEarned = userSettings?.badgesEarned.includes(id);
  return (
    <View
      className="w-full flex-row border-2 items-center p-5 rounded-xl gap-5"
      style={{
        backgroundColor: isEarned ? "#FFD700" : colors.surface,
        borderColor: isEarned ? "transparent" : colors.border,
      }}
    >
      <View
        className="rounded-full items-center p-5 justify-center border-2"
        style={{
          backgroundColor: isEarned ? "#FFD700" : colors.surface,
          borderColor: isEarned ? "#CD7F32" : colors.border,
        }}
      >
        <View
          className="size-[75px] rounded-full items-center justify-center border-2"
          style={{
            backgroundColor: isEarned ? "#CD7F32" : colors.bg,
            borderColor: isEarned ? "#CD7F32" : colors.border,
          }}
        >
          <Ionicons name={icon} size={48} color={colors.text} />
        </View>
      </View>
      <View className="flex-1">
        <Text
          className="text-xl font-bold"
          style={{ color: isEarned ? "#1A1A1A" : colors.text }}
        >
          {title}
        </Text>
        <Text style={{ color: isEarned ? "#6B5B3D" : colors.textMuted }}>
          {description}
        </Text>
      </View>
    </View>
  );
};

export default BadgeCard;
