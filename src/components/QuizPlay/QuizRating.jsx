import { useEffect, useState } from "react";
import StarRating from "./StarRating";
import { auth, db } from "../../firebase";
import { doc, setDoc, getDoc, updateDoc, increment } from "firebase/firestore";

export default function QuizRating({ quizId }) {
  const [userRating, setUserRating] = useState(0);
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    const fetchUserRating = async () => {
      if (!userId || !quizId) return;
      const ratingDoc = await getDoc(
        doc(db, "quizRatings", `${quizId}_${userId}`),
      );
      if (ratingDoc.exists()) {
        setUserRating(ratingDoc.data().rating);
      }
    };
    fetchUserRating();
  }, [quizId, userId]);

  const handleSetRating = async (rating) => {
    if (!userId || !quizId) return;
    console.log("Ustawiono ocenę: ", rating);
    const ratingRef = doc(db, "quizRatings", `${quizId}_${userId}`);
    const quizRef = doc(db, "quizzes", quizId);

    const prevDoc = await getDoc(ratingRef);
    let prevRating = 0;
    if (prevDoc.exists()) prevRating = prevDoc.data().rating;

    await setDoc(ratingRef, { quizId, userId, rating });

    if (prevDoc.exists()) {
      // Nadpisanie starej oceny
      await updateDoc(quizRef, {
        ratingsSum: increment(rating - prevRating),
      });
    } else {
      // Pierwsza ocena użytkownika
      await updateDoc(quizRef, {
        ratingsSum: increment(rating),
        ratingsCount: increment(1),
      });
    }
    setUserRating(rating);
  };

  return (
    <section className="bg-surface border-border my-6 rounded-xl border p-4 shadow-sm">
      <h3 className="text-primary mb-2 text-lg font-semibold">
        Oceń ten quiz:
      </h3>
      <StarRating
        maxRating={5}
        defaultRating={userRating}
        onSetRating={handleSetRating}
      />
    </section>
  );
}
