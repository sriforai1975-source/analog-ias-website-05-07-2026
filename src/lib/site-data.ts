import {
  BookOpen,
  ClipboardList,
  PenLine,
  MessageSquare,
  Layers,
  Landmark,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Course {
  title: string;
  description: string;
  icon: LucideIcon;
}

export const courses: Course[] = [
  {
    title: "UPSC Foundation",
    description:
      "A complete two-year integrated programme covering the entire syllabus from basics to advanced, ideal for beginners.",
    icon: BookOpen,
  },
  {
    title: "UPSC Prelims",
    description:
      "Focused preparation with concept clarity, current affairs and extensive test series to crack the preliminary exam.",
    icon: ClipboardList,
  },
  {
    title: "UPSC Mains",
    description:
      "Answer-writing mastery, structured notes and personalised evaluation to excel in the descriptive main examination.",
    icon: PenLine,
  },
  {
    title: "Interview Guidance",
    description:
      "Mock interviews with expert panels, personality development and DAF analysis to shine in the final stage.",
    icon: MessageSquare,
  },
  {
    title: "Optional Subjects",
    description:
      "Specialised coaching across popular optionals with dedicated faculty, standard materials and regular tests.",
    icon: Layers,
  },
  {
    title: "State PSC Courses",
    description:
      "Tailored programmes for state civil services with region-specific content, exam patterns and mentoring.",
    icon: Landmark,
  },
];

export interface Result {
  name: string;
  rank: string;
  year: string;
}

export const results: Result[] = [
  { name: "Ananya Sharma", rank: "AIR 12", year: "2024" },
  { name: "Rahul Verma", rank: "AIR 27", year: "2024" },
  { name: "Priya Nair", rank: "AIR 45", year: "2023" },
  { name: "Karthik Reddy", rank: "AIR 58", year: "2023" },
  { name: "Sneha Iyer", rank: "AIR 63", year: "2023" },
  { name: "Aditya Rao", rank: "AIR 71", year: "2022" },
  { name: "Meera Krishnan", rank: "AIR 89", year: "2022" },
  { name: "Vikram Singh", rank: "AIR 104", year: "2022" },
];
