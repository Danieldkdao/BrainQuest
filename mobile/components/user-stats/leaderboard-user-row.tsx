import { View, Text } from "react-native";
import React from "react";
import { useTheme } from "@/hooks/useTheme";
import { LeaderboardUser } from "@/utils/types";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "@clerk/clerk-expo";

const placeReference = {
  "1": "#FFD700",
  "2": "#C0C0C0",
  "3": "#CD7F32",
};

const LeaderboardUserRow = ({
  userId,
  name,
  points,
  puzzles,
  rank,
}: LeaderboardUser & { rank: number }) => {
  const { user } = useUser();
  const { colors } = useTheme();

  return (
    <View
      className="flex-row px-5 items-center w-full gap-2 rounded-lg"
      style={{
        backgroundColor: user?.id === userId ? colors.surface : "transparent",
      }}
    >
      <View className="flex-1 flex-row items-center gap-1">
        {!placeReference[String(rank) as keyof typeof placeReference] ? (
          <Text className="text-xl font-medium" style={{ color: colors.text }}>
            #
          </Text>
        ) : (
          <Ionicons
            name="medal"
            color={placeReference[String(rank) as keyof typeof placeReference]}
            size={20}
          />
        )}
        <Text className="text-xl font-medium" style={{ color: colors.text }}>
          {rank}
        </Text>
      </View>
      <View className="flex-[1.8]">
        <Text className="text-xl font-medium" style={{ color: colors.text }}>
          {name}
        </Text>
      </View>
      <View className="flex-1">
        <Text className="text-xl" style={{ color: colors.text }}>
          {points}
        </Text>
      </View>
      <View className="flex-1">
        <Text className="text-xl" style={{ color: colors.text }}>
          {puzzles}
        </Text>
      </View>
    </View>
  );
};

export default LeaderboardUserRow;
