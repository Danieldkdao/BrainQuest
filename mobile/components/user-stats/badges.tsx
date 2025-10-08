import {
  View,
  Text,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import BadgeCard from "./badge-card";
import { type Response, type Badge } from "@/utils/types";
import useApi from "@/utils/api";
import { toast } from "@/utils/utils";

const BadgesPage = () => {
  const api = useApi();
  const { colors } = useTheme();

  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBadges();
  }, []);

  const fetchBadges = async () => {
    try {
      const response = await api.get<Response<"badges", { badges: Badge[] }>>(
        "/badges/fetch-badges"
      );
      if (response.data.success && response.data.badges) {
        setBadges(response.data.badges);
        return;
      }
      toast(
        "error",
        "Fetch error",
        "Error fetching badges. Please come back later."
      );
    } catch (error) {
      console.error(error);
      toast(
        "error",
        "Fetch error",
        "Error fetching badges. Please come back later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      className="w-full items-center justify-center"
      style={{ backgroundColor: colors.bg }}
    >
      <ScrollView
        contentContainerClassName="items-start justify-center gap-5"
        className="w-[90%] pb-10"
      >
        <Text className="text-3xl font-bold" style={{ color: colors.text }}>
          Your Badges
        </Text>
        {loading ? (
          <View className="items-center justify-center w-full">
            <ActivityIndicator
              color={colors.text}
              size={50}
              className="mt-52"
            />
          </View>
        ) : (
          <View className="justify-center items-center w-full gap-4">
            {badges.map((item) => {
              return (
                <BadgeCard
                  key={item._id}
                  id={item._id}
                  title={item.title}
                  description={item.description}
                  icon={item.icon}
                />
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default BadgesPage;
