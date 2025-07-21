import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { userService } from "../services/userService";

export const useCurrentUserProfile = () => {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user data when component mounts or user changes
  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) {
        setUserData(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const data = await userService.getUserById(currentUser.uid);
        setUserData(data);
      } catch (err) {
        console.error("Error fetching current user data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser]);

  // Update user data
  const updateUserData = async (profileData) => {
    if (!currentUser) {
      throw new Error("Musisz być zalogowany, aby zaktualizować profil");
    }

    try {
      const updatedData = await userService.updateUserProfile(currentUser.uid, profileData);
      
      // Update local state
      setUserData(prevData => ({
        ...prevData,
        ...updatedData
      }));
      
      return updatedData;
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  };

  // Create or update user (for initial setup)
  const createOrUpdateUser = async (userData) => {
    if (!currentUser) {
      throw new Error("Musisz być zalogowany, aby utworzyć profil");
    }

    try {
      const data = await userService.createOrUpdateUser(currentUser.uid, userData);
      setUserData(data);
      return data;
    } catch (error) {
      console.error("Error creating/updating user:", error);
      throw error;
    }
  };

  return {
    userData,
    loading,
    error,
    updateUserData,
    createOrUpdateUser,
    refetch: async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await userService.getUserById(currentUser.uid);
        setUserData(data);
      } catch (err) {
        console.error("Error refetching user data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };
};
