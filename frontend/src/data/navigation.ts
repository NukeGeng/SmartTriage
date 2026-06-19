import {
  BarChart3,
  Brain,
  ClipboardList,
  FilePlus2,
  GitMerge,
  LayoutDashboard,
  Radar,
  Sparkles,
  Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { UserRole } from "@/types/auth";

export type NavigationSectionId = "student" | "operations" | "learning";

export type NavigationItem = {
  href: string;
  label: string;
  context: string;
  icon: LucideIcon;
  roles: UserRole[];
  section: NavigationSectionId;
  available?: boolean;
  activePaths?: string[];
};

export type NavigationSection = {
  id: NavigationSectionId;
  label: string;
  roles: UserRole[];
};

export const navigationSections: NavigationSection[] = [
  { id: "student", label: "Sinh viên", roles: ["student"] },
  { id: "operations", label: "Điều phối AI", roles: ["staff", "admin"] },
  { id: "learning", label: "Minh bạch ML", roles: ["staff", "admin"] },
];

export const navigationItems: NavigationItem[] = [
  {
    href: "/tickets/new",
    label: "Gửi phản ánh",
    context: "Soạn phản ánh để AI phân loại chính xác hơn.",
    icon: FilePlus2,
    roles: ["student"],
    section: "student",
  },
  {
    href: "/tickets",
    label: "Phản ánh của tôi",
    context: "Theo dõi trạng thái và kết quả AI của từng phản ánh.",
    icon: ClipboardList,
    roles: ["student"],
    section: "student",
  },
  {
    href: "/admin/triage",
    label: "Triage Cockpit",
    context: "Ưu tiên phản ánh cần xử lý trước.",
    icon: Radar,
    roles: ["staff", "admin"],
    section: "operations",
  },
  {
    href: "/admin/tickets",
    label: "Ticket Queue",
    context: "Lọc, phân luồng và cập nhật trạng thái phản ánh.",
    icon: ClipboardList,
    roles: ["staff", "admin"],
    section: "operations",
  },
  {
    href: "/admin/incidents",
    label: "Incident Groups",
    context: "Gom các phản ánh cùng chủ đề để xử lý tập trung.",
    icon: GitMerge,
    roles: ["staff", "admin"],
    section: "operations",
  },
  {
    href: "/admin/review",
    label: "AI Review Queue",
    context: "Kiểm tra các dự đoán có độ tin cậy thấp.",
    icon: Workflow,
    roles: ["staff", "admin"],
    section: "learning",
  },
  {
    href: "/admin/ml-feedback",
    label: "ML Feedback Loop",
    context: "Chuẩn bị dữ liệu phản hồi để cải thiện model.",
    icon: Sparkles,
    roles: ["staff", "admin"],
    section: "learning",
  },
  {
    href: "/dashboard",
    label: "Analytics",
    context: "Theo dõi số liệu phản ánh và ưu tiên AI.",
    icon: BarChart3,
    roles: ["staff", "admin"],
    section: "operations",
  },
  {
    href: "/admin/model-info",
    label: "Model Info",
    context: "Minh bạch thuật toán và chất lượng model đang chạy.",
    icon: Brain,
    roles: ["staff", "admin"],
    section: "learning",
  },
  {
    href: "/demo",
    label: "Demo Flow",
    context: "Kịch bản demo 3-5 phút cho SmartTriage.",
    icon: LayoutDashboard,
    roles: ["student", "staff", "admin"],
    section: "student",
    available: false,
  },
];

export function getVisibleNavigation(role: UserRole) {
  return navigationItems.filter((item) => item.roles.includes(role));
}

export function getVisibleSections(role: UserRole) {
  return navigationSections.filter((section) =>
    navigationItems.some((item) => item.section === section.id && item.roles.includes(role)),
  );
}

export function isNavigationItemActive(item: NavigationItem, pathname: string) {
  const paths = [item.href, ...(item.activePaths ?? [])];
  return paths.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

export function getNavigationContext(pathname: string, role: UserRole) {
  const item = getVisibleNavigation(role).find((entry) => isNavigationItemActive(entry, pathname));
  return {
    label: item?.label ?? "SmartTriage Console",
    context: item?.context ?? "AI-assisted triage console cho phản ánh sinh viên.",
  };
}
