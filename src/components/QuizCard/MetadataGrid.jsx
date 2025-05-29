import {
  getAvgCompletionTimeText,
  getAvgRatingText,
  getAvgScoreText,
  getPlaysCountText,
} from "../../utils/quizUtils";
import SignalLevel from "../CustomIcons/SignalLevel";
import StarLevel from "../CustomIcons/StarLevel";
import InfoItem from "./InfoItem";
import { FaUser, FaFolder, FaClock, FaMedal } from "react-icons/fa";

export default function MetadataGrid({ creatorName, quiz }) {
  const rawAvgRating = quiz?.ratingsSum / quiz?.ratingsCount;

  const creatorText = creatorName || "brak";
  const categoryText = quiz?.category || "brak";

  // Calculate additional stats
  const playsCountText = getPlaysCountText(quiz);
  const avgRatingText = getAvgRatingText(quiz);
  const avgScoreText = getAvgScoreText(quiz, quiz.questions.length);
  const avgCompletionTimeText = getAvgCompletionTimeText(quiz);
  // console.log(quiz, rawAvgRating); // debugging line
  return (
    <div className="grid grid-cols-2 gap-3">
      <InfoItem
        icon={<FaUser className="text-text-muted text-sm" />}
        text={creatorText}
        label="Autor"
      />
      <InfoItem
        icon={<FaFolder className="text-text-muted text-sm" />}
        text={categoryText}
        label="Kategoria"
      />
      <InfoItem
        icon={<SignalLevel count={quiz?.playsCount} />}
        text={playsCountText}
        label="Liczba zagrań"
      />
      <InfoItem
        icon={<StarLevel rating={rawAvgRating || 0} />} // Use rawAvgRating for the StarLevel component
        text={avgRatingText}
        label="Średnia ocena"
      />
      <InfoItem
        icon={<FaMedal className="text-accent text-sm" />}
        text={avgScoreText}
        label="Średni wynik"
      />
      <InfoItem
        icon={<FaClock className="text-text-muted text-sm" />}
        text={avgCompletionTimeText}
        label="Średni czas"
      />
    </div>
  );
}
