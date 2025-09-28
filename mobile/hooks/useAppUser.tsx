import useApi from "@/utils/api";
import { LeaderboardUser, Response, User } from "@/utils/types";
import { createContext, useState, type ReactNode, useContext } from "react";

type AppUserContextType = {
  userSettings: User | null;
  leaderboardUsers: LeaderboardUser[];
  fetchUserSettings: () => Promise<void>;
  changeUserSettingState: <T extends keyof User>(
    property: keyof User,
    newValue?: User[T]
  ) => void;
  fetchLeaderboardUsers: () => Promise<void>;
};

const AppUserContext = createContext<null | AppUserContextType>(null);

export const AppUserContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const api = useApi();

  const [userSettings, setUserSettings] = useState<User | null>(null);
  const [leaderboardUsers, setLeaderboardUsers] = useState<LeaderboardUser[]>([]);

  const fetchUserSettings = async () => {
    try {
      const response = await api.get<Response<"user", { user: User }>>(
        "/users/fetch-user-settings"
      );
      if (response.data.success && response.data.user) {
        setUserSettings(response.data.user);
      } else {
        console.log(response.data.message);
      }
      await fetchLeaderboardUsers();
    } catch (error) {
      console.error(error);
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

  return (
    <AppUserContext.Provider
      value={{
        userSettings,
        leaderboardUsers,
        fetchUserSettings,
        changeUserSettingState,
        fetchLeaderboardUsers,
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
