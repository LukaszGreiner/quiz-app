import { useParams } from "react-router-dom";
import ProfileImageEditor from "../components/UserPage/ProfileImageEditor";
import ProfileInfo from "../components/UserPage/ProfileInfo";
import CreatedQuizzes from "../components/UserPage/CreatedQuizzes";

function OtherUserPage() {
  const { uid } = useParams();

  // Statyczne dane użytkownika dla prototypu
  const user = {
    uid: uid || "prototype-user",
    username: "Prototypowy Użytkownik",
    photoURL: "/profile_icon.jpg",
    description: "To jest przykładowy użytkownik dla prototypu.",
    userType: "Uczeń",
    goal: "Własny rozwój",
    creationTime: new Date("2023-01-01").toISOString(),
    lastLogin: new Date("2025-04-15").toISOString(),
  };

  const lastLogin = user.lastLogin
    ? new Date(user.lastLogin).toLocaleString()
    : "Nieznany";

  return (
    <div className="mx-auto mt-12 max-w-2xl px-4">
      <div className="rounded-xl bg-background p-8 shadow-lg transition-all hover:shadow-xl">
        <h1 className="mb-8 text-center font-montserrat text-4xl font-bold tracking-tight text-dark">
          Profil użytkownika: {user.username}
        </h1>
        <ProfileImageEditor initialImage={user.photoURL} readOnly />
        <ProfileInfo
          displayName={user.username}
          creationTime={user.creationTime}
          lastLogin={lastLogin}
        />
        <CreatedQuizzes uid={user.uid} />
      </div>
    </div>
  );
}

export default OtherUserPage;