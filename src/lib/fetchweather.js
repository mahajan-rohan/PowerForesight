"use server";
import { currentUser } from "@clerk/nextjs/server";

const fetchWeather = async () => {
  const { user } = currentUser;

  if (!user) {
    setError("User not authenticated");
    return;
  }

  try {
    const response = await fetch("/get-weather", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: user.id }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return;
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error fetching weather data:", err);
  }
};

export default fetchWeather;
