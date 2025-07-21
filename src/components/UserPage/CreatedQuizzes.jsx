// src/componen  const INITIAL_LIMIT = isOverview ? 4 : 4; // 4 quizy domyślnie
  const LOAD_MORE_LIMIT = 4; // 4 quizy przy "Załaduj więcej"/CreatedQuizzes.jsx
import React, { useState, useEffect } from "react";
import { getQuizzesWithPagination } from "../../services/firestore";
import QuizCard from "../QuizCard/QuizCard";
import Btn from "../common/Btn";
import { FileText, Plus, AlertTriangle, Loader, ChevronDown } from "lucide-react";

const CreatedQuizzes = ({ authorId, isOverview = false }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [fallbackOffset, setFallbackOffset] = useState(0); // For fallback pagination
  const [isUsingFallback, setIsUsingFallback] = useState(false); // Track if using fallback

  const INITIAL_LIMIT = isOverview ? 4 : 4; // 4 quizy domyślnie
  const LOAD_MORE_LIMIT = 4; // 4 quizy przy "Załaduj więcej"

  useEffect(() => {
    const fetchInitialQuizzes = async () => {
      try {
        setLoading(true);
        if (authorId) {
          const result = await getQuizzesWithPagination(authorId, INITIAL_LIMIT, null, 0);
          setQuizzes(result.quizzes);
          setLastDoc(result.lastDoc);
          setHasMore(result.hasMore);
          setFallbackOffset(result.fallbackOffset || INITIAL_LIMIT);
          setIsUsingFallback(result.isUsingFallback || false);
        } else {
          setQuizzes([]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialQuizzes();
  }, [authorId]);

  const loadMoreQuizzes = async () => {
    if (!hasMore || loadingMore) return;

    try {
      setLoadingMore(true);
      const result = await getQuizzesWithPagination(authorId, LOAD_MORE_LIMIT, lastDoc, fallbackOffset);
      
      setQuizzes(prevQuizzes => [...prevQuizzes, ...result.quizzes]);
      setLastDoc(result.lastDoc);
      setHasMore(result.hasMore);
      if (result.fallbackOffset !== null) {
        setFallbackOffset(result.fallbackOffset);
      }
      if (result.isUsingFallback !== undefined) {
        setIsUsingFallback(result.isUsingFallback);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingMore(false);
    }
  };
  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="animate-pulse">
          <div className="bg-surface mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <Loader className="text-text-muted h-8 w-8 animate-spin" />
          </div>
          <p className="font-quicksand text-text-muted">
            Ładowanie twoich quizów...
          </p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="py-12 text-center">
        <div className="bg-incorrect/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          <AlertTriangle className="text-incorrect h-8 w-8" />
        </div>
        <p className="font-quicksand text-text mb-2">Błąd podczas ładowania quizów</p>
        <p className="font-quicksand text-text-muted text-sm">{error}</p>
      </div>
    );
  }
  return (
    <div>
      {" "}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
            <FileText className="text-primary h-5 w-5" />
          </div>
          <div>
            <h2 className="font-montserrat text-text text-xl font-bold">
              Stworzone Quizy
            </h2>
            <p className="font-quicksand text-text-muted text-sm">
              {quizzes.length} quiz{quizzes.length === 1 ? '' : quizzes.length < 5 ? 'y' : 'ów'} utworzon{quizzes.length === 1 ? 'y' : 'ych'}
            </p>
          </div>
        </div>
        <Btn
          variant="primary"
          size="md"
          className="flex items-center gap-2"
          to="/newquiz"
        >
          <Plus className="h-4 w-4" />
          Stwórz nowy
        </Btn>
      </div>
      
      {/* Fallback mode notification */}
      {isUsingFallback && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-900/20">
          <div className="flex items-center gap-2">
            <Loader className="h-4 w-4 animate-spin text-amber-600 dark:text-amber-400" />
            <p className="text-sm text-amber-800 dark:text-amber-200">
              Baza danych się aktualizuje. Quizy są ładowane w trybie rezerwowym.
            </p>
          </div>
        </div>
      )}
      
      {quizzes.length === 0 ? (
        <div className="py-12 text-center">
          <div className="bg-surface mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full">
            <Plus className="text-text-muted h-10 w-10" />
          </div>
          <h3 className="font-montserrat text-text mb-2 text-lg font-semibold">
            Nie utworzono jeszcze żadnych quizów
          </h3>
          <p className="font-quicksand text-text-muted mx-auto mb-6 max-w-md">
            Zacznij tworzyć angażujące quizy, aby dzielić się nimi z innymi. Twoje quizy pojawią się tutaj po ich utworzeniu.
          </p>
          <Btn
            variant="primary"
            size="lg"
            className="inline-flex items-center gap-2"
            to="/newquiz"
          >
            <Plus className="h-4 w-4" />
            Stwórz pierwszy quiz
          </Btn>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="group">
              <QuizCard quiz={quiz} />
            </div>
          ))}
        </div>
      )}

      {/* Load More Button */}
      {quizzes.length > 0 && hasMore && (
        <div className="mt-6 text-center">
          <Btn
            variant="secondary"
            size="md"
            onClick={loadMoreQuizzes}
            disabled={loadingMore}
            className="inline-flex items-center gap-2"
          >
            {loadingMore ? (
              <>
                <Loader className="h-4 w-4 animate-spin" />
                Ładowanie...
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Załaduj więcej
              </>
            )}
          </Btn>
        </div>
      )}

      {/* Show total count info */}
      {quizzes.length > 0 && (
        <div className="mt-4 text-center">
          <p className="text-text-muted text-sm">
            Wyświetlono {quizzes.length} quiz{quizzes.length === 1 ? '' : quizzes.length < 5 ? 'y' : 'ów'}
            {!hasMore && ' (wszystkie)'}
          </p>
        </div>
      )}
    </div>
  );
};

export default CreatedQuizzes;
