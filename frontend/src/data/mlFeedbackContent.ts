// mlFeedbackContent.ts - Static copy for the ML feedback and retraining readiness screen.
export const mlFeedbackHero = {
  eyebrow: "Learning loop",
  title: "Xưởng dữ liệu retrain",
  description:
    "Theo dõi sample đã được staff sửa nhãn, kiểm tra độ phủ category và xuất dataset sạch cho lần huấn luyện tiếp theo.",
};

export const feedbackLoopSteps = [
  "AI dự đoán category và priority",
  "Admin sửa nhãn ở AI Review Queue",
  "Feedback board kiểm tra chất lượng dataset",
  "Export CSV hoặc dùng backend training export",
];

export const feedbackBoardQuestions = [
  "Sample nào đã có nhãn thủ công?",
  "Category correction có đủ độ phủ chưa?",
  "File export có tách manual label khỏi AI label không?",
];

export const feedbackQualityRules = [
  {
    id: "sample_count",
    label: "Tối thiểu 5 sample đã sửa",
    target: "5+ corrected",
  },
  {
    id: "category_coverage",
    label: "Có ít nhất 3 category khác nhau",
    target: "3+ labels",
  },
  {
    id: "priority_signal",
    label: "Có priority correction",
    target: "manual priority",
  },
  {
    id: "low_confidence_reviewed",
    label: "Có case low-confidence được xử lý",
    target: "reviewed uncertainty",
  },
] as const;

export const feedbackExportNotes = [
  "CSV giữ title, manual label, AI label và confidence để so sánh.",
  "Sample chưa được sửa nhãn không đi vào file export frontend.",
  "Nếu cần dataset đầy đủ, backend có endpoint export-training-data cho admin.",
];
