// loginContent.ts - Static copy + demo accounts for the SmartTriage login screen.
import { Gauge, GitMerge, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type DemoAccount = {
  role: string;
  email: string;
  password: string;
  toneClass: string;
};

export const demoAccounts: DemoAccount[] = [
  {
    role: "Student",
    email: "student@example.com",
    password: "12345678",
    toneClass: "bg-emerald-50 text-emerald-700",
  },
  {
    role: "Admin",
    email: "admin@example.com",
    password: "12345678",
    toneClass: "bg-brand-50 text-brand-700",
  },
  {
    role: "IT Staff",
    email: "it.staff@example.com",
    password: "12345678",
    toneClass: "bg-amber-50 text-amber-700",
  },
];

export type LoginFeature = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export const loginFeatures: LoginFeature[] = [
  {
    title: "AI phân loại tức thì",
    description: "TF-IDF + Logistic Regression gắn nhãn và độ tin cậy cho từng phản ánh.",
    icon: Sparkles,
  },
  {
    title: "Điểm ưu tiên có giải thích",
    description: "Mỗi ticket có breakdown vì sao được xếp ưu tiên cao hay thấp.",
    icon: Gauge,
  },
  {
    title: "Gom sự cố lặp lại",
    description: "Phản ánh trùng chủ đề được nhóm thành incident để xử lý một lần.",
    icon: GitMerge,
  },
];

export const loginBotMessage = "Đăng nhập đi, mình sẽ phân loại phản ánh cho bạn trong vài giây!";
