// src/services/firestore.js
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  orderBy,
  limit,
  startAfter,
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

// Fetch quizzes with pagination
export const getQuizzesWithPagination = async (authorId, limitCount = 10, lastDoc = null, fallbackOffset = 0) => {
  try {
    const quizzesRef = collection(db, "quizzes");
    let q = query(
      quizzesRef, 
      where("authorId", "==", authorId),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );

    if (lastDoc) {
      q = query(
        quizzesRef,
        where("authorId", "==", authorId), 
        orderBy("createdAt", "desc"),
        startAfter(lastDoc),
        limit(limitCount)
      );
    }

    const querySnapshot = await getDocs(q);
    const quizzes = querySnapshot.docs.map((doc) => ({ 
      id: doc.id, 
      ...doc.data(),
      _doc: doc // Store document reference for pagination
    }));

    return {
      quizzes,
      lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1],
      hasMore: querySnapshot.docs.length === limitCount,
      fallbackOffset: null // Not used in normal flow
    };
  } catch (error) {
    // Check if it's an index-related error
    const isIndexError = error.code === 'failed-precondition' || 
                        error.message.includes('index') || 
                        error.message.includes('requires an index') ||
                        error.message.includes('composite index');
    
    if (isIndexError) {
      console.log("Index still building, using fallback query...");
      try {
        // Use simple query without orderBy (no index required)
        const quizzesRef = collection(db, "quizzes");
        const simpleQuery = query(
          quizzesRef,
          where("authorId", "==", authorId),
          limit(50) // Get more docs to sort manually
        );

        const querySnapshot = await getDocs(simpleQuery);
        let allQuizzes = querySnapshot.docs.map((doc) => ({ 
          id: doc.id, 
          ...doc.data(),
          _doc: doc
        }));

        // Sort manually by createdAt (newest first)
        allQuizzes.sort((a, b) => {
          const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt || 0);
          const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt || 0);
          return dateB - dateA;
        });

        // Manual pagination
        const startIndex = fallbackOffset || 0;
        const endIndex = startIndex + limitCount;
        const paginatedQuizzes = allQuizzes.slice(startIndex, endIndex);
        const hasMore = endIndex < allQuizzes.length;

        return {
          quizzes: paginatedQuizzes,
          lastDoc: null, // Not used in fallback
          hasMore,
          fallbackOffset: endIndex,
          isUsingFallback: true // Flag to show user that indexes are building
        };
      } catch (fallbackError) {
        console.error("Fallback query also failed:", fallbackError);
        throw new Error(`Nie udało się załadować quizów. Spróbuj ponownie za chwilę.`);
      }
    }
    
    // For non-index errors, log and throw
    console.error("Error fetching quizzes with pagination:", error);
    throw error;
  }
};
