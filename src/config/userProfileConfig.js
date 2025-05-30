export const userProfileConfig = {
  // Profile picture settings
  MAX_IMAGE_SIZE: 2 * 1024 * 1024, // 2 MB
  ALLOWED_IMG_TYPES: {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/gif": ".gif",
  },

  // Username validation limits
  MIN_USERNAME_LENGTH: 3,
  MAX_USERNAME_LENGTH: 25,

  // Bio settings
  MAX_BIO_LENGTH: 300,

  // Description settings
  MAX_DESCRIPTION_LENGTH: 500, // User interests
  AVAILABLE_INTERESTS: [
    { id: "jezyki", label: "🗣️ Nauka języków" },
    { id: "historia", label: "📜 Historia" },
    { id: "matematyka", label: "➗ Matematyka" },
    { id: "chemia", label: "⚗️ Chemia" },
    { id: "literatura", label: "📚 Literatura" },
    { id: "geografia", label: "🌍 Geografia" },
    { id: "kultura", label: "🎨 Kultura i sztuka" },
    { id: "sport", label: "⚽ Sport" },
    { id: "technologia", label: "💻 Technologia" },
    { id: "filmy", label: "🎬 Filmy" },
    { id: "zdrowie", label: "🏃‍♂️ Zdrowie i lifestyle" },
    { id: "nauka", label: "🧠 Nauka ogólna" },
    { id: "gry", label: "🎲 Gry i quizy" },
  ],

  // Maximum number of interests user can select
  MAX_INTERESTS: 5,
};
