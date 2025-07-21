import { useState } from "react";
import { CheckCircle, XCircle, Loader2, Save, User } from "lucide-react";
import { useUsernameValidation } from "../../hooks/useUsernameValidation";
import Btn from "../common/Btn";

function ProfileSettings({
  initialUsername,
  initialUserType,
  initialGoal,
  initialDescription,
  onSave,
  saving = false,
}) {
  const [username, setUsername] = useState(initialUsername);
  const [userType, setUserType] = useState(initialUserType);
  const [goal, setGoal] = useState(initialGoal);
  const [description, setDescription] = useState(initialDescription);
  const [localError, setLocalError] = useState(null);

  // Use username validation hook
  const {
    validationState: { isValid: isUsernameValid, error: usernameMessage },
    isChecking: isCheckingUsername,
    validateUsername: checkUsername,
  } = useUsernameValidation(initialUsername);

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    setLocalError(null); // Clear local errors when user starts typing
    checkUsername(value);
  };

  const handleSave = async () => {
    try {
      setLocalError(null);
      
      // Validation
      if (!username.trim()) {
        setLocalError("Nazwa użytkownika jest wymagana");
        return;
      }
      
      if (!isUsernameValid && username !== initialUsername) {
        setLocalError("Nazwa użytkownika nie jest prawidłowa");
        return;
      }
      
      await onSave({ username, userType, goal, description });
    } catch (err) {
      console.error("Failed to save profile:", err);
      setLocalError(err.message || "Wystąpił błąd podczas zapisywania");
    }
  };

  const hasChanges = 
    username !== initialUsername ||
    userType !== initialUserType ||
    goal !== initialGoal ||
    description !== initialDescription;

  return (
    <div className="bg-surface-elevated border-border rounded-xl border p-6 shadow-lg">
      <div className="mb-6 flex items-center gap-3">
        <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
          <User className="text-primary h-5 w-5" />
        </div>
        <div>
          <h2 className="font-heading text-text text-xl font-bold">
            Ustawienia Profilu
          </h2>
          <p className="font-body text-text-muted text-sm">
            Zaktualizuj swoje dane osobowe
          </p>
        </div>
      </div>

      {localError && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-sm text-red-800 dark:text-red-200">{localError}</p>
        </div>
      )}

      <div className="space-y-6">
        {" "}
        {/* Username */}
        <div>
          <label className="font-body text-text mb-2 block text-sm font-medium">
            Nazwa użytkownika
          </label>
          <div className="relative">
            <input
              type="text"
              value={username}
              onChange={handleUsernameChange}
              placeholder="Wprowadź swoją nazwę użytkownika"
              className={`border-border bg-surface text-text font-body focus:border-primary focus:ring-primary/20 w-full rounded-lg border p-3 pr-10 transition-all duration-200 focus:ring-2 focus:outline-none ${
                username.trim() &&
                username !== initialUsername &&
                isUsernameValid
                  ? "border-green-500 ring-green-500/20"
                  : username.trim() &&
                      username !== initialUsername &&
                      !isUsernameValid
                    ? "border-red-500 ring-red-500/20"
                    : ""
              }`}
            />
            {username.trim() && username !== initialUsername && (
              <div className="absolute top-1/2 right-3 -translate-y-1/2">
                {isCheckingUsername ? (
                  <Loader2 className="text-text-muted h-5 w-5 animate-spin" />
                ) : isUsernameValid ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
            )}
          </div>
          {username.trim() &&
            username !== initialUsername &&
            usernameMessage && (
              <p
                className={`font-body mt-2 text-sm ${
                  isUsernameValid ? "text-green-600" : "text-red-600"
                }`}
              >
                {usernameMessage}
              </p>
            )}
        </div>
        
        {/* User Type */}
        <div>
          <label className="font-body text-text mb-2 block text-sm font-medium">
            Typ użytkownika
          </label>
          <select
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            className="border-border bg-surface text-text font-body focus:border-primary focus:ring-primary/20 w-full cursor-pointer appearance-none rounded-lg border p-3 transition-all duration-200 focus:ring-2 focus:outline-none"
          >
            <option value="Student">Student</option>
            <option value="Uczeń">Uczeń</option>
            <option value="Nauczyciel">Nauczyciel</option>
            <option value="Wykładowca">Wykładowca</option>
            <option value="Pracownik">Pracownik</option>
            <option value="Ankieter">Ankieter</option>
            <option value="Inne">Inne</option>
          </select>
        </div>
        {/* Goal */}
        <div>
          <label className="font-body text-text mb-2 block text-sm font-medium">
            Główny cel
          </label>
          <select
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="border-border bg-surface text-text font-body focus:border-primary focus:ring-primary/20 w-full cursor-pointer appearance-none rounded-lg border p-3 transition-all duration-200 focus:ring-2 focus:outline-none"
          >
            <option value="Własny rozwój">Własny rozwój</option>
            <option value="Nauczanie">Nauczanie</option>
            <option value="Badania">Badania</option>
            <option value="Rozrywka">Rozrywka</option>
          </select>
        </div>
        
        {/* Description */}
        <div>
          <label className="font-body text-text mb-2 block text-sm font-medium">
            O mnie
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border-border bg-surface text-text font-body focus:border-primary focus:ring-primary/20 w-full resize-none rounded-lg border p-3 transition-all duration-200 focus:ring-2 focus:outline-none"
            rows="4"
            placeholder="Opowiedz o sobie, swoich zainteresowaniach i celach..."
            maxLength={500}
          />
          <div className="mt-2 flex items-center justify-between">
            <p className="font-body text-text-muted text-xs">
              To będzie widoczne na twoim publicznym profilu
            </p>
            <p className="font-body text-text-muted text-xs">
              {description.length}/500
            </p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="border-border-muted mt-8 flex justify-end border-t pt-6">
        <Btn
          variant="primary"
          size="md"
          onClick={handleSave}
          disabled={!hasChanges || saving || (username !== initialUsername && (!isUsernameValid || isCheckingUsername))}
          className="flex items-center gap-2"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saving ? "Zapisywanie..." : "Zapisz zmiany"}
        </Btn>
      </div>
    </div>
  );
}

export default ProfileSettings;
