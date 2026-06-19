// ticketOptions.ts - Shared labels and filter options for ticket-facing UI.
export const ticketStatusFilterOptions = [
  ["", "Tất cả trạng thái"],
  ["new", "Mới"],
  ["analyzing", "Đang phân tích"],
  ["open", "Đang mở"],
  ["in_progress", "Đang xử lý"],
  ["resolved", "Đã xử lý"],
  ["rejected", "Từ chối"],
] as const;

export const ticketPriorityFilterOptions = [
  ["", "Tất cả ưu tiên"],
  ["high", "Cao"],
  ["medium", "Trung bình"],
  ["low", "Thấp"],
] as const;

export const ticketCategoryFilterOptions = [
  ["", "Tất cả category"],
  ["account_system", "Tài khoản / Hệ thống"],
  ["network", "Mạng"],
  ["classroom_device", "Thiết bị phòng học"],
  ["facility", "Cơ sở vật chất"],
  ["schedule_exam", "Lịch học / Lịch thi"],
  ["tuition_payment", "Học phí"],
  ["document_profile", "Hồ sơ"],
  ["learning_platform", "Nền tảng học tập"],
  ["feedback", "Góp ý"],
  ["other", "Khác"],
] as const;
