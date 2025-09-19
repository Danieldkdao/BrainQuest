import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useTheme } from "@/hooks/useTheme";
import { useApp } from "@/hooks/usePuzzle";

const DiscoverPage = () => {
  const { colors } = useTheme();
  const { changeSelectedComponent } = useApp();

  return (
    <View>
      <Text>DiscoverPage</Text>
      <TouchableOpacity onPress={() => changeSelectedComponent(null)}>
        <Text>Click me</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DiscoverPage;
