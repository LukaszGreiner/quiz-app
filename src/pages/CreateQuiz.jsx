import { useEffect, useState } from "react";
import QuizForm from "../components/QuizForm/QuizForm";
import useLocalStorage from "../hooks/useLocalStorage";
import { DEFAULT_FORM_VALUES } from "../hooks/useQuizForm";

export default function CreateQuiz() {
  const [initialValues, setInitialValues] = useState(null);
  const { getItem } = useLocalStorage();

  // Auto-load from localStorage when component mounts
  useEffect(() => {
    const savedForm = getItem("createQuizFormState");
    if (savedForm) {
      setInitialValues(savedForm);
    } else {
      setInitialValues(DEFAULT_FORM_VALUES);
    }
  }, [getItem]);

  if (!initialValues) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  return <QuizForm defaultValues={initialValues} />;
}
