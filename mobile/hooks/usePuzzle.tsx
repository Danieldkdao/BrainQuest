import { createContext, ReactNode, useState, useContext } from "react";
import { Alert } from "react-native";
import {
  type Category,
  type Difficulty,
  type Response,
  type Puzzle,
  PuzzleCategory,
  PuzzleDifficulty,
} from "@/utils/types";
import useApi from "@/utils/api";

type PuzzleContextType = {
  selectedComponent: null | ReactNode;
  changeSelectedComponent: (com: null | ReactNode) => void;
  confirm: (title: string, text: string) => Promise<unknown | boolean>;
  categories: Category[];
  difficulties: Difficulty[];
  fetchPuzzles: (
    categories: PuzzleCategory[],
    difficulties: PuzzleDifficulty[]
  ) => Promise<Puzzle[] | undefined>;
};

const PuzzleContext = createContext<null | PuzzleContextType>(null);

export const PuzzleContextProvider = ({ children }: { children: ReactNode }) => {
  const categories: Category[] = [
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

  const difficulties: Difficulty[] = [
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
  
  const api = useApi();
  const [selectedComponent, setSelectedComponent] = useState<null | ReactNode>(
    null
  );

  const changeSelectedComponent = (com: null | ReactNode) => {
    setSelectedComponent(com);
  };

  const confirm = async (title: string, text: string) => {
    return new Promise((resolve) => {
      Alert.alert(
        title,
        text,
        [
          { text: "Go back", style: "cancel", onPress: () => resolve(false) },
          { text: "OK", onPress: () => resolve(true) },
        ],
        { cancelable: true }
      );
    });
  };

  const fetchPuzzles = async (
    categories: PuzzleCategory[],
    difficulties: PuzzleDifficulty[]
  ) => {
    try {
      const response = await api.post<
        Response<"puzzles", { puzzles: Puzzle[] }>
      >("/puzzles/get-puzzles", {
        categories,
        difficulties,
      });
      if (response.data.success && response.data.puzzles) {
        return response.data.puzzles;
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <PuzzleContext.Provider
      value={{
        selectedComponent,
        changeSelectedComponent,
        confirm,
        categories,
        difficulties,
        fetchPuzzles,
      }}
    >
      {children}
    </PuzzleContext.Provider>
  );
};

export const usePuzzle = () => {
  const context = useContext(PuzzleContext);
  if (!context)
    throw new Error(
      "Puzzle context must be used inside the puzzle context provider."
    );

  return context;
};
