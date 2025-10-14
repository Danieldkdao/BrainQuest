import { useAuth } from "@clerk/clerk-expo";
import axios from "axios";
import { useMemo } from "react";

const baseURL = process.env.EXPO_PUBLIC_BACKEND_URL;

const useApi = () => {
  const { getToken, isSignedIn } = useAuth();

  const api = useMemo(() => {
    const instance = axios.create({
      baseURL,
    });

    instance.interceptors.request.use(async (config) => {
      if(isSignedIn){
        const token = await getToken();
        config.headers = config.headers || {};
        if(!(config.headers instanceof axios.AxiosHeaders)){
          config.headers = new axios.AxiosHeaders(config.headers);
        }
        config.headers.set("Authorization", `Bearer ${token}`);
      }
      return config;
    });
    return instance;
  }, [getToken, isSignedIn]);

  return api;
}

export default useApi;
