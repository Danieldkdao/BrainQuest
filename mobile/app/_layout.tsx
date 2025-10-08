import SafeArea from "@/components/SafeArea";
import "./global.css";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { Slot } from "expo-router";
import { ThemeProvider } from "@/hooks/useTheme";
import { PuzzleContextProvider } from "@/hooks/usePuzzle";
import { AppUserContextProvider } from "@/hooks/useAppUser";
import ToastProvider from "@/components/ToastProvider";

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache} telemetry={false}>
      <AppUserContextProvider>
        <PuzzleContextProvider>
          <ThemeProvider>
            <SafeArea>
              <Slot />
              <ToastProvider />
            </SafeArea>
          </ThemeProvider>
        </PuzzleContextProvider>
      </AppUserContextProvider>
    </ClerkProvider>
  );
}
