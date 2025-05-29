// Mock data for design system demonstrations

export const mockUser = {
  experience: 1250,
  metadata: {
    creationTime: new Date().toISOString(),
  },
};

export const mockQuizzes = [
  {
    id: "1",
    title: "React Fundamentals Quiz",
    category: "Programming",
    score: 85,
  },
  {
    id: "2",
    title: "JavaScript ES6+ Quiz",
    category: "Programming",
    score: 92,
  },
  {
    id: "3",
    title: "CSS Grid & Flexbox Quiz",
    category: "Design",
    score: 78,
  },
];

export const commonIcons = [
  {
    name: "Check",
    path: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    name: "Star",
    path: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
  },
  {
    name: "Heart",
    path: "M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z",
  },
  {
    name: "User",
    path: "M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z",
  },
  {
    name: "Bookmark",
    path: "M5 5a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 19V5z",
  },
  {
    name: "Trophy",
    path: "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z",
  },
  {
    name: "Clock",
    path: "M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z",
  },
  {
    name: "Arrow",
    path: "M9 5l7 7-7 7",
  },
];

export const designSystemTabs = [
  { id: "typography", label: "Typography" },
  { id: "colors", label: "Colors" },
  { id: "components", label: "Components" },
  { id: "layouts", label: "Layouts" },
  { id: "icons", label: "Icons" },
];
