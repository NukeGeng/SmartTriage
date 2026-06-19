// newTicketContent.ts - Guided copy and examples for the student ticket creation flow.
export type TicketTemplate = {
  title: string;
  description: string;
  signal: string;
};

export const ticketCreateHero = {
  eyebrow: "Student report intake",
  title: "Gửi phản ánh để AI phân loại và ưu tiên ngay.",
  description:
    "SmartTriage đọc tiêu đề, mô tả, deadline và phạm vi ảnh hưởng để đề xuất category, mức ưu tiên, phòng ban xử lý và ticket liên quan.",
};

export const ticketTemplates: TicketTemplate[] = [
  {
    title: "Không đăng nhập được hệ thống thi online",
    description:
      "Em không đăng nhập được vào hệ thống thi online từ tối nay. Sáng mai em có lịch thi lúc 8h và đã thử đổi mật khẩu nhưng vẫn lỗi.",
    signal: "deadline thi gần",
  },
  {
    title: "Wifi phòng B305 rất yếu trong giờ học",
    description:
      "Lớp em học tại B305 nhưng wifi chập chờn, nhiều bạn bị rớt khỏi LMS khi giảng viên chiếu tài liệu trực tuyến.",
    signal: "nhiều sinh viên bị ảnh hưởng",
  },
  {
    title: "Máy chiếu phòng A302 không nhận HDMI",
    description:
      "Máy chiếu phòng A302 không nhận tín hiệu HDMI trong hai buổi học liên tiếp, giảng viên phải đổi phòng tạm thời.",
    signal: "thiết bị lớp học",
  },
];

export const ticketQualitySignals = [
  "Tên hệ thống, phòng học hoặc dịch vụ bị lỗi",
  "Thời điểm xảy ra và deadline nếu có",
  "Số lượng sinh viên hoặc lớp bị ảnh hưởng",
  "Bạn đã thử cách xử lý nào trước đó",
];

export const ticketTriageStages = [
  {
    label: "1. Phân loại",
    value: "TF-IDF + Logistic Regression",
  },
  {
    label: "2. Ưu tiên",
    value: "Deadline, scope, keyword, duplicate cluster",
  },
  {
    label: "3. Điều phối",
    value: "Gợi ý phòng ban và hành động đầu tiên",
  },
];
