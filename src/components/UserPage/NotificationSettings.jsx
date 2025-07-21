import { useState, useEffect } from "react";
import { Bell, Mail, Smartphone, Volume2, VolumeX } from "lucide-react";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { showSuccess, showError } from "../../utils/toastUtils";

function NotificationSettings() {
  const [emailNotifications, setEmailNotifications] = useLocalStorage("emailNotifications", true);
  const [pushNotifications, setPushNotifications] = useLocalStorage("pushNotifications", true);
  const [soundEnabled, setSoundEnabled] = useLocalStorage("soundEnabled", true);
  const [dailyReminders, setDailyReminders] = useLocalStorage("dailyReminders", true);
  const [streakReminders, setStreakReminders] = useLocalStorage("streakReminders", true);
  const [newQuizNotifications, setNewQuizNotifications] = useLocalStorage("newQuizNotifications", false);

  const handleSettingChange = (setter, value, settingName) => {
    setter(value);
    showSuccess(`Ustawienia powiadomień zostały zaktualizowane`);
  };

  const notificationSettings = [
    {
      id: "email",
      title: "Powiadomienia email",
      description: "Otrzymuj powiadomienia na adres email",
      icon: Mail,
      checked: emailNotifications,
      onChange: (checked) => handleSettingChange(setEmailNotifications, checked, "email"),
    },
    {
      id: "push",
      title: "Powiadomienia push",
      description: "Powiadomienia w przeglądarce",
      icon: Smartphone,
      checked: pushNotifications,
      onChange: (checked) => handleSettingChange(setPushNotifications, checked, "push"),
    },
    {
      id: "sound",
      title: "Dźwięki",
      description: "Odtwarzaj dźwięki powiadomień",
      icon: soundEnabled ? Volume2 : VolumeX,
      checked: soundEnabled,
      onChange: (checked) => handleSettingChange(setSoundEnabled, checked, "sound"),
    },
    {
      id: "daily",
      title: "Codzienne przypomnienia",
      description: "Przypomnienia o nauce każdego dnia",
      icon: Bell,
      checked: dailyReminders,
      onChange: (checked) => handleSettingChange(setDailyReminders, checked, "daily"),
    },
    {
      id: "streak",
      title: "Przypomnienia o passie",
      description: "Ostrzeżenia gdy passa może się skończyć",
      icon: Bell,
      checked: streakReminders,
      onChange: (checked) => handleSettingChange(setStreakReminders, checked, "streak"),
    },
    {
      id: "newquiz",
      title: "Nowe quizy",
      description: "Powiadomienia o nowych quizach",
      icon: Bell,
      checked: newQuizNotifications,
      onChange: (checked) => handleSettingChange(setNewQuizNotifications, checked, "newquiz"),
    },
  ];

  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        showSuccess("Uprawnienia do powiadomień zostały udzielone!");
      } else {
        showError("Uprawnienia do powiadomień zostały odrzucone");
      }
    }
  };

  return (
    <div className="bg-surface-elevated border-border rounded-xl border p-6">
      <h3 className="text-text mb-4 text-lg font-semibold">Powiadomienia</h3>
      
      {/* Permission Request */}
      {"Notification" in window && Notification.permission === "default" && (
        <div className="border-primary/20 bg-primary/5 mb-6 rounded-lg border p-4">
          <div className="mb-3 flex items-center gap-3">
            <Bell className="text-primary h-5 w-5" />
            <div>
              <h4 className="text-text font-medium">Włącz powiadomienia</h4>
              <p className="text-text-muted text-sm">
                Pozwól aplikacji na wysyłanie powiadomień
              </p>
            </div>
          </div>
          <button
            onClick={requestNotificationPermission}
            className="bg-primary hover:bg-primary/90 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
          >
            Włącz powiadomienia
          </button>
        </div>
      )}

      {/* Notification Settings */}
      <div className="space-y-4">
        {notificationSettings.map((setting) => {
          const Icon = setting.icon;
          return (
            <div key={setting.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-surface flex h-10 w-10 items-center justify-center rounded-lg">
                  <Icon className="text-text-muted h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-text font-medium">{setting.title}</h4>
                  <p className="text-text-muted text-sm">{setting.description}</p>
                </div>
              </div>
              
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={setting.checked}
                  onChange={(e) => setting.onChange(e.target.checked)}
                />
                <div className="bg-surface peer h-6 w-11 rounded-full border-2 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20"></div>
              </label>
            </div>
          );
        })}
      </div>

      {/* Notification Status */}
      <div className="mt-6 pt-4 border-t border-border">
        <h4 className="text-text mb-2 font-medium">Status powiadomień</h4>
        <div className="text-text-muted text-sm">
          {"Notification" in window ? (
            <span className={`inline-flex items-center gap-1 ${
              Notification.permission === "granted" 
                ? "text-green-600" 
                : Notification.permission === "denied" 
                ? "text-red-600" 
                : "text-yellow-600"
            }`}>
              <div className={`h-2 w-2 rounded-full ${
                Notification.permission === "granted" 
                  ? "bg-green-600" 
                  : Notification.permission === "denied" 
                  ? "bg-red-600" 
                  : "bg-yellow-600"
              }`}></div>
              {Notification.permission === "granted" && "Powiadomienia włączone"}
              {Notification.permission === "denied" && "Powiadomienia zablokowane"}
              {Notification.permission === "default" && "Oczekuje na zgodę"}
            </span>
          ) : (
            <span className="text-red-600">Powiadomienia nie są obsługiwane</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default NotificationSettings;
