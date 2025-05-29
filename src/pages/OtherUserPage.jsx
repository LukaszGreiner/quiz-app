import { useParams } from "react-router-dom";
import ProfileImageEditor from "../components/UserPage/ProfileImageEditor";
import ProfileInfo from "../components/UserPage/ProfileInfo";
import CreatedQuizzes from "../components/UserPage/CreatedQuizzes";
import { useUserProfile } from "../hooks/useUserProfile";

function Profile() {
  const { username } = useParams();
  const { profile, userId, loading, error } = useUserProfile(username);

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-text-muted text-center text-lg">
          Ładowanie profilu...
        </p>
      </div>
    );
  if (error)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-incorrect text-center text-lg">{error}</p>
      </div>
    );

  const lastLogin = profile.lastLogin
    ? new Date(profile.lastLogin).toLocaleString()
    : "Brak danych";

  return (
    <div className="bg-background min-h-screen py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="bg-surface border-border rounded-2xl border p-6 shadow-lg transition-all duration-300 hover:shadow-xl sm:p-8">
          <div className="mb-8 text-center">
            <h1 className="text-text text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Profil użytkownika
            </h1>
            <p className="text-primary mt-2 text-lg font-medium">
              {profile?.username || "Użytkownik"}
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex justify-center">
              <ProfileImageEditor
                initialImage={profile?.photoURL || "/profile_icon.jpg"}
                readOnly
              />
            </div>

            <div className="bg-surface-elevated border-border hover:border-border-focus rounded-xl border p-6 transition-all duration-200">
              <ProfileInfo
                displayName={profile?.username}
                userId={userId}
                creationTime={profile?.createdAt}
                lastLogin={lastLogin}
              />
            </div>

            <div className="bg-surface-elevated border-border hover:border-border-focus rounded-xl border p-6 transition-all duration-200">
              <CreatedQuizzes authorId={userId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
