// landingContent.ts - Static product copy for the SmartTriage mascot landing page.
import { Activity, Bot, GitMerge, GraduationCap, Layers3, Radar, ShieldAlert, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type LandingShot = {
  title: string;
  owner: string;
  category: string;
  imageTone: string;
  accentTone: string;
  description: string;
  likes: string;
  views: string;
  icon: LucideIcon;
};

export const landingHero = {
  badge: "Điều phối phản ánh sinh viên bằng AI",
  titlePrefix: "Trung tâm điều phối AI cho",
  titleWords: ["phản ánh sinh viên", "trường hợp cần ưu tiên", "nhóm sự cố liên quan", "quy trình xử lý học đường"],
  subtitle:
    "Biến mô tả tự do của sinh viên thành phân loại, điểm ưu tiên, phòng ban đề xuất và nhóm sự cố liên quan trong một quy trình xử lý rõ ràng.",
  searchPlaceholder: "thi online, wifi B305, học phí, hồ sơ...",
  related: ["Phân loại AI", "chấm điểm ưu tiên", "gom nhóm sự cố", "thông tin mô hình", "phản hồi ML", "luồng trình diễn"],
  botMessage:
    "Tôi vừa phát hiện 3 phản ánh Wifi khu B có độ tương đồng cao và đề xuất Phòng CNTT xử lý trước.",
};

export const landingNavItems = ["Luồng điều phối", "Phân tích AI", "Nhóm sự cố", "Thông tin mô hình", "Trình diễn"];

export const landingCategories = [
  "Khám phá",
  "Quy trình AI",
  "TriageBot",
  "Luồng phản ánh",
  "Nhóm sự cố",
  "Phản hồi ML",
  "Buồng điều phối",
  "Trình diễn",
];

export const landingShots: LandingShot[] = [
  {
    title: "Hướng dẫn gửi phản ánh",
    owner: "SmartTriage",
    category: "Luồng phản ánh",
    imageTone: "from-command-elevated to-brand-50",
    accentTone: "bg-brand-600",
    description: "TriageBot gợi ý sinh viên cung cấp thời hạn, phòng học và phạm vi ảnh hưởng.",
    likes: "164",
    views: "60.4k",
    icon: GraduationCap,
  },
  {
    title: "Phân tích điều phối AI",
    owner: "Hệ thống + Dịch vụ AI",
    category: "Quy trình AI",
    imageTone: "from-brand-50 to-brand-600",
    accentTone: "bg-emerald-500",
    description: "Nhãn phân loại, độ tin cậy, điểm ưu tiên và phòng ban đề xuất được trình bày nổi bật.",
    likes: "296",
    views: "49.9k",
    icon: Bot,
  },
  {
    title: "Hệ thống chấm điểm ưu tiên",
    owner: "Luật nghiệp vụ + ML",
    category: "Chấm điểm",
    imageTone: "from-command-elevated to-signal-amber",
    accentTone: "bg-signal-rose",
    description: "Từ khóa gấp, thời hạn thi và cụm trùng lặp được tổng hợp thành điểm ưu tiên.",
    likes: "82",
    views: "12.3k",
    icon: ShieldAlert,
  },
  {
    title: "Gom nhóm sự cố",
    owner: "Độ tương đồng cosine",
    category: "Nhóm sự cố",
    imageTone: "from-command-elevated to-brand-50",
    accentTone: "bg-brand-600",
    description: "Nhiều phản ánh cùng chủ đề được đề xuất thành một nhóm để xử lý tập trung.",
    likes: "51",
    views: "6.4k",
    icon: GitMerge,
  },
  {
    title: "Buồng điều phối quản trị",
    owner: "Trung tâm điều phối",
    category: "Buồng quản trị",
    imageTone: "from-brand-50 to-brand-600",
    accentTone: "bg-signal-amber",
    description: "Hàng chờ khẩn cấp, trường hợp ít tin cậy và đề xuất định tuyến được theo dõi cùng lúc.",
    likes: "91",
    views: "22.3k",
    icon: Radar,
  },
  {
    title: "Vòng lặp phản hồi ML",
    owner: "Kiểm duyệt con người",
    category: "Phản hồi ML",
    imageTone: "from-command-elevated to-signal-amber",
    accentTone: "bg-emerald-500",
    description: "Quản trị viên sửa nhãn, xuất CSV và dùng dữ liệu thật để cải thiện mô hình.",
    likes: "280",
    views: "31k",
    icon: Activity,
  },
  {
    title: "Minh bạch mô hình",
    owner: "Thông tin mô hình",
    category: "Giải thích mô hình",
    imageTone: "from-brand-50 to-command-elevated",
    accentTone: "bg-brand-700",
    description: "Thuật toán, phiên bản, độ chính xác và macro F1 được trình bày rõ khi trình diễn.",
    likes: "72",
    views: "9.1k",
    icon: Layers3,
  },
  {
    title: "Luồng trình diễn",
    owner: "Kịch bản 3 phút",
    category: "Trình diễn",
    imageTone: "from-signal-amber to-signal-rose",
    accentTone: "bg-command-elevated",
    description: "Một tình huống thi online được dẫn từ phản ánh sinh viên đến hành động quản trị.",
    likes: "319",
    views: "60.1k",
    icon: Sparkles,
  },
];

export const landingWorkflow = [
  "Sinh viên gửi phản ánh",
  "AI phân loại",
  "Chấm điểm ưu tiên",
  "Gom nhóm sự cố",
  "Nhân viên xử lý",
];
