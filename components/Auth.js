import { useRouter } from "next/router";
import { useEffect } from "react";

const PrivateRoute = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      router.push("https://astha114.github.io/weather-bot/auth/login");
    }
  }, []);

  return children;
};

export default PrivateRoute;



