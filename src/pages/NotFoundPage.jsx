import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div>
      <h1>Nie znaleziono takiej podstrony!</h1>
      <Link to={"/"}>
        <button>Wróć do strony głównej</button>
      </Link>
    </div>
  );
}
