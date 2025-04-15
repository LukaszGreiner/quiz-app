import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

function Profile() {
  const { uuid } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log(uuid);

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

  if (loading) return <p>Ładowanie profilu...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Profil</h2>
      {profile && (
        <div>
          <p>
            <strong>Nazwa użytkownika:</strong> {profile.username}
          </p>
          <p>
            <strong>Email:</strong> {profile.email}
          </p>
          <p>
            <strong>Administrator:</strong> {profile.isAdmin ? "Tak" : "Nie"}
          </p>
          <p>
            <strong>Utworzono:</strong>{" "}
            {new Date(profile.createdAt).toLocaleString()}
          </p>
          <p>
            <strong>Ostatnie logowanie:</strong>{" "}
            {profile.lastLogin
              ? new Date(profile.lastLogin).toLocaleString()
              : "Brak danych"}
          </p>
        </div>
      )}
    </div>
  );
}

export default Profile;
