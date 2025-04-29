import { useParams } from "react-router-dom";
import ProfileImageEditor from "../components/UserPage/ProfileImageEditor";
import ProfileInfo from "../components/UserPage/ProfileInfo";
import CreatedQuizzes from "../components/UserPage/CreatedQuizzes";
import { useUserProfile } from "../hooks/useUserProfile";

function Profile() {
  const { username } = useParams();
  const { profile, userId, loading, error } = useUserProfile(username);

  if (loading) return <p className="text-center">Ładowanie profilu...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  const lastLogin = profile.lastLogin
    ? new Date(profile.lastLogin).toLocaleString()
    : "Brak danych";

  return (
    <div className="mx-auto mt-12 max-w-2xl px-4">
      <div className="bg-background rounded-xl p-8 shadow-lg transition-all hover:shadow-xl">
        <h1 className="font-montserrat text-dark mb-8 text-center text-4xl font-bold tracking-tight">
          Profil użytkownika: {profile?.username || "Użytkownik"}
        </h1>
        <ProfileImageEditor
          initialImage={profile?.photoURL || "/profile_icon.jpg"}
          readOnly
        />
        <ProfileInfo
          displayName={profile?.username}
          userId={userId}
          creationTime={profile?.createdAt}
          lastLogin={lastLogin}
        />
        <CreatedQuizzes authorId={userId} />
      </div>
    </div>
  );
}

export default Profile;
