// src/hooks/useUserData.js
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export const useUserData = (createdBy, currentUserId) => {
  const [creatorName, setCreatorName] = useState("Nieznany autor");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!createdBy) {
        console.log("No createdBy provided");
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching user data for ID:", createdBy);
        const userRef = doc(db, "users", createdBy);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          console.log("User data found:", userData);
          setCreatorName(userData.username || "Nieznany autor"); // Use username field
          setIsAdmin(userData.isAdmin || false);
        } else {
          console.log("No user document found for ID:", createdBy);
        }

        setIsOwner(currentUserId && createdBy === currentUserId);
      } catch (error) {
        console.error(
          "Wystąpił błąd podczas ładowania danych użytkownika:",
          error,
        );
        setCreatorName("Błąd ładowania autora");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [createdBy, currentUserId]);

  return {
    creatorName,
    isAdmin,
    isOwner,
    loading,
  };
};
