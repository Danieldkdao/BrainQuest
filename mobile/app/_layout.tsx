import SafeArea from "@/components/SafeArea";
import "./global.css";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { Slot } from "expo-router";
import { ThemeProvider } from "@/hooks/useTheme";
import { PuzzleContextProvider } from "@/hooks/usePuzzle";
import { AppUserContextProvider } from "@/hooks/useAppUser";

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <AppUserContextProvider>
        <PuzzleContextProvider>
          <ThemeProvider>
            <SafeArea>
              <Slot />
            </SafeArea>
          </ThemeProvider>
        </PuzzleContextProvider>
      </AppUserContextProvider>
    </ClerkProvider>
  );
}
