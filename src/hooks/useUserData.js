import { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { showError } from "../utils/toastUtils"; // Adjust path as needed

export const useUserData = (authorId, currentUserId) => {
  const [creatorName, setCreatorName] = useState("Nieznany autor");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!authorId) {
        console.log("No authorId provided");
        setLoading(false);
        return;
      }

      try {
        const userRef = doc(db, "users", authorId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          setCreatorName(userData.username || "Nieznany autor");
          setIsAdmin(userData.isAdmin || false);
        } else {
          console.log("No user document found for ID:", authorId);
        }

        setIsOwner(currentUserId && authorId === currentUserId);
      } catch (error) {
        console.error("Error fetching user data:", error);
        showError(`Błąd ładowania danych użytkownika: ${error.message}`);
        setCreatorName("Błąd ładowania autora");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [authorId, currentUserId]);

  return {
    creatorName,
    isAdmin,
    isOwner,
    loading,
  };
};
