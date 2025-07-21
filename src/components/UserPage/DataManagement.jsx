import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Download, Upload, Trash2, FileText } from "lucide-react";
import Btn from "../common/Btn";
import { showSuccess, showError } from "../../utils/toastUtils";

function DataManagement() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleExportData = async () => {
    try {
      setLoading(true);
      
      // Mock implementation - replace with real data export
      const userData = {
        userId: currentUser.uid,
        email: currentUser.email,
        exportDate: new Date().toISOString(),
        quizHistory: [], // Add real quiz history
        streakData: {}, // Add real streak data
        achievements: [], // Add real achievements
      };

      const dataStr = JSON.stringify(userData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `quiz-app-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      showSuccess("Dane zostały wyeksportowane pomyślnie!");
    } catch (error) {
      console.error("Error exporting data:", error);
      showError("Nie udało się wyeksportować danych");
    } finally {
      setLoading(false);
    }
  };

  const handleDataReport = () => {
    // Mock data summary
    const report = `
=== RAPORT DANYCH UŻYTKOWNIKA ===

ID Użytkownika: ${currentUser.uid}
Email: ${currentUser.email}
Data utworzenia konta: ${new Date(currentUser.metadata.creationTime).toLocaleDateString('pl-PL')}
Ostatnie logowanie: ${new Date(currentUser.metadata.lastSignInTime || currentUser.metadata.creationTime).toLocaleDateString('pl-PL')}

=== STATYSTYKI ===
- Rozwiązane quizy: Ładowanie...
- Obecna passa: Ładowanie...
- Ulubiona kategoria: Ładowanie...

=== UWAGI ===
Ten raport zawiera podstawowe informacje o Twoim koncie.
Pełny eksport danych możesz pobrać używając przycisku "Eksportuj dane".
    `;

    const reportBlob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(reportBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `raport-danych-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showSuccess("Raport został wygenerowany!");
  };

  return (
    <div className="bg-surface-elevated border-border rounded-xl border p-6">
      <h3 className="text-text mb-4 text-lg font-semibold">Zarządzanie danymi</h3>
      
      <div className="space-y-4">
        <div className="border-border rounded-lg border p-4">
          <div className="mb-3 flex items-center gap-3">
            <Download className="text-blue-500 h-5 w-5" />
            <div>
              <h4 className="text-text font-medium">Eksport danych</h4>
              <p className="text-text-muted text-sm">
                Pobierz wszystkie swoje dane w formacie JSON
              </p>
            </div>
          </div>
          <Btn
            variant="secondary"
            size="sm"
            onClick={handleExportData}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            <Download className="mr-2 h-4 w-4" />
            {loading ? "Eksportowanie..." : "Eksportuj dane"}
          </Btn>
        </div>

        <div className="border-border rounded-lg border p-4">
          <div className="mb-3 flex items-center gap-3">
            <FileText className="text-green-500 h-5 w-5" />
            <div>
              <h4 className="text-text font-medium">Raport danych</h4>
              <p className="text-text-muted text-sm">
                Wygeneruj czytelny raport Twoich danych
              </p>
            </div>
          </div>
          <Btn
            variant="secondary"
            size="sm"
            onClick={handleDataReport}
            className="w-full sm:w-auto"
          >
            <FileText className="mr-2 h-4 w-4" />
            Wygeneruj raport
          </Btn>
        </div>

        <div className="border-border rounded-lg border p-4">
          <div className="mb-3 flex items-center gap-3">
            <Upload className="text-purple-500 h-5 w-5" />
            <div>
              <h4 className="text-text font-medium">Import danych</h4>
              <p className="text-text-muted text-sm">
                Przywróć dane z wcześniejszego eksportu
              </p>
            </div>
          </div>
          <Btn
            variant="secondary"
            size="sm"
            disabled
            className="w-full sm:w-auto opacity-50"
          >
            <Upload className="mr-2 h-4 w-4" />
            Wkrótce dostępne
          </Btn>
        </div>

        <div className="border-danger/20 bg-danger/5 rounded-lg border p-4">
          <div className="mb-3 flex items-center gap-3">
            <Trash2 className="text-danger h-5 w-5" />
            <div>
              <h4 className="text-danger font-medium">Usuń wszystkie dane</h4>
              <p className="text-text-muted text-sm">
                Trwale usuń wszystkie swoje dane (nie można cofnąć)
              </p>
            </div>
          </div>
          <Btn
            variant="danger"
            size="sm"
            disabled
            className="w-full sm:w-auto opacity-50"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Usuń dane (wkrótce)
          </Btn>
        </div>
      </div>
    </div>
  );
}

export default DataManagement;
