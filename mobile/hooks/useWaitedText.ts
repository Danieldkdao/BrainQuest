import { useEffect, useState } from "react"

export const useWaitedText = (text: string, delay: number) => {
  const [waitedText, setWaitedText] = useState("");
  useEffect(() => {
    const timeout = setTimeout(() => setWaitedText(text), delay);
    return () => clearTimeout(timeout);
  }, [text, delay]);

  return waitedText;
}