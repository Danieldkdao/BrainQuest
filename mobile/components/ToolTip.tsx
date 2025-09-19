import { View, Text } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/hooks/useTheme";

const ToolTip = ({ text }: { text: string }) => {
  const { colors } = useTheme();

  return (
    <View
      className="absolute bottom-10 left-10 items-center justify-center max-w-80"
      style={{ zIndex: 100 }}
    >
      <View
        className="min-w-16 rounded-md overflow-hidden"
        style={{ backgroundColor: colors.border }}
      >
        <LinearGradient className="p-4" colors={colors.gradients.empty}>
          <Text style={{ color: colors.text }}>{text}</Text>
        </LinearGradient>
      </View>
      <View
        className="border-l-[10px] border-r-[10px] border-t-[20px]"
        style={{
          borderTopColor: colors.gradients.empty[1],
          borderLeftColor: "transparent",
          borderRightColor: "transparent",
        }}
      ></View>
    </View>
  );
};

export default ToolTip;
