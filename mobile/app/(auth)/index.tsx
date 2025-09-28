import { useTheme } from "@/hooks/useTheme";
import { useSocialAuth } from "@/hooks/useSocialAuth";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Index() {
  const { isLoading, handleSocialAuth } = useSocialAuth();
  const { colors } = useTheme();

  return (
    <View
      className="items-center justify-center h-screen"
      style={{ backgroundColor: colors.bg }}
    >
      <View className="items-center justify-center w-full">
        <Image
          source={require("@/assets/logo.png")}
          resizeMode="contain"
          className="max-w-full h-[180]"
        />
        <View className="w-[80%] mt-5">
          <TouchableOpacity
            onPress={() => handleSocialAuth("oauth_google")}
            className="flex flex-row items-center justify-center border-2 py-1.5 rounded-full mb-3"
            style={{
              borderColor: colors.border,
              backgroundColor: colors.surface,
            }}
          >
            {isLoading ? (
              <ActivityIndicator size={24} color={colors.primary} />
            ) : (
              <>
                <Image
                  source={require("@/assets/google.png")}
                  resizeMode="contain"
                  className="size-14"
                />
                <Text
                  className="text-lg font-medium"
                  style={{ color: colors.text }}
                >
                  Continue with Google
                </Text>
              </>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleSocialAuth("oauth_apple")}
            className="flex flex-row items-center justify-center border-2 py-3 rounded-full"
            style={{
              borderColor: colors.border,
              backgroundColor: colors.surface,
            }}
          >
            {isLoading ? (
              <ActivityIndicator size={24} color={colors.primary} />
            ) : (
              <>
                <Image
                  source={require("@/assets/apple.png")}
                  resizeMode="contain"
                  className="size-11 mr-2"
                />
                <Text
                  className="text-lg font-medium"
                  style={{ color: colors.text }}
                >
                  Continue with Apple
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
