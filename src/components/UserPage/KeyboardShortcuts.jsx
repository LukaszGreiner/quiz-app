import { Keyboard, Command } from "lucide-react";

function KeyboardShortcuts() {
  const shortcuts = [
    {
      category: "Nawigacja",
      items: [
        { key: "Ctrl + H", description: "Strona główna" },
        { key: "Ctrl + N", description: "Nowy quiz" },
        { key: "Ctrl + S", description: "Statystyki" },
        { key: "Ctrl + P", description: "Profil" },
      ]
    },
    {
      category: "Zakładki profilu",
      items: [
        { key: "Ctrl + 1", description: "Przegląd" },
        { key: "Ctrl + 2", description: "Aktywność" },
        { key: "Ctrl + 3", description: "Statystyki" },
        { key: "Ctrl + 4", description: "Osiągnięcia" },
        { key: "Ctrl + 5", description: "Ustawienia" },
      ]
    },
    {
      category: "Inne",
      items: [
        { key: "Ctrl + K", description: "Fokus na wyszukiwanie" },
        { key: "Ctrl + Shift + H", description: "Pomoc" },
      ]
    }
  ];

  return (
    <div className="bg-surface-elevated border-border rounded-xl border p-6">
      <div className="mb-4 flex items-center gap-2">
        <Keyboard className="text-primary h-5 w-5" />
        <h3 className="text-text text-lg font-semibold">Skróty klawiszowe</h3>
      </div>
      
      <div className="space-y-6">
        {shortcuts.map((category, categoryIndex) => (
          <div key={categoryIndex}>
            <h4 className="text-text mb-3 font-medium">{category.category}</h4>
            <div className="space-y-2">
              {category.items.map((shortcut, shortcutIndex) => (
                <div key={shortcutIndex} className="flex items-center justify-between">
                  <span className="text-text-muted text-sm">{shortcut.description}</span>
                  <div className="bg-surface border-border flex items-center gap-1 rounded-lg border px-2 py-1">
                    {shortcut.key.split(' + ').map((key, keyIndex) => (
                      <span key={keyIndex} className="flex items-center">
                        {keyIndex > 0 && <span className="text-text-muted mx-1">+</span>}
                        <kbd className="bg-surface-elevated text-text rounded px-1.5 py-0.5 text-xs font-mono">
                          {key}
                        </kbd>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="border-border mt-6 pt-4 border-t">
        <div className="bg-primary/5 border-primary/20 rounded-lg border p-3">
          <div className="flex items-start gap-2">
            <Command className="text-primary mt-0.5 h-4 w-4 flex-shrink-0" />
            <div>
              <p className="text-text text-sm font-medium">Wskazówka</p>
              <p className="text-text-muted text-xs">
                Skróty klawiszowe działają na całej stronie. Użyj ich, aby szybciej nawigować po aplikacji.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default KeyboardShortcuts;
