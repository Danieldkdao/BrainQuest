import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { BaseToast, BaseToastProps } from 'react-native-toast-message';

const useToastConfig = () => {
  const { colors, isDarkMode } = useTheme();

  const toastConfig = useMemo(() => {
    const toastConfig = {
      success: (props: BaseToastProps) =>
        BaseToast({
          ...props,
          renderLeadingIcon: () => (
            <Ionicons
              name="checkmark-circle"
              size={25}
              color={colors.success}
              className="ml-2"
            />
          ),
          contentContainerStyle: {
            backgroundColor: colors.surface,
            borderRadius: 10,
          },
          text1Style: {
            fontWeight: "bold",
            fontSize: 16,
            color: colors.text,
          },
          text2Style: {
            fontSize: 12,
            color: colors.textMuted,
          },
          style: {
            backgroundColor: colors.surface,
            borderRadius: 10,
            borderLeftColor: colors.success,
            padding: 5,
            alignItems: "center",
          },
        }),
      error: (props: BaseToastProps) =>
        BaseToast({
          ...props,
          renderLeadingIcon: () => (
            <Ionicons
              name="close-circle"
              size={25}
              color={colors.danger}
              className="ml-2"
            />
          ),
          contentContainerStyle: {
            backgroundColor: colors.surface,
            borderRadius: 10,
          },
          text1Style: {
            fontWeight: "bold",
            fontSize: 16,
            color: colors.text,
          },
          text2Style: {
            fontSize: 12,
            color: colors.textMuted,
          },
          style: {
            backgroundColor: colors.surface,
            borderRadius: 10,
            borderLeftColor: colors.danger,
            padding: 5,
            alignItems: "center",
          },
        }),
      info: (props: BaseToastProps) =>
        BaseToast({
          ...props,
          renderLeadingIcon: () => (
            <Ionicons
              name="information-circle"
              size={25}
              color={colors.primary}
              className="ml-2"
            />
          ),
          contentContainerStyle: {
            backgroundColor: colors.surface,
            borderRadius: 10,
          },
          text1Style: {
            fontWeight: "bold",
            fontSize: 16,
            color: colors.text,
          },
          text2Style: {
            fontSize: 12,
            color: colors.textMuted,
          },
          style: {
            backgroundColor: colors.surface,
            borderRadius: 10,
            borderLeftColor: colors.primary,
            padding: 5,
            alignItems: "center",
          },
        }),
    };
    return toastConfig;
  }, [isDarkMode]);

  return toastConfig;
}

export default useToastConfig;