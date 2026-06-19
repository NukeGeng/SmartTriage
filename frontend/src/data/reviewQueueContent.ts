// reviewQueueContent.ts - Static copy for the human-in-the-loop review workbench.
export const reviewQueueHero = {
  eyebrow: "Human-in-the-loop",
  title: "Bàn kiểm định AI",
  description:
    "Chọn từng phản ánh confidence thấp, đọc tín hiệu AI, sửa category/priority và lưu correction để vòng feedback có dữ liệu thật.",
};

export const reviewSignals = [
  "Confidence dưới ngưỡng cần staff xác nhận",
  "Priority cao nhưng category hoặc route còn chưa chắc",
  "Correction sau khi lưu sẽ thành nhãn thủ công cho ticket",
];

export const reviewDecisionHints = [
  "So sánh mô tả sinh viên với category AI dự đoán.",
  "Ưu tiên high khi có deadline, thi cử, lớp đông hoặc gián đoạn dịch vụ.",
  "Nếu department gợi ý không khớp category đúng, sửa category trước rồi lưu.",
];

export const reviewEmptyState = {
  title: "Không còn case cần kiểm định",
  description:
    "Các phản ánh confidence thấp sẽ xuất hiện ở đây để admin sửa nhãn trước khi đưa vào ML Feedback Loop.",
};
