import { FaStar, FaHeart, FaSignal } from "react-icons/fa";
import { useState, useEffect } from "react";
import { auth } from "../firebase";
import QuizActions from "./QuizActions";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function QuizCard({
  id,
  image,
  name,
  visibility: initialVisibility,
  createdBy,
  questions = [],
  currentUserId,
}) {
  const [isLiked, setIsLiked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [creatorName, setCreatorName] = useState(createdBy); // Default to ID until name is fetched
  const [visibility, setVisibility] = useState(initialVisibility); // Lifted state for visibility

  const isOwner = currentUserId && createdBy === currentUserId;

  // Check admin role and fetch creator's displayName
  useEffect(() => {
    if (currentUserId) {
      // Check admin status
      auth.currentUser
        .getIdTokenResult()
        .then((idTokenResult) => {
          const adminStatus = !!idTokenResult.claims.admin;
          setIsAdmin(adminStatus);
        })
        .catch((error) => {
          console.error("Błąd podczas sprawdzania roli admina:", error);
          setIsAdmin(false);
        });
    }

    // Fetch creator's displayName
    const fetchCreatorName = async () => {
      try {
        const user = await new Promise((resolve) => {
          const unsubscribe = onAuthStateChanged(getAuth(), (u) => {
            if (u && u.uid === createdBy) resolve(u);
            unsubscribe();
          });
        });
        setCreatorName(user.displayName || "Anonymous");
      } catch (error) {
        console.error("Błąd podczas pobierania nazwy twórcy:", error);
        setCreatorName("Unknown"); // Fallback if fetch fails
      }
    };

    if (createdBy && createdBy !== currentUserId) {
      fetchCreatorName();
    } else if (createdBy === currentUserId) {
      setCreatorName(auth.currentUser?.displayName || "Ty");
    }
  }, [currentUserId, createdBy]);

  const getDifficultyColor = (questionCount) => {
    if (questionCount <= 5) return "text-green-500";
    if (questionCount <= 10) return "text-yellow-500";
    return "text-red-500";
  };

  const handleLikeToggle = () => {
    setIsLiked((prev) => !prev);
  };

  const questionCount = Array.isArray(questions) ? questions.length : 0;

  const quizData = {
    visibility,
    questions,
    imagePath: image, // Adjust if image is a URL vs path
  };

  return (
    <div className="relative flex w-full max-w-[500px] min-w-[300px] flex-col items-center rounded-xl bg-white p-4 shadow-md transition duration-300 hover:shadow-lg md:max-w-[600px] md:min-w-0 md:flex-row lg:w-[calc(50%-1rem)] lg:max-w-none">
      <button
        onClick={handleLikeToggle}
        className="absolute top-2 right-2 p-1 focus:outline-none"
        title="Like this quiz"
      >
        <FaHeart
          className={`text-2xl ${isLiked ? "text-red-500" : "text-gray-300"} transition-colors duration-200 hover:text-red-400`}
        />
      </button>

      <div className="absolute top-2 right-10">
        <QuizActions
          quizId={id}
          quizData={quizData}
          isOwner={isOwner}
          isAdmin={isAdmin}
          visibility={visibility}
          setVisibility={setVisibility}
        />
      </div>

      <img
        src={image || "https://placehold.co/128x128.png?text=Brak%20obrazu"}
        alt={`Obraz quizu ${name}`}
        className="mb-4 h-32 w-32 rounded-lg object-cover md:mr-6 md:mb-0 md:h-40 md:w-40"
        onError={(e) =>
          (e.target.src = "https://placehold.co/128x128.png?text=Brak%20obrazu")
        }
      />

      <div className="flex-1 text-center md:text-left">
        <h4 className="text-dark mb-2 text-xl font-semibold">{name}</h4>
        <p className="text-secondary mb-4">
          Widoczność: {visibility === "public" ? "Publiczny" : "Prywatny"}
          <br />
          Twórca: {creatorName}
        </p>

        <div className="mb-4 flex justify-center gap-4 md:justify-start">
          <div className="flex items-center gap-1" title="Average Score">
            <FaStar className="text-yellow-400" />
            <span>N/A</span>
          </div>
          <div className="flex items-center gap-1" title="Likes">
            <FaHeart className="text-red-500" />
            <span>{isLiked ? 1 : 0}</span>
          </div>
          <div className="flex items-center gap-1" title="Difficulty">
            <FaSignal className={getDifficultyColor(questionCount)} />
            <span>{questionCount} pytań</span>
          </div>
        </div>

        <a
          href={`/quiz/${id}`}
          className="bg-success inline-block rounded-full px-5 py-2 font-semibold text-white transition duration-300 hover:bg-blue-400"
        >
          Rozpocznij Quiz
        </a>
      </div>
    </div>
  );
}
