import SafeArea from "@/components/SafeArea";
import "./global.css";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { Slot } from "expo-router";
import { ThemeProvider } from "@/hooks/useTheme";
import { PuzzleContextProvider } from "@/hooks/usePuzzle";

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <PuzzleContextProvider>
        <ThemeProvider>
          <SafeArea>
            <Slot />
          </SafeArea>
        </ThemeProvider>
      </PuzzleContextProvider>
    </ClerkProvider>
  );
}
