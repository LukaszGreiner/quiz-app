import {
  Home,
  User,
  PlusCircle,
  LayoutDashboard,
  ChartColumnIncreasing,
} from "lucide-react";

export const navigationConfig = [
  {
    path: "/",
    label: "Strona główna",
    icon: Home,
    showInMobile: true,
    showInDesktop: true,
  },
  {
    path: "/newquiz",
    label: "Stwórz Quiz",
    icon: PlusCircle,
    showInMobile: true,
    showInDesktop: true,
  },
  {
    path: "/design-system",
    label: "Design System",
    icon: LayoutDashboard,
    showInMobile: false,
    showInDesktop: true,
  },
  {
    path: "/statistics",
    label: "Statystyki",
    icon: ChartColumnIncreasing,
    showInMobile: true,
    showInDesktop: true,
  },
  {
    path: "/user/details",
    label: "Profil",
    icon: User,
    showInMobile: true,
    showInDesktop: false,
  },
];
