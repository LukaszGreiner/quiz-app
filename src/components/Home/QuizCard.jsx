import {
  FaStar,
  FaSignal,
  FaUser,
  FaFolder,
  FaCalendar,
  FaLock,
  FaGlobe,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import { auth } from "../../firebase";
import QuizActions from "./QuizActions";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function QuizCard({
  id,
  image,
  name,
  description,
  visibility: initialVisibility,
  createdBy,
  category,
  questions = [],
  createdAt,
  currentUserId,
}) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [creatorName, setCreatorName] = useState(createdBy);
  const [visibility, setVisibility] = useState(initialVisibility);

  const isOwner = currentUserId && createdBy === currentUserId;
  const questionCount = Array.isArray(questions) ? questions.length : 0;

  useEffect(() => {
    if (currentUserId) {
      auth.currentUser
        .getIdTokenResult()
        .then((idTokenResult) => {
          setIsAdmin(!!idTokenResult.claims.admin);
        })
        .catch((error) => {
          console.error("Błąd podczas sprawdzania roli admina:", error);
          setIsAdmin(false);
        });
    }

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
        setCreatorName("Unknown");
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

  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString("pl-PL") : "brak";
  };

  const quizData = {
    visibility,
    questions,
    imagePath: image,
  };

  return (
    <div className="relative flex w-full max-w-[400px] min-w-[280px] flex-col rounded-xl bg-white p-3 shadow-md transition duration-300 hover:shadow-lg sm:p-4">
      <div className="absolute top-2 right-2">
        <QuizActions
          quizId={id}
          quizData={quizData}
          isOwner={isOwner}
          isAdmin={isAdmin}
          visibility={visibility}
          setVisibility={setVisibility}
        />
      </div>

      <div className="flex flex-col items-center sm:flex-row sm:items-start">
        <img
          src={image || "https://placehold.co/128x128.png?text=Brak%20obrazu"}
          alt={`Obraz quizu ${name}`}
          className="mb-3 h-24 w-24 rounded-lg object-cover sm:mr-4 sm:mb-0 sm:h-32 sm:w-32"
          onError={(e) =>
            (e.target.src =
              "https://placehold.co/128x128.png?text=Brak%20obrazu")
          }
        />

        <div className="flex w-full flex-1 flex-col">
          <h4 className="text-dark mb-2 text-center text-lg font-semibold break-words sm:text-left sm:text-xl">
            {name}
          </h4>
          {description && (
            <p className="text-secondary mb-2 text-center text-xs break-words sm:mb-3 sm:text-left sm:text-sm">
              {description}
            </p>
          )}

          <div className="mb-4 grid grid-cols-2 gap-3 text-xs sm:mb-6 sm:gap-2 sm:text-sm">
            <div className="group relative flex items-center justify-start gap-1 sm:gap-2">
              <div className="w-5 flex-shrink-0 sm:w-6">
                <FaUser
                  className="text-base text-gray-500 sm:text-lg"
                  aria-label={`Autor: ${creatorName}`}
                />
              </div>
              <span className="max-w-[80px] cursor-default truncate sm:max-w-[100px] md:max-w-[120px]">
                {creatorName}
              </span>
              <div className="absolute top-full z-20 mt-2 hidden rounded bg-gray-800 px-2 py-1 text-xs text-white group-hover:block">
                Autor
              </div>
            </div>
            <div className="group relative flex items-center justify-start gap-1 sm:gap-2">
              <div className="w-5 flex-shrink-0 sm:w-6">
                <FaFolder
                  className="text-base text-gray-500 sm:text-lg"
                  aria-label={`Kategoria: ${category || "brak"}`}
                />
              </div>
              <span className="max-w-[80px] cursor-default truncate sm:max-w-[100px] md:max-w-[120px]">
                {category || "brak"}
              </span>
              <div className="absolute top-full z-20 mt-2 hidden rounded bg-gray-800 px-2 py-1 text-xs text-white group-hover:block">
                Kategoria
              </div>
            </div>
            <div className="group relative flex items-center justify-start gap-1 sm:gap-2">
              <div className="w-5 flex-shrink-0 sm:w-6">
                <FaSignal
                  className={`${getDifficultyColor(questionCount)} text-base sm:text-lg`}
                  aria-label={`Poziom trudności: ${questionCount} pytań`}
                />
              </div>
              <span className="cursor-default">{questionCount}</span>
              <div className="absolute top-full z-20 mt-2 hidden rounded bg-gray-800 px-2 py-1 text-xs text-white group-hover:block">
                Poziom trudności
              </div>
            </div>
            <div className="group relative flex items-center justify-start gap-1 sm:gap-2">
              <div className="w-5 flex-shrink-0 sm:w-6">
                <FaStar
                  className="text-base text-yellow-400 sm:text-lg"
                  aria-label="Średnia ocena: brak"
                />
              </div>
              <span className="cursor-default">brak</span>
              <div className="absolute top-full z-20 mt-2 hidden rounded bg-gray-800 px-2 py-1 text-xs text-white group-hover:block">
                Średnia ocena
              </div>
            </div>
            <div className="group relative flex items-center justify-start gap-1 sm:gap-2">
              <div className="w-5 flex-shrink-0 sm:w-6">
                <FaCalendar
                  className="text-base text-gray-500 sm:text-lg"
                  aria-label={`Data stworzenia: ${formatDate(createdAt)}`}
                />
              </div>
              <span className="cursor-default">{formatDate(createdAt)}</span>
              <div className="absolute top-full z-20 mt-2 hidden rounded bg-gray-800 px-2 py-1 text-xs text-white group-hover:block">
                Data stworzenia
              </div>
            </div>
            <div className="group relative flex items-center justify-start gap-1 sm:gap-2">
              <div className="w-5 flex-shrink-0 sm:w-6">
                {visibility === "public" ? (
                  <FaGlobe
                    className="text-base text-gray-500 sm:text-lg"
                    aria-label={`Widoczność: ${visibility === "public" ? "Publiczny" : "Prywatny"}`}
                  />
                ) : (
                  <FaLock
                    className="text-base text-gray-500 sm:text-lg"
                    aria-label={`Widoczność: ${visibility === "public" ? "Publiczny" : "Prywatny"}`}
                  />
                )}
              </div>
              <span className="cursor-default">
                {visibility === "public" ? "Publiczny" : "Prywatny"}
              </span>
              <div className="absolute top-full z-20 mt-2 hidden rounded bg-gray-800 px-2 py-1 text-xs text-white group-hover:block">
                Widoczność
              </div>
            </div>
          </div>

          <div className="text-center sm:text-left">
            <a
              href={`/quiz/${id}`}
              className="bg-success inline-block w-full rounded-full px-4 py-1.5 text-center text-sm font-semibold text-white transition duration-300 hover:bg-blue-400 sm:w-auto sm:px-5 sm:py-2 sm:text-base"
            >
              Rozpocznij Quiz
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
