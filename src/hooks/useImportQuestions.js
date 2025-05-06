import { useRef } from "react";

/**
 * Custom hook to handle importing questions from file (.txt, .csv) into the quiz form.
 */
export default function useImportQuestions(onImportQuestions) {
  const fileInputRef = useRef(null);

  // TXT parser
  const parseQuestionsFromTxt = (text) => {
    return text
      .split(/\n\s*\n/) // split by blank lines
      .map((block) => block.trim())
      .filter(Boolean)
      .map((block) => {
        const lines = block
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean);
        if (lines.length < 5) return null;
        return {
          title: lines[0],
          correctAnswer: lines[1],
          wrongAnswers: [lines[2], lines[3], lines[4]],
          image: null,
        };
      })
      .filter(Boolean);
  };

  // CSV parser
  const parseQuestionsFromCsv = (text) => {
    // Expecting: Question,Correct,Wrong1,Wrong2,Wrong3
    const rows = text
      .split(/\r?\n/)
      .map((row) => row.split(",").map((cell) => cell.trim()))
      .filter((row) => row.length >= 5 && row[0]);
    return rows.map((row) => ({
      title: row[0],
      correctAnswer: row[1],
      wrongAnswers: [row[2], row[3], row[4]],
      image: null,
    }));
  };

  // File select button handler
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // allow re-uploading the same file
      fileInputRef.current.click();
    }
  };

  // File input change handler
  const handleFileChange = (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    let allQuestions = [];

    const readFile = (file, callback) => {
      const ext = file.name.split(".").pop().toLowerCase();
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        let questions = [];
        if (ext === "txt") {
          questions = parseQuestionsFromTxt(text);
        } else if (ext === "csv") {
          questions = parseQuestionsFromCsv(text);
        }
        callback(questions, ext);
      };
      reader.readAsText(file);
    };

    let filesProcessed = 0;
    for (let i = 0; i < files.length; i++) {
      readFile(files[i], (questions, ext) => {
        if (questions.length) {
          allQuestions = allQuestions.concat(questions);
        }
        filesProcessed++;
        if (filesProcessed === files.length) {
          if (allQuestions.length && typeof onImportQuestions === "function") {
            onImportQuestions(allQuestions);
          } else {
            alert("Nie udało się zaimportować pytań. Sprawdź format plików.");
          }
        }
      });
    }
  };

  return {
    fileInputRef,
    handleButtonClick,
    handleFileChange,
  };
}
