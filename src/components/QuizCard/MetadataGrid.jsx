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

export default function MetadataGrid({ quiz, overlay = false }) {
  const rawAvgRating = quiz?.ratingsSum / quiz?.ratingsCount;

  // Calculate stats
  const playsCountText = getPlaysCountText(quiz);
  const avgRatingText = getAvgRatingText(quiz);

  if (overlay) {
    // Compact overlay version for image overlay
    return (
      <div className="flex items-center gap-2">
        {/* Rating */}
        <div className="flex items-center gap-1 rounded-full bg-black/50 px-2 py-1 backdrop-blur-sm">
          <StarLevel rating={rawAvgRating || 0} />
          <span className="text-xs font-medium text-white">
            {avgRatingText}
          </span>
        </div>

        {/* Plays count */}
        <div className="flex items-center gap-1 rounded-full bg-black/50 px-2 py-1 backdrop-blur-sm">
          <SignalLevel count={quiz?.playsCount} />
          <span className="text-xs font-medium text-white">
            {playsCountText}
          </span>
        </div>
      </div>
    );
  }

  const avgScoreText = getAvgScoreText(quiz, quiz.questions?.length || 0);
  const avgCompletionTimeText = getAvgCompletionTimeText(quiz);
  return (
    <div className="grid grid-cols-2 gap-2 text-xs">
      {/* Always show plays and rating */}
      <InfoItem
        icon={<SignalLevel count={quiz?.playsCount} />}
        text={playsCountText}
        label="Liczba zagrań"
        compact={true}
      />
      <InfoItem
        icon={<StarLevel rating={rawAvgRating || 0} />}
        text={avgRatingText}
        label="Średnia ocena"
        compact={true}
      />

      {/* Show additional stats only if quiz has been played */}
      {quiz?.playsCount > 0 && (
        <>
          <InfoItem
            icon={<FaMedal className="text-accent text-xs" />}
            text={avgScoreText}
            label="Średni wynik"
            compact={true}
          />
          <InfoItem
            icon={<FaClock className="text-text-muted text-xs" />}
            text={avgCompletionTimeText}
            label="Średni czas"
            compact={true}
          />
        </>
      )}
    </div>
  );
}
