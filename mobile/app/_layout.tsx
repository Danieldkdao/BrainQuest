import SafeArea from "@/components/SafeArea";
import "./global.css";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { Slot } from "expo-router";
import { ThemeProvider } from "@/hooks/useTheme";
import { PuzzleContextProvider } from "@/hooks/usePuzzle";
import { AppUserContextProvider } from "@/hooks/useAppUser";
import ToastProvider from "@/components/ToastProvider";
import * as Notifications from 'expo-notifications';
import NotificationSetup from "@/components/NotificationSetup";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true, 
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  })
});

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache} telemetry={false}>
      <AppUserContextProvider>
        <PuzzleContextProvider>
          <ThemeProvider>
            <SafeArea>
              <Slot />
              <NotificationSetup />
              <ToastProvider />
            </SafeArea>
          </ThemeProvider>
        </PuzzleContextProvider>
      </AppUserContextProvider>
    </ClerkProvider>
  );
}
