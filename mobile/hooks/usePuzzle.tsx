import { createContext, ReactNode, useState, useContext } from "react";
import { Alert } from "react-native";
import {
  type Response,
  type Puzzle,
  PuzzleCategory,
  PuzzleDifficulty,
} from "@/utils/types";
import useApi from "@/utils/api";
import { tabs } from "@/utils/utils";

type PuzzleContextType = {
  selectedComponent: null | ReactNode;
  changeSelectedComponent: (com: null | ReactNode) => void;
  confirm: (title: string, text: string) => Promise<unknown | boolean>;
  fetchPuzzles: (
    categories: PuzzleCategory[],
    difficulties: PuzzleDifficulty[]
  ) => Promise<Puzzle[] | undefined>;
  selectedTab: number;
  changeSelectedTab: (tab: number) => void;
};

const PuzzleContext = createContext<null | PuzzleContextType>(null);

export const PuzzleContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const api = useApi();
  const [selectedComponent, setSelectedComponent] = useState<null | ReactNode>(
    null
  );
  const [selectedTab, setSelectedTab] = useState<number>(tabs[0].id);

  const changeSelectedComponent = (com: null | ReactNode) => {
    setSelectedComponent(com);
  };

  const changeSelectedTab = (tab: number) => {
    setSelectedTab(tab);
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
        fetchPuzzles,
        selectedTab,
        changeSelectedTab,
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
