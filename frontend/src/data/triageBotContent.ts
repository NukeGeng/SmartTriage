// triageBotContent.ts - Contextual TriageBot mood rules + messages for ticket detail.
import type { Ticket } from "@/types/ticket";

export type TriageBotMood = "idle" | "thinking" | "success" | "alert" | "confused";

export type TriageBotNoteContent = {
  mood: TriageBotMood;
  headline: string;
  message: string;
};

export const triageBotMoodMeta: Record<TriageBotMood, { label: string; dotClass: string }> = {
  idle: { label: "Theo dõi", dotClass: "bg-neutral-400" },
  thinking: { label: "Đang phân tích", dotClass: "bg-brand-600" },
  success: { label: "Đã định tuyến", dotClass: "bg-emerald-600" },
  alert: { label: "Cần chú ý", dotClass: "bg-rose-600" },
  confused: { label: "Cần review", dotClass: "bg-amber-500" },
};

export function getTriageBotNote(ticket: Ticket): TriageBotNoteContent {
  const analysis = ticket.analysis;

  if (!analysis || ticket.status === "analyzing") {
    return {
      mood: "thinking",
      headline: "TriageBot đang đọc phản ánh này",
      message:
        "AI đang phân loại nội dung, tính điểm ưu tiên và tìm phản ánh tương tự. Kết quả sẽ hiển thị tại đây ngay khi phân tích xong.",
    };
  }

  if (ticket.status === "resolved") {
    return {
      mood: "success",
      headline: "Phản ánh đã được xử lý",
      message: `Ticket thuộc nhóm "${analysis.category_label}" đã đóng. Dữ liệu xử lý này giúp mô hình phân loại chính xác hơn.`,
    };
  }

  if (analysis.priority === "high") {
    return {
      mood: "alert",
      headline: "Ưu tiên cao — nên xử lý sớm",
      message: `Điểm ưu tiên ${analysis.priority_score}/100. TriageBot đề xuất chuyển ngay cho ${analysis.suggested_department} trong hôm nay.`,
    };
  }

  if (analysis.category_confidence < 0.6) {
    return {
      mood: "confused",
      headline: "AI chưa chắc chắn về nhãn này",
      message: `Confidence chỉ ${Math.round(analysis.category_confidence * 100)}%. Staff nên kiểm tra lại nhóm phân loại trước khi định tuyến.`,
    };
  }

  return {
    mood: "success",
    headline: "Phân tích hoàn tất",
    message: `Phản ánh thuộc nhóm "${analysis.category_label}", đề xuất chuyển tới ${analysis.suggested_department}.`,
  };
}
