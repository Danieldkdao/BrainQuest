import useApi from "@/utils/api";
import {
  type Puzzle,
  type LeaderboardUser,
  type Response,
  type User,
} from "@/utils/types";
import { toast } from "@/utils/utils";
import { useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { createContext, useState, type ReactNode, useContext } from "react";

type AppUserContextType = {
  userSettings: User | null;
  leaderboardUsers: LeaderboardUser[];
  dailyPuzzle: Puzzle | null;
  fetchUserSettings: () => Promise<void>;
  changeUserSettingState: <T extends keyof User>(
    property: keyof User,
    newValue?: User[T]
  ) => void;
  fetchLeaderboardUsers: () => Promise<void>;
  getDailyPuzzle: () => Promise<void>;
};

const AppUserContext = createContext<null | AppUserContextType>(null);

export const AppUserContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const api = useApi();
  const { signOut } = useAuth();
  const router = useRouter();

  const [userSettings, setUserSettings] = useState<User | null>(null);
  const [leaderboardUsers, setLeaderboardUsers] = useState<LeaderboardUser[]>(
    []
  );
  const [dailyPuzzle, setDailyPuzzle] = useState<Puzzle | null>(null);

  const fetchUserSettings = async () => {
    try {
      const response = await api.get<Response<"user", { user: User }>>(
        "/users/fetch-user-settings"
      );
      if (response.data.success && response.data.user) {
        setUserSettings(response.data.user);
        await fetchLeaderboardUsers();
      } else {
        await signOut();
        router.push("/(auth)");
        toast(
          "error",
          "Fetch error",
          "Error fetching user information. Please come back later."
        );
      }
    } catch (error) {
      console.error(error);
      toast(
        "error",
        "Fetch error",
        "Error fetching user information. Please come back later."
      );
    }
  };

  const fetchLeaderboardUsers = async () => {
    try {
      const response =
        await api.get<Response<"users", { users: LeaderboardUser[] }>>(
          "/users/fetch-users"
        );
      if (response.data.success && response.data.users) {
        setLeaderboardUsers(response.data.users);
      }
    } catch (error) {
      console.error(error);
    }
  };

  function changeUserSettingState<T extends keyof User>(
    property: keyof User,
    newValue?: User[T]
  ) {
    setUserSettings((prev) => {
      if (prev === null) return null;
      if (typeof prev[property] === "boolean")
        return { ...prev, [property]: !prev[property] };
      return { ...prev, [property]: newValue };
    });
  }

  const getDailyPuzzle = async () => {
    try {
      const response = await api.get<Response<"puzzle", { puzzle: Puzzle }>>(
        "/puzzles/get-daily-puzzle"
      );
      if (response.data.success && response.data.puzzle) {
        setDailyPuzzle(response.data.puzzle);
        return;
      }
      toast(
        "error",
        "Fetch error",
        "Error fetching daily puzzle. Please come back later."
      );
    } catch (error) {
      console.error(error);
      toast(
        "error",
        "Fetch error",
        "Failed to fetch daily puzzle. Please come back later."
      );
    }
  };

  return (
    <AppUserContext.Provider
      value={{
        userSettings,
        leaderboardUsers,
        dailyPuzzle,
        fetchUserSettings,
        changeUserSettingState,
        fetchLeaderboardUsers,
        getDailyPuzzle,
      }}
    >
      {children}
    </AppUserContext.Provider>
  );
};

export const useAppUser = () => {
  const context = useContext(AppUserContext);
  if (!context)
    throw new Error("User context must be used inside user context provider.");

  return context;
};
