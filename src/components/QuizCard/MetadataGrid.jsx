import SignalLevel from "../CustomIcons/SignalLevel";
import StarLevel from "../CustomIcons/StarLevel";
import InfoItem from "./InfoItem";
import { FaStar, FaUser, FaFolder } from "react-icons/fa";

export default function MetadataGrid({ creatorName, quiz }) {
  const avgRating = quiz?.ratingsSum / quiz?.ratingsCount;
  console.log(quiz, avgRating);
  return (
    <div className="mx-a grid grid-cols-2 justify-between gap-1 py-4">
      <InfoItem
        icon={<FaUser className="text-base text-gray-500 sm:text-lg" />}
        text={creatorName || "brak"}
        label="Autor"
      />
      <InfoItem
        icon={<FaFolder className="text-base text-gray-500 sm:text-lg" />}
        text={quiz?.category || "brak"}
        label="Kategoria"
      />
      <InfoItem
        icon={<SignalLevel count={quiz?.playsCount} />}
        text={quiz?.playsCount ?? "0"}
        label="Liczba zagrań"
      />
      <InfoItem
        icon={<StarLevel rating={avgRating || 0} />}
        text={avgRating ? avgRating.toFixed(1) : 0}
        label="Średnia ocena"
      />
    </div>
  );
}
