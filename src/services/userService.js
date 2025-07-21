import { collection, getDocs, query, where, doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export const userService = {
  async getUserByUsername(username) {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username));
    const profileSnapshot = await getDocs(q);

    if (!profileSnapshot.empty) {
      const userDoc = profileSnapshot.docs[0];
      return {
        ...userDoc.data(),
        id: userDoc.id,
      };
    }
    return null;
  },

  async getUserById(userId) {
    try {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        return {
          id: userSnap.id,
          ...userSnap.data()
        };
      }
      return null;
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      throw error;
    }
  },

  async updateUserProfile(userId, profileData) {
    try {
      console.log("Updating user profile for userId:", userId);
      console.log("Profile data being saved:", profileData);
      
      const userRef = doc(db, "users", userId);
      
      // Check if user document exists first
      const userSnap = await getDoc(userRef);
      
      const updateData = {
        ...profileData,
        updatedAt: new Date()
      };
      
      if (userSnap.exists()) {
        // Update existing document
        console.log("Updating existing user document");
        await updateDoc(userRef, updateData);
      } else {
        // Create new document
        console.log("Creating new user document");
        await setDoc(userRef, {
          ...updateData,
          createdAt: new Date()
        });
      }
      
      console.log("Profile updated successfully in Firestore");
      return updateData;
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  },

  async createOrUpdateUser(userId, userData) {
    try {
      const userRef = doc(db, "users", userId);
      const data = {
        ...userData,
        updatedAt: new Date(),
        createdAt: new Date()
      };
      
      await setDoc(userRef, data, { merge: true });
      return data;
    } catch (error) {
      console.error("Error creating/updating user:", error);
      throw error;
    }
  },

  // Debug function to check what's actually in the database
  async debugUserProfile(userId) {
    try {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        console.log("User document exists:");
        console.log("Document ID:", userSnap.id);
        console.log("Document data:", userSnap.data());
        return userSnap.data();
      } else {
        console.log("No user document found for ID:", userId);
        return null;
      }
    } catch (error) {
      console.error("Error debugging user profile:", error);
      throw error;
    }
  }
};
