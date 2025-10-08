import Toast from "react-native-toast-message";
import { Category, Difficulty, Tab } from "./types";

export const categories: Category[] = [
  {
    id: 1,
    category: "logic",
    iconName: "bulb-outline",
  },
  {
    id: 2,
    category: "math",
    iconName: "calculator-outline",
  },
  {
    id: 3,
    category: "wordplay",
    iconName: "chatbubbles-outline",
  },
  {
    id: 4,
    category: "lateral",
    iconName: "telescope-outline",
  },
  {
    id: 5,
    category: "patterns",
    iconName: "grid-outline",
  },
  {
    id: 6,
    category: "classic",
    iconName: "library-outline",
  },
  {
    id: 7,
    category: "trivia",
    iconName: "school-outline",
  },
];

export const difficulties: Difficulty[] = [
  {
    id: 1,
    difficulty: "easy",
    iconName: "happy-outline",
  },
  {
    id: 2,
    difficulty: "medium",
    iconName: "warning-outline",
  },
  {
    id: 3,
    difficulty: "hard",
    iconName: "skull-outline",
  },
];

export const tabs: Tab[] = [
  {
    id: 1,
    icon: "bar-chart",
  },
  {
    id: 2,
    icon: "medal",
  },
  {
    id: 3,
    icon: "trophy",
  },
  {
    id: 4,
    icon: "extension-puzzle",
  },
  {
    id: 5,
    icon: "barbell",
  },
];

export const toast = (type: "success" | "error" | "info", text1: string, text2: string) => {
  Toast.show({
    type,
    text1,
    text2,
  });
}
