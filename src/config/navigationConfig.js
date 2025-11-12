import {
  Home,
  User,
  PlusCircle,
  LayoutDashboard,
  ChartColumnIncreasing,
  Settings,
} from "lucide-react";

export const navigationConfig = [
  {
    path: "/",
    label: "Nauka",
    icon: Home,
    showInMobile: true,
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
    path: "/newquiz",
    label: "Stwórz Quiz",
    icon: PlusCircle,
    showInMobile: true,
    showInDesktop: true,
  },
  {
    path: "/user/details",
    label: "Profil",
    icon: User,
    showInMobile: true,
    showInDesktop: true,
  },
  {
    path: "/settings",
    label: "Ustawienia",
    icon: Settings,
    showInMobile: false,
    showInDesktop: true,
  },
];
