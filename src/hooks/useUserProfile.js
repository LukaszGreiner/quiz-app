import { useState, useEffect } from "react";
import { userService } from "../services/userService";

export const useUserProfile = (username) => {
  const [profile, setProfile] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        const userData = await userService.getUserByUsername(username);
        if (userData) {
          setProfile(userData);
          setUserId(userData.id);
        } else {
          setError("Nie znaleziono takiego użytkownika");
        }
      } catch (err) {
        setError("Wystąpił błąd podczas pobierania danych: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  return { profile, userId, loading, error };
};
