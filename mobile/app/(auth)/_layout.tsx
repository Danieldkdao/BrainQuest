import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@clerk/clerk-expo";
import { Redirect, Stack } from "expo-router";
import React from "react";
import { StatusBar } from "react-native";

const AuthLayout = () => {
  const { isSignedIn } = useAuth();
  const { colors } = useTheme();

  if (isSignedIn) {
    return <Redirect href="/(main)" />;
  }

  return (
    <>
      <StatusBar barStyle={colors.statusBarStyle} />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
};

export default AuthLayout;
