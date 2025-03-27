// debugFirebase.js
import { auth, storage } from "./firebase"; // Adjust path to your Firebase config file
import {
  ref,
  deleteObject,
  getDownloadURL,
  getMetadata,
} from "firebase/storage";

export const debugDelete = async () => {
  try {
    // Verify auth
    const user = auth.currentUser;
    if (!user) {
      throw new Error("No authenticated user found. Please log in.");
    }
    console.log("User:", user.uid);
    await user.getIdToken(true); // Refresh token
    console.log("Token refreshed");

    // Verify file
    const imagePath =
      "images/nddY792B6NdoUeAZlycEFWbeepp1/Quiz bez nazwy-1743018970362";
    const imageRef = ref(storage, imagePath);
    const url = await getDownloadURL(imageRef);
    console.log("File URL:", url);
    const metadata = await getMetadata(imageRef);
    console.log("Metadata:", metadata);

    // Attempt delete
    await deleteObject(imageRef);
    console.log("Deleted successfully");
  } catch (error) {
    console.error("Error:", error.code, error.message);
    throw error; // Re-throw to handle in QuizForm if needed
  }
};
