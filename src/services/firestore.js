// src/services/firestore.js
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";

// Fetch quizzes by authorId
export const getQuizzesByAuthorId = async (authorId) => {
  try {
    const quizzesRef = collection(db, "quizzes");
    const q = query(quizzesRef, where("authorId", "==", authorId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching quizzes by authorId:", error);
    throw error;
  }
};

// Fetch all documents from a collection
export const getCollectionDocs = async (collectionName) => {
  try {
    const q = query(collection(db, collectionName));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching collection:", error);
    throw error;
  }
};

// Fetch documents with a condition
export const getFilteredDocs = async (
  collectionName,
  field,
  operator,
  value,
) => {
  try {
    const q = query(
      collection(db, collectionName),
      where(field, operator, value),
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching filtered docs:", error);
    throw error;
  }
};

// Fetch a single document by ID
export const getDocById = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error("Error fetching document:", error);
    throw error;
  }
};
