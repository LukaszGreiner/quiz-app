import { collection, getDocs, query, where } from "firebase/firestore";
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
};
