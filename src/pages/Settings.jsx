import { Settings, User, Shield, Bell, Palette, Globe } from "lucide-react";
import Btn from "../components/common/Btn";
import ThemeToggle from "../components/common/ThemeToggle";

function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text mb-2">Ustawienia</h1>
        <p className="text-text-muted">Zarządzaj swoim kontem i preferencjami aplikacji</p>
      </div>

      {/* Settings Sections */}
      <div className="grid gap-6">
        {/* Account Settings */}
        <div className="bg-surface-elevated rounded-xl border p-6">
          <div className="flex items-center gap-3 mb-4">
            <User className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Konto</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Edytuj profil</h3>
                <p className="text-sm text-text-muted">Zmień swoje dane osobowe i zdjęcie profilowe</p>
              </div>
              <Btn variant="secondary" to="/user/edit-profile">
                Edytuj
              </Btn>
            </div>
          </div>
        </div>  

     
        {/* Appearance */}
        <div className="bg-surface-elevated rounded-xl border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Palette className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Wygląd</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Motyw</h3>
                <p className="text-sm text-text-muted">Wybierz jasny lub ciemny motyw</p>
              </div>
              <ThemeToggle />
            </div>
        
          </div>
        </div>

        
      </div>
    </div>
  );
}

export default SettingsPage;
