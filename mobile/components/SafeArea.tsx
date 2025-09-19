import { View } from "react-native";
import React, { ReactNode } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";

const SafeArea = ({ children }: { children: ReactNode }) => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  return (
    <View
      className="flex-1"
      style={{ backgroundColor: colors.bg, paddingTop: insets.top + 10 }}
    >
      {children}
    </View>
  );
};

export default SafeArea;
