import {
  BookOpen,
  ClipboardList,
  PenLine,
  MessageSquare,
  Layers,
  Landmark,
  GraduationCap,
  Award,
  Users,
  Star,
  Trophy,
  Building2,
  Globe,
  Target,
  Scale,
  Newspaper,
  type LucideIcon,
} from "lucide-react";

/** Icons selectable for course cards, keyed by a stable name stored in the DB. */
export const iconMap: Record<string, LucideIcon> = {
  BookOpen,
  ClipboardList,
  PenLine,
  MessageSquare,
  Layers,
  Landmark,
  GraduationCap,
  Award,
  Users,
  Star,
  Trophy,
  Building2,
  Globe,
  Target,
  Scale,
  Newspaper,
};

export const iconNames = Object.keys(iconMap);

export function getIcon(name?: string | null): LucideIcon {
  if (name && iconMap[name]) return iconMap[name];
  return BookOpen;
}
