// modelInfoContent.ts - Static explainability copy for the model info dashboard.
export const modelInfoHero = {
  eyebrow: "AI transparency",
  title: "Model Info cho demo kỹ thuật và vận hành.",
  description:
    "Màn này cho staff biết AI service đang dùng thuật toán nào, model đã load chưa, độ chính xác ra sao và category nào đang được hỗ trợ.",
};

export const modelPipelineSteps = [
  {
    label: "Text preprocessing",
    detail: "Chuẩn hóa title + description trước khi vector hóa.",
  },
  {
    label: "TF-IDF vectorizer",
    detail: "Biến nội dung phản ánh thành đặc trưng để phân loại.",
  },
  {
    label: "Logistic Regression",
    detail: "Dự đoán category và confidence cho ticket mới.",
  },
  {
    label: "Rule-based triage",
    detail: "Kết hợp category, keyword, deadline và duplicate để tính priority.",
  },
];

export const modelTrustSignals = [
  "Model loaded từ AI service",
  "Accuracy và Macro F1 có thể trình bày khi demo",
  "Category list giúp kiểm tra phạm vi phân loại",
  "Thông tin này hỗ trợ vòng lặp chỉnh nhãn và retraining",
];
