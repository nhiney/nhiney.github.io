// ─── Vietnamese CV content — mirrors cv-en.ts shape ──────────────────────────

import type { CVData } from "./cv-types";

export const CV_VI: CVData = {
  name: "Nguyễn Thị Yến Nhi",
  contact: {
    phone: "(+84) 326-583-876",
    email: "nhiyen.engineer@gmail.com",
    github:   { handle: "nhiney",       url: "https://github.com/nhiney"            },
    linkedin: { handle: "nhi-yen-0906", url: "https://linkedin.com/in/nhi-yen-0906" },
  },
  summary: [
    "Sinh viên năm 3 ngành Công nghệ Thông tin (GPA 3.34/4.0, dự kiến tốt nghiệp 2027) với tư duy sản phẩm — có kinh nghiệm xác định điểm đau của người dùng, phân tích yêu cầu và dẫn dắt đội kỹ thuật đưa giải pháp ra thị trường.",
    "Đảm nhận trọn vẹn phát triển ứng dụng di động: từ nghiên cứu người dùng và wireframe trên Figma đến điều phối sprint và kiểm thử trên thiết bị thật, cùng đội ngũ học thuật 4 thành viên.",
    "Hoàn thành chứng chỉ Google Project Management Professional; áp dụng phân rã công việc theo Agile và theo dõi sprint trong các dự án học thuật.",
    "Tận dụng các công cụ AI (Claude, ChatGPT, Cursor, Whimsical) để tăng tốc viết tài liệu sản phẩm, làm prototype và thiết kế quy trình trong các bài tập học thuật.",
  ],
  skills: [
    { category: "Sản phẩm & Thiết kế",   items: "Figma (wireframing, user flow), Whimsical, Nghiên cứu người dùng, Phân tích yêu cầu, Viết User Story" },
    { category: "Quản lý Dự án",         items: "Agile/Scrum, Lập kế hoạch sprint, Phân rã công việc, Trao đổi với stakeholder" },
    { category: "Kiến thức Kỹ thuật",    items: "Flutter/Dart, .NET MVC (C#), Python, Firebase, SQL Server, Git/GitHub, REST APIs" },
    { category: "AI & Dữ liệu",          items: "Prompt Engineering, Thiết kế quy trình AI, SQL (truy vấn dữ liệu), ChatGPT, Claude, Cursor" },
    { category: "Kỹ năng Mềm",           items: "Lãnh đạo đội nhóm, Tư duy phản biện, Giao tiếp có cấu trúc, Giải quyết vấn đề" },
  ],
  projects: [
    {
      title:  "Ứng dụng Đặt khám Thông minh",
      role:   "Trưởng nhóm & Lập trình viên Cốt lõi",
      period: "2/2026 – Hiện tại",
      status: { label: "Đang phát triển", tone: "ongoing" },
      problem:
        "Việc đặt lịch khám tại Việt Nam thiếu cơ chế chống xung đột thời gian thực và khó tiếp cận với người cao tuổi và người không rành công nghệ — gây trùng lịch, lúng túng khi đặt khám và tỷ lệ tự phục vụ thấp ở nhóm đối tượng yếu thế.",
      contributions: [
        "Khảo sát người dùng và wireframe trên Figma để xác định điểm vướng trong luồng đặt khám; nhận diện tương tác bằng giọng nói là nhu cầu khả dụng then chốt cho người cao tuổi — từ đó quyết định xây dựng tính năng đặt khám bằng giọng nói.",
        "Định nghĩa 3 user persona (Bệnh nhân, Bác sĩ, Quản trị viên) với quy trình riêng biệt, chuyển hóa thành yêu cầu RBAC được thực thi qua Firebase Authentication.",
        "Thiết kế mô hình dữ liệu Firestore cho hiệu năng truy vấn ở quy mô lớn, sau đó đặc tả logic chống xung đột thời gian thực bằng Firebase Transactions — ngăn chặn tình huống trùng lịch ngay tại tầng dữ liệu.",
        "Dẫn dắt đội 4 thành viên: phân rã tính năng thành các task sprint, theo dõi mốc bàn giao và đảm bảo đầu ra kỹ thuật bám sát yêu cầu sản phẩm.",
        "Thiết kế hơn 100 kịch bản kiểm thử thủ công cho luồng đặt khám cốt lõi; triển khai và kiểm thử trên thiết bị di động thật để phát hiện lỗi đặc thù môi trường mà emulator không bộc lộ.",
        "Tích hợp Google Maps API cho tính năng tìm phòng khám theo vị trí, giảm tỉ lệ rời bỏ ở bước chọn cơ sở.",
      ],
      results: [
        "Triệt tiêu trùng lịch ngay tại tầng dữ liệu nhờ Firebase Transactions",
        "Luồng đặt khám bằng giọng nói mở cửa ứng dụng cho người cao tuổi / không rành công nghệ",
        "Hơn 100 kịch bản kiểm thử thủ công đạt yêu cầu trên thiết bị thật",
        "Đội 4 thành viên bàn giao theo nhịp sprint được theo dõi sát",
      ],
      tech: "Flutter, Dart, Firebase (Firestore, Auth, Cloud Functions), Google Maps API, Figma",
      techPills: ["Flutter", "Dart", "Firebase", "Google Maps API", "Figma"],
    },
    {
      title:  "Hệ thống Bán Giày Online",
      role:   "Trưởng nhóm & Lập trình viên Cốt lõi",
      period: "12/2025",
      status: { label: "Hoàn thành trong 1 tháng", tone: "duration" },
      problem:
        "Quản lý kho thủ công gây sai lệch tồn kho và phản hồi đơn hàng chậm; không có kênh hỗ trợ tự phục vụ, tạo ra rào cản không cần thiết với khách hàng.",
      contributions: [
        "Dẫn dắt đội 3 thành viên; chuyển hóa yêu cầu nghiệp vụ thành đặc tả kỹ thuật theo kiến trúc MVC để tách bạch concern và giảm xung đột tích hợp.",
        "Xác định bất nhất tồn kho là điểm đau vận hành cốt lõi → tự động hóa cập nhật kho qua SQL Triggers và Stored Procedures, đảm bảo tính ACID và loại bỏ lỗi theo dõi thủ công.",
        "Giảm tải bộ phận hỗ trợ khách hàng bằng cách tích hợp chatbot AI nhẹ để xử lý các câu hỏi phổ biến ở quy mô.",
        "Cải thiện độ phản hồi của UX bằng AJAX, loại bỏ việc reload toàn trang gây gián đoạn.",
      ],
      results: [
        "Loại bỏ lỗi hết hàng nhờ SQL Triggers + Stored Procedures tự động",
        "Giảm tải hỗ trợ khách hàng nhờ chatbot AI xử lý câu hỏi thường gặp",
        "UX mượt hơn sau khi thay reload toàn trang bằng các call AJAX có chủ đích",
        "Tách bạch MVC giúp đội 3 người mở rộng codebase dễ dàng",
      ],
      tech: "ASP.NET MVC, C#, SQL Server, JavaScript",
      techPills: ["ASP.NET MVC", "C#", "SQL Server", "JavaScript"],
    },
    {
      title:  "Ứng dụng Học Từ vựng Tiếng Anh",
      period: "6/2025",
      status: { label: "Điểm đánh giá 9.5 / 10", tone: "shipped" },
      problem:
        "Phương pháp flashcard thủ công liên tục mất dữ liệu người dùng và phục vụ nội dung lỗi thời — chưa có công cụ desktop nhẹ nào kết hợp được nghĩa từ luôn cập nhật với khả năng lưu trữ đáng tin cậy cho người học.",
      contributions: [
        "Thiết kế hơn 5 màn hình UI bằng Tkinter, tập trung vào tương tác trực quan và ít rào cản cho người học.",
        "Tích hợp REST API ngoài để lấy nghĩa và ví dụ thời gian thực, loại bỏ phụ thuộc vào dữ liệu tĩnh.",
        "Quản lý hơn 500 entry từ vựng với CRUD đầy đủ và cơ chế xử lý file vững chắc để chống mất dữ liệu.",
        "Bàn giao bản thực thi đóng gói hoàn chỉnh; đạt điểm đánh giá 9.5/10.",
      ],
      results: [
        "Điểm đánh giá 9.5 / 10 từ hội đồng môn học",
        "Hơn 500 entry từ vựng với CRUD đầy đủ và lưu trữ file bền vững",
        "Nghĩa từ và ví dụ luôn mới mỗi lần tra cứu nhờ REST API trực tiếp",
        "File thực thi một-cú-click — người dùng không cần cài đặt",
      ],
      tech: "Python, Tkinter, JSON, REST API",
      techPills: ["Python", "Tkinter", "JSON", "REST API"],
    },
  ],
  github_note:
    "Nếu bạn quan tâm đến mảng dự án, vui lòng truy cập GitHub của tôi tại github.com/nhiney để có cái nhìn toàn diện hơn.",
  education: [
    {
      school:   "Trường Đại học Công Thương TP. Hồ Chí Minh",
      location: "TP. Hồ Chí Minh, Việt Nam",
      degree:   "Cử nhân Công nghệ Thông tin",
      gpa:      "3.34 / 4.0",
      expected: "2027",
      notes: [
        "Liên tục được giao vai trò trưởng nhóm trong các dự án học thuật; điều phối bàn giao xuyên chức năng giữa các giai đoạn thiết kế, phát triển và QA.",
      ],
    },
  ],
  certifications: [
    {
      title:  "Chứng chỉ Google Professional",
      period: "4 – 5/2026",
      source: "Coursera",
      items: [
        { label: "Quản lý Dự án",            description: "Phương pháp Agile, vòng đời dự án, quản lý stakeholder, hợp tác đội nhóm." },
        { label: "AI Chuyên nghiệp",         description: "Áp dụng công cụ AI và prompt engineering để tăng tốc quy trình trong nhiều bài tập học thuật." },
        { label: "AI Cơ bản",                description: "Prompt engineering, công cụ AI trong quy trình chuyên nghiệp, sử dụng AI có trách nhiệm." },
        { label: "Tự động hóa IT với Python", description: "Lập trình script Python, Git, quản trị hệ thống, công nghệ cloud." },
      ],
    },
  ],
  research: {
    title:  "Cuộc thi Nghiên cứu Khoa học",
    period: "3/2026",
    source: "Trường Đại học Công Thương TP. Hồ Chí Minh",
    description:
      "Đồng tác giả đề tài nghiên cứu xây dựng mạng xã hội tích hợp AI cho sinh viên; lên ý tưởng kiến trúc hệ thống và thiết kế các tương tác cốt lõi để tăng mức độ gắn kết của sinh viên.",
  },
};
