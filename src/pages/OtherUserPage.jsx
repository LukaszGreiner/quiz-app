import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import ProfileImageEditor from "../components/UserPage/ProfileImageEditor";
import ProfileInfo from "../components/UserPage/ProfileInfo";
import CreatedQuizzes from "../components/UserPage/CreatedQuizzes";

function Profile() {
  const { uuid } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        const profileDoc = doc(db, "users", uuid);
        const profileSnapshot = await getDoc(profileDoc);

        if (profileSnapshot.exists()) {
          setProfile(profileSnapshot.data());
        } else {
          setError("Nie znaleziono takiego użytkownika");
        }
      } catch (err) {
        setError("Wystąpił błąd podczas pobierania danych: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [uuid]);

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
          creationTime={profile?.createdAt}
          lastLogin={lastLogin}
        />
        <CreatedQuizzes uid={uuid} />
      </div>
    </div>
  );
}

export default Profile;
