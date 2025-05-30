import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import {
  User,
  Users,
  Target,
  Calendar,
  Globe,
  Sparkles,
  CheckCircle,
  XCircle,
  Loader2,
  X,
} from "lucide-react";
import Btn from "../components/common/Btn";
import Logo from "../components/common/Logo";
import { showSuccess, showError } from "../utils/toastUtils";
import { useUsernameValidation } from "../hooks/useUsernameValidation";
import { userProfileConfig } from "../config/userProfileConfig";

function ProfileSetup() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    displayName: "",
    age: "",
    gender: "",
    userType: "",
    goal: "",
    sourceOfKnowledge: "",
    description: "",
    interests: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const totalSteps = 3;
  // Use username validation hook for displayName
  const {
    validationState: { isValid: isDisplayNameValid, error: displayNameMessage },
    isChecking: isCheckingDisplayName,
    validateUsername: checkDisplayName,
  } = useUsernameValidation();
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Check displayName validation in real-time
    if (field === "displayName") {
      checkDisplayName(value);
    }
  };

  const handleInterestToggle = (interestId) => {
    setFormData((prev) => {
      const currentInterests = prev.interests;
      const isSelected = currentInterests.includes(interestId);

      if (isSelected) {
        // Remove interest
        return {
          ...prev,
          interests: currentInterests.filter((id) => id !== interestId),
        };
      } else {
        // Add interest if under limit
        if (currentInterests.length < userProfileConfig.MAX_INTERESTS) {
          return {
            ...prev,
            interests: [...currentInterests, interestId],
          };
        }
        return prev;
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      // Aktualizuj dokument użytkownika w Firestore
      const userDocRef = doc(db, "users", currentUser.uid);
      await updateDoc(userDocRef, {
        ...formData,
        profileCompleted: true,
        profileCompletedAt: new Date().toISOString(),
      });

      showSuccess("Profil został pomyślnie ukończony!");
      navigate("/user/details");
    } catch (error) {
      console.error("Błąd podczas zapisywania profilu:", error);
      showError("Wystąpił błąd podczas zapisywania profilu");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  const isStepValid = () => {
    switch (step) {
      case 1:
        return (
          formData.displayName.trim() &&
          isDisplayNameValid &&
          formData.age &&
          formData.gender
        );
      case 2:
        return formData.userType && formData.goal;
      case 3:
        return formData.sourceOfKnowledge && formData.interests.length > 0;
      default:
        return false;
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="mb-8 text-center">
        <div className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          <User className="text-primary h-8 w-8" />
        </div>
        <h2 className="text-text mb-2 text-2xl font-bold">
          Podstawowe informacje
        </h2>
        <p className="text-text-muted">Opowiedz nam coś o sobie</p>
      </div>{" "}
      <div>
        <label className="font-quicksand text-text-muted mb-2 block text-sm font-medium">
          Jak chcesz być nazywany/a? *
        </label>
        <div className="relative">
          <input
            type="text"
            value={formData.displayName}
            onChange={(e) => handleInputChange("displayName", e.target.value)}
            placeholder="Wpisz swoje imię lub pseudonim"
            className={`border-border bg-surface text-text font-quicksand focus:border-border-focus focus:ring-primary/20 w-full rounded-xl border p-3 pr-10 transition-all duration-200 focus:ring-2 focus:outline-none ${
              formData.displayName.trim() && isDisplayNameValid
                ? "border-correct ring-correct/20"
                : formData.displayName.trim() && !isDisplayNameValid
                  ? "border-incorrect ring-incorrect/20"
                  : ""
            }`}
            required
          />
          {formData.displayName.trim() && (
            <div className="absolute top-1/2 right-3 -translate-y-1/2">
              {isCheckingDisplayName ? (
                <Loader2 className="text-text-muted h-5 w-5 animate-spin" />
              ) : isDisplayNameValid ? (
                <CheckCircle className="text-correct h-5 w-5" />
              ) : (
                <XCircle className="text-incorrect h-5 w-5" />
              )}
            </div>
          )}
        </div>
        {formData.displayName.trim() && displayNameMessage && (
          <p
            className={`font-quicksand mt-2 text-sm ${
              isDisplayNameValid ? "text-correct" : "text-incorrect"
            }`}
          >
            {displayNameMessage}
          </p>
        )}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="font-quicksand text-text-muted mb-2 block text-sm font-medium">
            Wiek *
          </label>
          <select
            value={formData.age}
            onChange={(e) => handleInputChange("age", e.target.value)}
            className="border-border bg-surface text-text font-quicksand focus:border-border-focus focus:ring-primary/20 w-full cursor-pointer appearance-none rounded-xl border p-3 transition-all duration-200 focus:ring-2 focus:outline-none"
            required
          >
            <option value="">Wybierz wiek</option>
            <option value="13-17">13-17 lat</option>
            {/* Nastolatkowie (uczniowie, gimnazjum/liceum) */}
            <option value="18-25">18-24 lata</option>
            {/* Studenci, młodzi dorośli */}
            <option value="25-34">25-34 lata</option>
            {/* Młodzi profesjonaliści, absolwenci */}
            <option value="35-44">35-44 lata</option>
            {/* Dorośli, uczący się dla rozwoju */}
            <option value="45+">45+ lat</option>
            {/* Starsi użytkownicy, rzadziej spotykani w edukacyjnych aplikacjach, ale nie wykluczeni */}
          </select>
        </div>

        <div>
          <label className="font-quicksand text-text-muted mb-2 block text-sm font-medium">
            Płeć *
          </label>
          <select
            value={formData.gender}
            onChange={(e) => handleInputChange("gender", e.target.value)}
            className="border-border bg-surface text-text font-quicksand focus:border-border-focus focus:ring-primary/20 w-full cursor-pointer appearance-none rounded-xl border p-3 transition-all duration-200 focus:ring-2 focus:outline-none"
            required
          >
            <option value="">Wybierz płeć</option>
            <option value="female">Kobieta</option>
            <option value="male">Mężczyzna</option>
            <option value="other">Inna</option>
            <option value="prefer-not-to-say">Wolę nie mówić</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="mb-8 text-center">
        <div className="bg-secondary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          <Users className="text-secondary h-8 w-8" />
        </div>
        <h2 className="text-text mb-2 text-2xl font-bold">Kim jesteś?</h2>
        <p className="text-text-muted">
          Pomóż nam dostosować doświadczenie do Twoich potrzeb
        </p>
      </div>

      <div>
        <label className="font-quicksand text-text-muted mb-2 block text-sm font-medium">
          Status/Rola *
        </label>
        <select
          value={formData.userType}
          onChange={(e) => handleInputChange("userType", e.target.value)}
          className="border-border bg-surface text-text font-quicksand focus:border-border-focus focus:ring-primary/20 w-full cursor-pointer appearance-none rounded-xl border p-3 transition-all duration-200 focus:ring-2 focus:outline-none"
          required
        >
          <option value="">Wybierz swoją rolę</option>
          <option value="uczen">
            🧒 Uczeń – szkoła podstawowa / liceum / technikum
          </option>
          <option value="student">🎓 Student – szkoła wyższa / uczelnia</option>
          <option value="pracownik">
            👨‍💻 Pracujący dorosły – rozwój osobisty lub zawodowy
          </option>
          <option value="nauczyciel">
            👩‍🏫 Nauczyciel / Wykładowca – tworzy quizy lub prowadzi zajęcia
          </option>
          <option value="hobby">
            📚 Entuzjasta nauki – dla przyjemności i rozwoju
          </option>
          <option value="ankieter">
            📋 Ankieter / Badacz – zbiera dane i analizuje wyniki
          </option>
          <option value="inne">❓ Inne – niepasująca do powyższych</option>
        </select>
      </div>

      <div>
        <label className="font-quicksand text-text-muted mb-2 block text-sm font-medium">
          Główny cel korzystania z aplikacji *
        </label>
        <select
          value={formData.goal}
          onChange={(e) => handleInputChange("goal", e.target.value)}
          className="border-border bg-surface text-text font-quicksand focus:border-border-focus focus:ring-primary/20 w-full cursor-pointer appearance-none rounded-xl border p-3 transition-all duration-200 focus:ring-2 focus:outline-none"
          required
        >
          <option value="">🎯 Wybierz główny cel</option>
          <option value="nauka">🧠 Nauka - zdobywanie wiedzy ogólnej</option>
          <option value="sprawdzanie-wiedzy">
            📊 Sprawdzanie swojej wiedzy
          </option>
          <option value="rozrywka">🧩 Zabawa i rozrywka</option>
          <option value="tworzenie-testow">👩‍🏫 Tworzenie testów i quizów</option>
          <option value="inne">❓ Inne</option>
        </select>
      </div>
    </div>
  );
  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="mb-8 text-center">
        <div className="bg-accent/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          <Globe className="text-accent h-8 w-8" />
        </div>
        <h2 className="text-text mb-2 text-2xl font-bold">
          Finalizacja profilu
        </h2>
        <p className="text-text-muted">
          Ostatnie informacje, które pomogą nam dostosować aplikację
        </p>
      </div>
      <div>
        <label className="font-quicksand text-text-muted mb-2 block text-sm font-medium">
          Jak dowiedziałeś/aś się o naszej aplikacji? *
        </label>
        <select
          value={formData.sourceOfKnowledge}
          onChange={(e) =>
            handleInputChange("sourceOfKnowledge", e.target.value)
          }
          className="border-border bg-surface text-text font-quicksand focus:border-border-focus focus:ring-primary/20 w-full cursor-pointer appearance-none rounded-xl border p-3 transition-all duration-200 focus:ring-2 focus:outline-none"
          required
        >
          <option value="">🔍 Wybierz źródło</option>
          <option value="friend-recommendation">👫 Polecenie znajomego</option>
          <option value="google">🌐 Wyszukiwarka Google</option>
          <option value="social-media">📱 Media społecznościowe</option>
          <option value="school">👩‍🏫 Przez szkołę / uczelnię</option>
          <option value="app-store">🛒 Google Play / App store</option>
          <option value="advertisement">📢 Reklama</option>
          <option value="other">❓ Inne</option>
        </select>
      </div>{" "}
      <div>
        <label className="font-quicksand text-text-muted mb-2 block text-sm font-medium">
          Twoje zainteresowania * (wybierz minimum 1, maksimum{" "}
          {userProfileConfig.MAX_INTERESTS})
        </label>
        <div className="flex flex-wrap gap-2">
          {userProfileConfig.AVAILABLE_INTERESTS.map((interest) => {
            const isSelected = formData.interests.includes(interest.id);
            const canSelect =
              formData.interests.length < userProfileConfig.MAX_INTERESTS;
            return (
              <button
                key={interest.id}
                type="button"
                onClick={() => handleInterestToggle(interest.id)}
                disabled={!isSelected && !canSelect}
                className={`font-quicksand cursor-pointer rounded-full border px-3 py-1.5 text-sm transition-all duration-200 ${
                  isSelected
                    ? "bg-primary border-primary text-text-inverse"
                    : canSelect
                      ? "border-border bg-surface text-text hover:border-primary hover:bg-primary/10"
                      : "border-border bg-surface-elevated text-text-muted cursor-not-allowed opacity-50"
                }`}
              >
                {isSelected && <X className="mr-1 inline h-3 w-3" />}
                {interest.label}
              </button>
            );
          })}
        </div>
        <p className="font-quicksand text-text-muted mt-2 text-xs">
          Wybrane: {formData.interests.length}/{userProfileConfig.MAX_INTERESTS}
        </p>
      </div>
      <div>
        <label className="font-quicksand text-text-muted mb-2 block text-sm font-medium">
          Coś o sobie (opcjonalnie)
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => {
            const value = e.target.value;
            if (value.length <= userProfileConfig.MAX_DESCRIPTION_LENGTH) {
              handleInputChange("description", value);
            }
          }}
          placeholder="Opowiedz nam coś o swoich zainteresowaniach, doświadczeniu lub tym, co chciałbyś osiągnąć..."
          className={`border-border bg-surface text-text font-quicksand focus:border-border-focus focus:ring-primary/20 w-full resize-none rounded-xl border p-3 transition-all duration-200 focus:ring-2 focus:outline-none ${
            formData.description.length >
            userProfileConfig.MAX_DESCRIPTION_LENGTH * 0.9
              ? "border-warning"
              : ""
          }`}
          rows="4"
        />
        <div className="mt-2 flex items-center justify-between">
          <p className="font-quicksand text-text-muted text-xs">
            Te informacje pomogą nam lepiej dostosować aplikację do Twoich
            potrzeb
          </p>
          <p
            className={`font-quicksand text-xs ${
              formData.description.length >
              userProfileConfig.MAX_DESCRIPTION_LENGTH * 0.9
                ? "text-warning"
                : "text-text-muted"
            }`}
          >
            {formData.description.length}/
            {userProfileConfig.MAX_DESCRIPTION_LENGTH}
          </p>
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (step) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return renderStep1();
    }
  };

  return (
    <div className="bg-background flex min-h-screen w-screen flex-col items-center p-6">
      <div className="w-full max-w-2xl">
        <Logo className="mb-8 flex justify-center" />

        {/* Progress indicator */}
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-center">
            <div className="flex items-center space-x-4">
              {[1, 2, 3].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-200 ${
                      step >= stepNumber
                        ? "bg-primary border-primary text-text-inverse"
                        : "border-border bg-surface text-text-muted"
                    }`}
                  >
                    {step > stepNumber ? (
                      <Sparkles className="h-5 w-5" />
                    ) : (
                      stepNumber
                    )}
                  </div>
                  {stepNumber < 3 && (
                    <div
                      className={`ml-4 h-0.5 w-16 transition-all duration-200 ${
                        step > stepNumber ? "bg-primary" : "bg-border"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
          <p className="text-text-muted text-center text-sm">
            Krok {step} z {totalSteps}
          </p>
        </div>

        <div className="bg-surface-elevated border-border rounded-2xl border p-8 shadow-lg">
          <form onSubmit={handleSubmit}>
            {renderCurrentStep()}

            <div className="mt-8 flex justify-between">
              <Btn
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={step === 1}
                className="flex items-center gap-2"
              >
                ← Wstecz
              </Btn>

              {step < totalSteps ? (
                <Btn
                  type="button"
                  variant="primary"
                  onClick={nextStep}
                  disabled={!isStepValid()}
                  className="flex items-center gap-2"
                >
                  Dalej →
                </Btn>
              ) : (
                <Btn
                  type="submit"
                  variant="primary"
                  disabled={!isStepValid() || isSubmitting}
                  className="flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="border-text-inverse h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                      Zapisywanie...
                    </>
                  ) : (
                    <>
                      <Target className="h-4 w-4" />
                      Zakończ
                    </>
                  )}
                </Btn>
              )}
            </div>
          </form>
        </div>

        <div className="mt-6 text-center">
          <p className="text-text-muted text-sm">
            Możesz zmienić te informacje później w ustawieniach profilu
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProfileSetup;
