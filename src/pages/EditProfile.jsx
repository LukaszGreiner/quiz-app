import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Settings, Shield } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useCurrentUserProfile } from "../hooks/useCurrentUserProfile";
import { userService } from "../services/userService";
import Btn from "../components/common/Btn";
import LoadingAnimation from "../components/common/LoadingAnimation";
import ProfileSettings from "../components/UserPage/ProfileSettings";
import AccountActions from "../components/UserPage/AccountActions";
import { showSuccess, showError } from "../utils/toastUtils";

function EditProfile() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { userData, loading: userDataLoading, updateUserData } = useCurrentUserProfile();
  
  const [saving, setSaving] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  const handleSaveProfile = async (profileData) => {
    try {
      console.log("EditProfile - Saving profile data:", profileData);
      setSaving(true);
      await updateUserData(profileData);
      showSuccess("Profil został zaktualizowany pomyślnie!");
      navigate("/user/details");
    } catch (error) {
      console.error("Błąd podczas zapisywania profilu:", error);
      showError("Nie udało się zaktualizować profilu. Spróbuj ponownie.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Błąd podczas wylogowywania:", error);
      showError("Wystąpił błąd podczas wylogowywania");
    }
  };

  // Debug function to check database
  const handleDebugProfile = async () => {
    if (!currentUser) return;
    
    try {
      const dbData = await userService.debugUserProfile(currentUser.uid);
      console.log("=== DEBUG: Current user profile in database ===");
      console.log("User ID:", currentUser.uid);
      console.log("Database data:", dbData);
      console.log("Local userData:", userData);
    } catch (error) {
      console.error("Debug error:", error);
    }
  };

  if (userDataLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <LoadingAnimation />
      </div>
    );
  }

  if (!currentUser) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-12">
      {/* Header */}
      <div className="mb-8">
        <Btn
          variant="ghost"
          size="sm"
          onClick={() => navigate("/user/details")}
          className="mb-4 inline-flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Powrót do profilu
        </Btn>
        
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
            <User className="text-primary h-6 w-6" />
          </div>
          <div>
            <h1 className="font-heading text-text text-2xl font-bold sm:text-3xl">
              Edytuj Profil
            </h1>
            <p className="font-body text-text-muted text-sm sm:text-base">
              Zaktualizuj swoje dane osobowe i ustawienia konta
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <ProfileSettings
            initialUsername={userData?.username || ""}
            initialUserType={userData?.userType || "Not specified"}
            initialGoal={userData?.goal || "Not specified"}
            initialDescription={userData?.description || ""}
            onSave={handleSaveProfile}
            saving={saving}
          />
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Account Actions */}
          <AccountActions onLogout={handleLogout} />
          
          {/* Quick Actions */}
          <div className="bg-surface-elevated border-border rounded-xl border p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="bg-accent/10 flex h-10 w-10 items-center justify-center rounded-full">
                <Settings className="text-accent h-5 w-5" />
              </div>
              <div>
                <h3 className="font-heading text-text text-lg font-semibold">
                  Szybkie Akcje
                </h3>
                <p className="font-body text-text-muted text-sm">
                  Przydatne opcje
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <Btn
                variant="ghost"
                size="sm"
                to="/user/statistics"
                className="w-full justify-start"
              >
                <Shield className="mr-2 h-4 w-4" />
                Zobacz statystyki
              </Btn>
              
              <Btn
                variant="ghost"
                size="sm"
                to="/user/details"
                className="w-full justify-start"
              >
                <User className="mr-2 h-4 w-4" />
                Podgląd profilu
              </Btn>
              
              {/* Debug button - remove in production */}
              <Btn
                variant="secondary"
                size="sm"
                onClick={handleDebugProfile}
                className="w-full justify-start"
              >
                🐛 Debug profilu
              </Btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
