import { View, Text, TouchableOpacity } from "react-native";
import React, { ReactNode, useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import TrainPage from "@/components/puzzling/train";
import CreatePage from "@/components/puzzling/create";
import ChallengePage from "@/components/puzzling/challenge";
import DiscoverPage from "@/components/puzzling/discover";
import { usePuzzle } from "@/hooks/usePuzzle";

type ButtonType = {
  id: number;
  text: string;
  icon: keyof typeof Ionicons.glyphMap;
  component: ReactNode;
};

const MyPuzzlesPage = () => {
  const buttonGroups: ButtonType[][] = [
    [
      {
        id: 1,
        text: "Train",
        icon: "school",
        component: <TrainPage />,
      },
      {
        id: 2,
        text: "Create",
        icon: "create",
        component: <CreatePage />,
      },
    ],
    [
      {
        id: 3,
        text: "Challenge",
        icon: "trophy",
        component: <ChallengePage />,
      },
      {
        id: 4,
        text: "Discover",
        icon: "compass",
        component: <DiscoverPage />,
      },
    ],
  ];

  const { colors } = useTheme();
  const { selectedComponent, changeSelectedComponent } = usePuzzle();

  return (
    <View
      className="w-full h-full items-center justify-center"
      style={{
        backgroundColor: colors.bg,
      }}
    >
      <View
        className="h-full items-center justify-center gap-3 w-[90%]"
      >
        {selectedComponent
          ? selectedComponent
          : buttonGroups.map((item, index) => {
              return (
                <View key={index} className="flex-row gap-3">
                  {item.map((item) => {
                    return (
                      <TouchableOpacity
                        key={item.id}
                        className="flex flex-row items-center justify-center gap-2 border-2 rounded-xl py-3 flex-1"
                        style={{
                          borderColor: colors.border,
                          backgroundColor: colors.surface,
                        }}
                        onPress={() => changeSelectedComponent(item.component)}
                      >
                        <Ionicons
                          name={item.icon}
                          color={colors.text}
                          size={36}
                        />
                        <Text
                          className="text-2xl font-bold"
                          style={{ color: colors.text }}
                        >
                          {item.text}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              );
            })}
      </View>
    </View>
  );
};

export default MyPuzzlesPage;
