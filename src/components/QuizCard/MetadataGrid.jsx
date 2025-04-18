import InfoItem from "./InfoItem";
import {
  FaStar,
  FaSignal,
  FaUser,
  FaFolder,
  FaCalendar,
  FaLock,
  FaGlobe,
} from "react-icons/fa";

const formatDate = (date) => {
  return date
    ? date.toDate
      ? date.toDate().toLocaleDateString("pl-PL") // Handle Firestore Timestamp
      : new Date(date).toLocaleDateString("pl-PL")
    : "brak";
};

export default function MetadataGrid({
  creatorName,
  category,
  questionCount,
  createdAt,
  visibility,
}) {
  return (
    <div className="mx-a grid grid-cols-2 justify-between gap-1 py-4">
      <InfoItem
        icon={<FaUser className="text-base text-gray-500 sm:text-lg" />}
        text={creatorName}
        label={`Autor: ${creatorName}`}
      />
      <InfoItem
        icon={<FaFolder className="text-base text-gray-500 sm:text-lg" />}
        text={category || "brak"}
        label="Kategoria" // Restored category
      />
      <InfoItem
        icon={<FaSignal className="text-base text-gray-500 sm:text-lg" />}
        text={questionCount}
        label="Liczba pytań" // Corrected label
      />
      <InfoItem
        icon={<FaStar className="text-base text-yellow-400 sm:text-lg" />}
        text="brak" // Placeholder for avgRating
        label="Średnia ocena"
      />
      <InfoItem
        icon={<FaCalendar className="text-base text-gray-500 sm:text-lg" />}
        text={formatDate(createdAt)}
        label="Data stworzenia"
      />
      <InfoItem
        icon={
          visibility === "public" ? (
            <FaGlobe className="text-base text-gray-500 sm:text-lg" />
          ) : (
            <FaLock className="text-base text-gray-500 sm:text-lg" />
          )
        }
        text={visibility === "public" ? "Publiczny" : "Prywatny"}
        label="Widoczność"
      />
    </div>
  );
}
