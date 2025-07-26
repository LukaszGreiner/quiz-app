import { useStreak } from "../../hooks/useStreak";
import { useAuth } from "../../context/AuthContext";
import { streakService } from "../../services/streakService";
import { useState } from "react";
import Btn from "../common/Btn";
import StreakReviveModal from "../Header/StreakReviveModal";

function StreakDebugInfo() {
  const { currentUser } = useAuth();
  const { 
    streakData, 
    loading, 
    simulateStreakLoss, 
    reviveStreak, 
    recalculateStreak,
    clearCache 
  } = useStreak();
  const [testModalOpen, setTestModalOpen] = useState(false);

  if (!currentUser) {
    return <div className="bg-red-100 p-4 rounded">Nie zalogowany</div>;
  }

  if (loading) {
    return <div className="bg-yellow-100 p-4 rounded">Ładowanie danych streak...</div>;
  }

  const handleSimulateStreakLoss = async () => {
    try {
      console.log("Przed symulacją:", streakData);
      const result = await simulateStreakLoss();
      console.log("Po symulacji:", result);
      alert("Symulowano utratę passy! Sprawdź konsolę i odśwież stronę.");
      window.location.reload();
    } catch (error) {
      console.error("Błąd symulacji:", error);
      alert("Błąd: " + error.message);
    }
  };

  const handleReviveStreak = async () => {
    try {
      console.log("Przed przywróceniem:", streakData);
      const result = await reviveStreak();
      console.log("Po przywróceniu:", result);
      alert("Passa została przywrócona! Sprawdź konsolę i odśwież stronę.");
      window.location.reload();
    } catch (error) {
      console.error("Błąd przywracania:", error);
      alert("Błąd: " + error.message);
    }
  };

  const handleRefreshStreakData = async () => {
    try {
      // Clear local cache first
      localStorage.removeItem(`streak_${currentUser.uid}`);
      
      // This will force reload streak data and trigger migration if needed
      const freshData = await streakService.getUserStreak(currentUser.uid);
      console.log("Fresh streak data:", freshData);
      alert("Dane streak odświeżone! Sprawdź konsolę.");
      window.location.reload();
    } catch (error) {
      console.error("Błąd odświeżania:", error);
      alert("Błąd: " + error.message);
    }
  };

  const handleClearCache = () => {
    clearCache();
    localStorage.removeItem('reviveModalShown');
    alert("Cache wyczyszczony! Odśwież stronę.");
    window.location.reload();
  };

  const handleCompareData = async () => {
    try {
      // Get data from cache
      const cacheData = localStorage.getItem(`streak_${currentUser.uid}`);
      const parsedCache = cacheData ? JSON.parse(cacheData) : null;
      
      // Get fresh data from database
      const freshData = await streakService.getUserStreak(currentUser.uid);
      const freshStats = await streakService.getStreakStats(currentUser.uid);
      
      console.log("=== DATA COMPARISON ===");
      console.log("Cache data:", parsedCache);
      console.log("Fresh getUserStreak:", freshData);
      console.log("Fresh getStreakStats:", freshStats);
      console.log("Current hook data:", streakData);
      console.log("======================");
      
      alert("Sprawdź konsolę - porównanie danych cache vs baza");
    } catch (error) {
      console.error("Error comparing data:", error);
      alert("Błąd: " + error.message);
    }
  };

  const handleRecalculateStreak = async () => {
    try {
      console.log("Recalculating streak from quiz history...");
      const result = await recalculateStreak();
      console.log("Streak recalculated:", result);
      alert("Streak został przeliczony na podstawie historii quizów! Odśwież stronę.");
      window.location.reload();
    } catch (error) {
      console.error("Error recalculating streak:", error);
      alert("Błąd: " + error.message);
    }
  };

  return (
    <div className="bg-background p-4 rounded mb-4">
      <h3 className="font-bold mb-2">Debug Streak Data:</h3>
      <div className="text-sm space-y-1">
        <div>User ID: {currentUser.uid}</div>
        <div>Current Streak: {streakData?.currentStreak || 0}</div>
        <div>Can Revive: <span className={streakData?.canRevive ? "text-green-600 font-bold" : "text-red-600"}>{streakData?.canRevive ? "TAK" : "NIE"}</span></div>
        <div>Lost Streak Length: {streakData?.lostStreakLength || 0}</div>
        <div>Revives Used: {streakData?.revivesUsed || 0}</div>
        <div>Max Revives: {streakData?.maxRevives || 0}</div>
        <div>Revive Expires At: {streakData?.reviveExpiresAt || "Brak"}</div>
        <div>Last Streak Loss: {streakData?.lastStreakLoss || "Brak"}</div>
        <div>Loading: {loading ? "TAK" : "NIE"}</div>
        <div>Cache Key: streak_{currentUser.uid}</div>
        
        <div className="mt-3 flex gap-2 flex-wrap">
          <Btn 
            variant="secondary" 
            size="sm" 
            onClick={handleRefreshStreakData}
          >
            Odśwież dane streak
          </Btn>
          
          <Btn 
            variant="secondary" 
            size="sm" 
            onClick={handleClearCache}
          >
            Wyczyść cache
          </Btn>
          
          <Btn 
            variant="secondary" 
            size="sm" 
            onClick={handleCompareData}
          >
            Porównaj dane
          </Btn>
          
          <Btn 
            variant="secondary" 
            size="sm" 
            onClick={() => setTestModalOpen(true)}
          >
            Test Modal
          </Btn>
          
          <Btn 
            variant="danger" 
            size="sm" 
            onClick={handleSimulateStreakLoss}
          >
            Symuluj utratę passy
          </Btn>
          
          {streakData?.canRevive && (
            <Btn 
              variant="primary" 
              size="sm" 
              onClick={handleReviveStreak}
            >
              Przywróć passę
            </Btn>
          )}
        </div>
        
        <div className="mt-2 p-2 bg-background rounded">
          <strong>Pełne dane streak:</strong>
          <pre className="text-xs overflow-auto max-h-32">
            {JSON.stringify(streakData, null, 2)}
          </pre>
        </div>
      </div>
        {/* Test Modal */}
      <StreakReviveModal 
        isOpen={testModalOpen} 
        onClose={() => setTestModalOpen(false)} 
      />
      </div>
  );
}

export default StreakDebugInfo;
