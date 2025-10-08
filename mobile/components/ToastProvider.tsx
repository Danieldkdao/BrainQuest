import useToastConfig from "@/app/toastConfig";
import Toast from "react-native-toast-message";

const ToastProvider = () => {
  const toastConfig = useToastConfig();
  return <Toast config={toastConfig}/>
}

export default ToastProvider;