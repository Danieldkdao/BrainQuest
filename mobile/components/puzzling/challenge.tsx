import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useTheme } from "@/hooks/useTheme";
import { usePuzzle } from "@/hooks/usePuzzle";

const ChallengePage = () => {
  const { colors } = useTheme();
  const { changeSelectedComponent } = usePuzzle();

  return (
    <View>
      <Text>ChallengePage</Text>
      <TouchableOpacity onPress={() => changeSelectedComponent(null)}>
        <Text>Click me</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChallengePage;
