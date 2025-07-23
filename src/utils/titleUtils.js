// System tytułów użytkowników oparty na XP
const TITLE_SYSTEM = {
  0: { title: "Nowicjusz", color: "text-gray-500", emoji: "🌱" },
  50: { title: "Uczeń", color: "text-sky-500", emoji: "✏️" },
  100: { title: "Pilny Uczeń", color: "text-blue-500", emoji: "📚" },
  500: { title: "Ambitny", color: "text-green-500", emoji: "🎯" },
  800: { title: "Czeladnik", color: "text-teal-500", emoji: "🔨" },
  1000: { title: "Znawca", color: "text-purple-500", emoji: "🧠" },
  2000: { title: "Ekspert", color: "text-orange-500", emoji: "⭐" },
  3500: { title: "Mistrz", color: "text-red-500", emoji: "🏆" },
  5000: { title: "Legenda", color: "text-yellow-500", emoji: "👑" },
  10000: { title: "Absolutna Legenda", color: "text-gradient-to-r from-yellow-400 to-purple-600 bg-clip-text text-transparent", emoji: "😎" }
};

export const getUserTitle = (xp = 0) => {
  // Znajdź najwyższy próg, który użytkownik osiągnął
  const thresholds = Object.keys(TITLE_SYSTEM)
    .map(Number)
    .sort((a, b) => b - a); // Sortuj malejąco
  
  const currentThreshold = thresholds.find(threshold => xp >= threshold) || 0;
  return TITLE_SYSTEM[currentThreshold];
};

export const getNextTitle = (xp = 0) => {
  // Znajdź następny próg do osiągnięcia
  const thresholds = Object.keys(TITLE_SYSTEM)
    .map(Number)
    .sort((a, b) => a - b); // Sortuj rosnąco
  
  const nextThreshold = thresholds.find(threshold => xp < threshold);
  return nextThreshold ? {
    ...TITLE_SYSTEM[nextThreshold],
    xpNeeded: nextThreshold - xp
  } : null;
};

export const getTitleProgress = (xp = 0) => {
  const currentTitle = getUserTitle(xp);
  const nextTitle = getNextTitle(xp);
  
  if (!nextTitle) {
    return { progress: 100, isMaxLevel: true };
  }
  
  const currentThreshold = Object.keys(TITLE_SYSTEM)
    .map(Number)
    .sort((a, b) => b - a)
    .find(threshold => xp >= threshold) || 0;
  
  const progressInCurrentLevel = xp - currentThreshold;
  const totalNeededForNext = nextTitle.xpNeeded + progressInCurrentLevel;
  const progress = (progressInCurrentLevel / totalNeededForNext) * 100;
  
  return { progress: Math.min(progress, 100), isMaxLevel: false };
};

export { TITLE_SYSTEM };
