import argparse
import csv
import hashlib
import json
import random
import re
import uuid
from collections import Counter
from datetime import UTC, datetime, timedelta
from pathlib import Path

sys_path = Path(__file__).resolve().parents[1]
import sys

sys.path.append(str(sys_path))

from app.ml.category_metadata import CATEGORY_LABELS

DEFAULT_OUTPUT = Path("data/training/versions/synthetic-v2/training.csv")
DEFAULT_TOTAL = 12_000
DEFAULT_SEED = 20260619

CATEGORY_WEIGHTS = {
    "account_system": 0.16,
    "network": 0.14,
    "learning_platform": 0.13,
    "schedule_exam": 0.12,
    "facility": 0.10,
    "classroom_device": 0.09,
    "tuition_payment": 0.09,
    "document_profile": 0.08,
    "feedback": 0.05,
    "other": 0.04,
}

PROFILES = {
    "account_system": {
        "subjects": ["cổng sinh viên", "hệ thống thi trực tuyến", "email trường", "cổng đăng ký môn", "tài khoản thư viện"],
        "titles": [
            "Không đăng nhập được {subject}",
            "Tài khoản bị khóa trên {subject}",
            "Không nhận được mã xác thực của {subject}",
            "Mật khẩu mới không hoạt động trên {subject}",
            "Thông tin tài khoản ở {subject} bị sai",
        ],
        "details": [
            "Hệ thống liên tục báo sai thông tin đăng nhập dù em đã kiểm tra lại.",
            "Sau nhiều lần thử, tài khoản báo bị khóa và không cho truy cập.",
            "Em đã yêu cầu gửi lại mã nhưng hộp thư vẫn chưa nhận được.",
            "Trang tự đăng xuất ngay sau khi em nhập đúng mật khẩu.",
            "Em đã đổi mật khẩu thành công nhưng vẫn không thể đăng nhập lại.",
        ],
    },
    "network": {
        "subjects": ["wifi sinh viên", "mạng ký túc xá", "wifi giảng đường", "mạng thư viện", "wifi khu tự học"],
        "titles": [
            "{subject} tại {location} rất yếu",
            "Không kết nối được {subject} ở {location}",
            "{subject} tại {location} thường xuyên mất kết nối",
            "Tốc độ {subject} ở {location} quá chậm",
            "Nhiều thiết bị không vào được {subject} tại {location}",
        ],
        "details": [
            "Kết nối bị ngắt liên tục và phải đăng nhập lại nhiều lần.",
            "Trang học liệu mất rất lâu mới tải được dù tín hiệu hiển thị đầy.",
            "Cả lớp không thể truy cập tài liệu và tham gia buổi học trực tuyến.",
            "Thiết bị báo đã kết nối nhưng không có Internet.",
            "Tình trạng xảy ra rõ nhất vào giờ học đông sinh viên.",
        ],
    },
    "classroom_device": {
        "subjects": ["máy chiếu", "micro", "loa", "màn hình tương tác", "cổng HDMI", "máy tính giảng viên"],
        "titles": [
            "{subject} phòng {location} không hoạt động",
            "{subject} tại {location} bị mất tín hiệu",
            "{subject} phòng {location} hoạt động chập chờn",
            "Không sử dụng được {subject} ở {location}",
            "{subject} tại {location} cần được kiểm tra",
        ],
        "details": [
            "Thiết bị đã được khởi động lại nhưng lỗi vẫn còn.",
            "Giảng viên không thể trình chiếu nội dung trong buổi học.",
            "Âm thanh và hình ảnh bị gián đoạn nhiều lần.",
            "Cáp kết nối đã được kiểm tra nhưng thiết bị vẫn không nhận tín hiệu.",
            "Sự cố ảnh hưởng đến toàn bộ tiết học của lớp.",
        ],
    },
    "facility": {
        "subjects": ["máy lạnh", "đèn chiếu sáng", "quạt trần", "thang máy", "hệ thống nước", "bàn ghế"],
        "titles": [
            "{subject} tại {location} bị hỏng",
            "Cần kiểm tra {subject} ở {location}",
            "{subject} khu {location} không sử dụng được",
            "Tình trạng {subject} tại {location} gây bất tiện",
            "Phản ánh về {subject} ở {location}",
        ],
        "details": [
            "Tình trạng này kéo dài từ hôm qua và chưa được khắc phục.",
            "Nhiều sinh viên trong khu vực đều bị ảnh hưởng.",
            "Lớp đã báo trực tiếp nhưng hiện tại vẫn chưa sử dụng bình thường.",
            "Không gian học tập trở nên khó chịu và ảnh hưởng khả năng tập trung.",
            "Nhờ bộ phận cơ sở vật chất kiểm tra trong thời gian sớm nhất.",
        ],
    },
    "schedule_exam": {
        "subjects": ["lịch thi", "lịch học", "phòng thi", "ca thi", "lịch học bù", "thời khóa biểu"],
        "titles": [
            "{subject} môn {course} bị trùng",
            "Thông tin {subject} môn {course} chưa chính xác",
            "Chưa thấy {subject} môn {course} trên hệ thống",
            "{subject} môn {course} thay đổi sát giờ",
            "Cần xác nhận lại {subject} môn {course}",
        ],
        "details": [
            "Thông báo của khoa và dữ liệu trên cổng sinh viên đang khác nhau.",
            "Hai môn bắt đầu cùng thời điểm nên em không thể tham gia đầy đủ.",
            "Lớp chưa nhận được phòng và thời gian chính thức.",
            "Thay đổi mới khiến nhiều sinh viên không kịp sắp xếp.",
            "Em cần thông tin chính xác để chuẩn bị cho buổi học hoặc kỳ thi.",
        ],
    },
    "tuition_payment": {
        "subjects": ["học phí học kỳ", "biên lai điện tử", "khoản thu bảo hiểm", "lệ phí thi lại", "công nợ sinh viên"],
        "titles": [
            "Đã thanh toán {subject} nhưng chưa được cập nhật",
            "Số tiền {subject} hiển thị chưa đúng",
            "Không tải được chứng từ của {subject}",
            "Giao dịch {subject} bị treo",
            "Cần đối soát khoản {subject}",
        ],
        "details": [
            "Ngân hàng đã báo giao dịch thành công nhưng cổng sinh viên vẫn ghi chưa thanh toán.",
            "Số tiền trên hệ thống khác với thông báo của Phòng Tài chính.",
            "Em cần biên lai để hoàn thiện hồ sơ nhưng chức năng tải đang báo lỗi.",
            "Giao dịch bị trừ tiền nhưng chưa có trạng thái xác nhận.",
            "Nhờ phòng phụ trách kiểm tra mã giao dịch và cập nhật công nợ.",
        ],
    },
    "document_profile": {
        "subjects": ["giấy xác nhận sinh viên", "bảng điểm", "hồ sơ cá nhân", "giấy giới thiệu thực tập", "xác nhận vay vốn", "thẻ sinh viên"],
        "titles": [
            "Cần cấp {subject}",
            "Thông tin trên {subject} bị sai",
            "Chưa nhận được {subject}",
            "Không gửi được yêu cầu {subject}",
            "Cần cập nhật trạng thái {subject}",
        ],
        "details": [
            "Em đã gửi yêu cầu trên cổng dịch vụ nhưng chưa thấy trạng thái xử lý.",
            "Thông tin ngày sinh hoặc lớp học trên giấy tờ chưa chính xác.",
            "Em cần bổ sung giấy tờ cho hồ sơ thực tập trong tuần này.",
            "Trang đăng ký báo lỗi sau khi em hoàn thành biểu mẫu.",
            "Nhờ Phòng Công tác sinh viên kiểm tra và hướng dẫn bước tiếp theo.",
        ],
    },
    "learning_platform": {
        "subjects": ["LMS", "Moodle", "lớp học trực tuyến", "kho học liệu", "cổng nộp bài", "video bài giảng"],
        "titles": [
            "Không truy cập được {subject} môn {course}",
            "Không nộp được bài trên {subject}",
            "{subject} không hiển thị môn {course}",
            "Nội dung trên {subject} môn {course} bị lỗi",
            "{subject} môn {course} hoạt động chập chờn",
        ],
        "details": [
            "Trang báo lỗi khi em tải tệp bài làm lên.",
            "Môn học đã đăng ký nhưng không xuất hiện trong danh sách lớp.",
            "Video dừng liên tục và không ghi nhận tiến độ học.",
            "Tài liệu giảng viên đăng không thể mở hoặc tải xuống.",
            "Em đã thử trình duyệt khác nhưng tình trạng vẫn không thay đổi.",
        ],
    },
    "feedback": {
        "subjects": ["cổng sinh viên", "quy trình hỗ trợ", "thông báo lịch học", "dịch vụ thư viện", "giao diện LMS", "kênh phản ánh"],
        "titles": [
            "Góp ý về {subject}",
            "Đề xuất cải thiện {subject}",
            "Mong bổ sung tính năng cho {subject}",
            "Phản hồi trải nghiệm sử dụng {subject}",
            "Kiến nghị điều chỉnh {subject}",
        ],
        "details": [
            "Các mục quan trọng hiện hơi khó tìm trên điện thoại.",
            "Nên có thông báo rõ khi yêu cầu được tiếp nhận và hoàn thành.",
            "Mong nhà trường bổ sung hướng dẫn ngắn cho sinh viên mới.",
            "Quy trình hiện có nhiều bước lặp lại và mất thời gian.",
            "Đề xuất cho phép theo dõi tiến độ xử lý ngay trên cổng sinh viên.",
        ],
    },
    "other": {
        "subjects": ["hoạt động sinh viên", "hỗ trợ chung", "thông tin câu lạc bộ", "dịch vụ trong trường", "quy định học vụ"],
        "titles": [
            "Cần tư vấn về {subject}",
            "Chưa biết liên hệ đơn vị nào về {subject}",
            "Yêu cầu hỗ trợ liên quan đến {subject}",
            "Cần thêm thông tin về {subject}",
            "Hỏi đáp chung về {subject}",
        ],
        "details": [
            "Em chưa tìm thấy nhóm phù hợp trong danh mục phản ánh hiện tại.",
            "Nhờ bộ phận tiếp nhận hướng dẫn phòng ban có thể hỗ trợ.",
            "Thông tin trên website chưa đủ để em xác định bước tiếp theo.",
            "Em cần được tư vấn trước khi gửi hồ sơ hoặc đăng ký.",
            "Đây là câu hỏi chung và hiện chưa ảnh hưởng đến lịch học.",
        ],
    },
}

LOCATIONS = [
    "A101", "A203", "A305", "B102", "B205", "B305", "C201", "C403", "D104",
    "thư viện tầng 2", "khu tự học", "ký túc xá K1", "ký túc xá K2", "giảng đường trung tâm",
]
COURSES = ["Cơ sở dữ liệu", "Lập trình Python", "Toán cao cấp", "Mạng máy tính", "Kinh tế vi mô", "Tiếng Anh 2", "Pháp luật đại cương"]
OPENERS = ["Em xin phản ánh", "Cho em hỏi", "Em cần hỗ trợ", "Nhờ nhà trường kiểm tra", "Lớp em đang gặp vấn đề", "Hiện tại em gặp tình trạng"]
IMPACTS = [
    "Vấn đề ảnh hưởng trực tiếp đến việc học của em.",
    "Có khoảng {affected} sinh viên cùng gặp tình trạng này.",
    "Sự cố xuất hiện từ {time_context}.",
    "Em đã thử lại trên thiết bị khác nhưng chưa được.",
    "Tình trạng xảy ra nhiều lần trong tuần này.",
]
REQUESTS = [
    "Mong bộ phận phụ trách kiểm tra giúp em.",
    "Nhờ nhà trường phản hồi hướng xử lý sớm.",
    "Em có thể bổ sung ảnh chụp màn hình khi cần.",
    "Mong được cập nhật tiến độ trên hệ thống.",
    "Xin hướng dẫn em bước xử lý tiếp theo.",
]
TIME_CONTEXTS = ["sáng nay", "chiều hôm qua", "đầu tuần", "sau khi hệ thống bảo trì", "trong tiết học gần nhất", "tối qua"]
PRIORITY_TEXT = {
    "low": ["Vấn đề chưa gấp nhưng mong được ghi nhận.", "Em gửi góp ý để nhà trường xem xét."],
    "medium": ["Tình trạng đang ảnh hưởng đến việc học trong tuần này.", "Mong được hỗ trợ trước buổi học tiếp theo."],
    "high": ["Em cần xử lý gấp vì sáng mai có lịch thi.", "Sự cố đang ảnh hưởng đến cả lớp và cần được kiểm tra sớm."],
}
PRIORITY_WEIGHTS = {
    "account_system": (0.15, 0.55, 0.30),
    "network": (0.15, 0.60, 0.25),
    "classroom_device": (0.10, 0.60, 0.30),
    "facility": (0.20, 0.65, 0.15),
    "schedule_exam": (0.05, 0.45, 0.50),
    "tuition_payment": (0.10, 0.65, 0.25),
    "document_profile": (0.20, 0.65, 0.15),
    "learning_platform": (0.10, 0.55, 0.35),
    "feedback": (0.75, 0.23, 0.02),
    "other": (0.55, 0.40, 0.05),
}


def apply_student_style(text: str, rng: random.Random) -> str:
    if rng.random() >= 0.12:
        return text
    replacements = {r"\bkhông\b": "ko", r"\bđược\b": "đc", r"\bvới\b": "vs", r"\bnhưng\b": "nhg"}
    value = text
    for pattern, replacement in replacements.items():
        if rng.random() < 0.35:
            value = re.sub(pattern, replacement, value, flags=re.IGNORECASE)
    return value


def allocate_counts(total: int) -> dict[str, int]:
    counts = {category: int(total * weight) for category, weight in CATEGORY_WEIGHTS.items()}
    remaining = total - sum(counts.values())
    for category in sorted(CATEGORY_WEIGHTS, key=CATEGORY_WEIGHTS.get, reverse=True)[:remaining]:
        counts[category] += 1
    return counts


def generate_rows(total: int, seed: int, dataset_version: str) -> list[dict[str, str]]:
    rng = random.Random(seed)
    rows: list[dict[str, str]] = []
    seen: set[str] = set()
    start_date = datetime.now(UTC) - timedelta(days=540)

    for category, target_count in allocate_counts(total).items():
        profile = PROFILES[category]
        created_for_category = 0
        attempts = 0
        while created_for_category < target_count:
            attempts += 1
            if attempts > target_count * 50:
                raise RuntimeError(f"Unable to generate enough unique rows for {category}")
            title_index = rng.randrange(len(profile["titles"]))
            detail_index = rng.randrange(len(profile["details"]))
            subject = rng.choice(profile["subjects"])
            values = {
                "subject": subject,
                "location": rng.choice(LOCATIONS),
                "course": rng.choice(COURSES),
            }
            title = profile["titles"][title_index].format(**values)
            detail = profile["details"][detail_index].format(**values)
            impact = rng.choice(IMPACTS).format(
                affected=rng.choice(["3", "5", "12", "25", "hơn 30"]),
                time_context=rng.choice(TIME_CONTEXTS),
            )
            priority = rng.choices(("low", "medium", "high"), weights=PRIORITY_WEIGHTS[category], k=1)[0]
            description = " ".join(
                [rng.choice(OPENERS) + ":", detail, impact, rng.choice(PRIORITY_TEXT[priority]), rng.choice(REQUESTS)]
            )
            title = apply_student_style(title, rng)
            description = apply_student_style(description, rng)
            signature = " ".join(f"{title} {description}".lower().split())
            if signature in seen:
                continue
            seen.add(signature)

            ordinal = len(rows) + 1
            created_at = start_date + timedelta(
                seconds=rng.randint(0, int((datetime.now(UTC) - start_date).total_seconds()))
            )
            scenario_group = f"{category}-{title_index:02d}-{detail_index:02d}"
            rows.append(
                {
                    "sample_id": str(uuid.uuid5(uuid.NAMESPACE_URL, f"smarttriage:{dataset_version}:{signature}")),
                    "source_ticket_id": f"SYN-{ordinal:07d}",
                    "title": title,
                    "description": description,
                    "category": category,
                    "category_label": CATEGORY_LABELS[category],
                    "priority": priority,
                    "label_source": "curated_synthetic",
                    "review_status": "approved",
                    "is_anonymized": "true",
                    "dataset_version": dataset_version,
                    "scenario_group": scenario_group,
                    "created_at": created_at.isoformat(),
                }
            )
            created_for_category += 1
    rng.shuffle(rows)
    return rows


def write_dataset(rows: list[dict[str, str]], output_path: Path, dataset_version: str, seed: int) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    fieldnames = list(rows[0].keys())
    with output_path.open("w", newline="", encoding="utf-8") as file:
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    digest = hashlib.sha256(output_path.read_bytes()).hexdigest()
    manifest = {
        "dataset_version": dataset_version,
        "sample_count": len(rows),
        "category_distribution": dict(Counter(row["category"] for row in rows)),
        "priority_distribution": dict(Counter(row["priority"] for row in rows)),
        "seed": seed,
        "sha256": digest,
        "synthetic": True,
        "contains_real_personal_data": False,
        "generated_at": datetime.now(UTC).isoformat(),
    }
    (output_path.parent / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate a realistic synthetic SmartTriage dataset")
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--total", type=int, default=DEFAULT_TOTAL)
    parser.add_argument("--seed", type=int, default=DEFAULT_SEED)
    parser.add_argument("--dataset-version", default="synthetic-v2")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    if args.total < 1_000:
        raise ValueError("Use at least 1,000 samples to keep every category representative")
    rows = generate_rows(args.total, args.seed, args.dataset_version)
    write_dataset(rows, args.output, args.dataset_version, args.seed)
    print(f"Wrote {len(rows)} synthetic rows to {args.output}")


if __name__ == "__main__":
    main()
