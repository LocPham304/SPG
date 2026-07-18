import type {
  AdminActivity,
  AdminArticle,
  AdminContactMessage,
} from "@/types/admin";

export const adminArticles: readonly AdminArticle[] = [
  {
    id: "article-001",
    title: "Tập đoàn tổ chức hội nghị người lao động năm 2024",
    summary:
      "Hội nghị tổng kết hoạt động và thống nhất các nhiệm vụ trọng tâm trong năm.",
    category: "Tin tức tập đoàn",
    authorName: "Quản trị viên",
    authorEmail: "admin@example.com",
    status: "published",
    createdAt: "2024-03-20",
    publishedAt: "2024-03-27",
    content:
      "Hội nghị được tổ chức với sự tham gia của đại diện các đơn vị trực thuộc. Các đại biểu đã thảo luận những nhiệm vụ trọng tâm và giải pháp nâng cao hiệu quả hoạt động.",
    seoTitle: "Hội nghị người lao động năm 2024",
    seoDescription:
      "Thông tin về hội nghị người lao động của Tập đoàn Thiết bị Cảng Sơn Đông.",
  },
  {
    id: "article-002",
    title: "Hoàn thành bàn giao thiết bị cảng theo đúng tiến độ",
    summary:
      "Lô thiết bị mới đã hoàn tất kiểm tra kỹ thuật và được bàn giao cho khách hàng.",
    category: "Bàn giao sản phẩm",
    authorName: "Nhân viên",
    authorEmail: "employee@example.com",
    status: "published",
    createdAt: "2024-03-18",
    publishedAt: "2024-03-19",
    content:
      "Đội ngũ dự án đã phối hợp hoàn thành các hạng mục sản xuất, kiểm tra và nghiệm thu theo kế hoạch. Thiết bị đáp ứng các yêu cầu kỹ thuật trước khi bàn giao.",
    seoTitle: "Bàn giao thiết bị cảng đúng tiến độ",
    seoDescription:
      "Lô thiết bị cảng được hoàn thành kiểm tra và bàn giao theo kế hoạch.",
  },
  {
    id: "article-003",
    title: "Chương trình đào tạo an toàn sản xuất quý I",
    summary:
      "Cán bộ và người lao động tham gia chương trình cập nhật kiến thức an toàn.",
    category: "Tin tức tập đoàn",
    authorName: "Nhân viên",
    authorEmail: "employee@example.com",
    status: "draft",
    createdAt: "2024-03-15",
    content:
      "Chương trình tập trung vào quy trình làm việc an toàn, nhận diện nguy cơ và kỹ năng xử lý tình huống tại khu vực sản xuất.",
    seoTitle: "Đào tạo an toàn sản xuất quý I",
    seoDescription:
      "Chương trình cập nhật kiến thức an toàn cho cán bộ và người lao động.",
  },
  {
    id: "article-004",
    title: "Thiết bị xanh góp phần xây dựng cảng phát thải thấp",
    summary:
      "Giải pháp chuyển đổi thiết bị sử dụng nhiên liệu sang vận hành bằng điện.",
    category: "Bàn giao sản phẩm",
    authorName: "Quản trị viên",
    authorEmail: "admin@example.com",
    status: "published",
    createdAt: "2024-03-08",
    publishedAt: "2024-03-10",
    content:
      "Các thiết bị được nâng cấp sang hệ truyền động điện nhằm giảm phát thải trong quá trình khai thác và nâng cao hiệu quả vận hành.",
    seoTitle: "Thiết bị xanh cho cảng phát thải thấp",
    seoDescription:
      "Giải pháp thiết bị điện hỗ trợ vận hành cảng theo định hướng xanh.",
  },
  {
    id: "article-005",
    title: "Thông báo kế hoạch bảo trì hệ thống tháng 4",
    summary:
      "Một số chức năng nội bộ sẽ tạm ngừng trong thời gian bảo trì định kỳ.",
    category: "Thông báo",
    authorName: "Quản trị viên",
    authorEmail: "admin@example.com",
    status: "hidden",
    createdAt: "2024-03-05",
    content:
      "Hoạt động bảo trì được thực hiện theo kế hoạch để đảm bảo tính ổn định của hệ thống.",
    seoTitle: "Kế hoạch bảo trì hệ thống tháng 4",
    seoDescription: "Thông báo lịch bảo trì hệ thống định kỳ trong tháng 4.",
  },
  {
    id: "article-006",
    title: "Đề xuất nội dung truyền thông nội bộ tháng 3",
    summary:
      "Bản nội dung đang được điều chỉnh theo phản hồi của bộ phận phụ trách.",
    category: "Tin tức tập đoàn",
    authorName: "Nhân viên",
    authorEmail: "employee@example.com",
    status: "draft",
    createdAt: "2024-03-01",
    content:
      "Nội dung tổng hợp các hoạt động nổi bật trong tháng và dự kiến kế hoạch truyền thông tiếp theo.",
    seoTitle: "Truyền thông nội bộ tháng 3",
    seoDescription: "Tổng hợp đề xuất nội dung truyền thông nội bộ tháng 3.",
  },
];

export const adminContacts: readonly AdminContactMessage[] = [
  {
    id: "contact-001",
    name: "Nguyễn Minh Anh",
    company: "Công ty Logistics Đông Nam",
    email: "minhanh@example.com",
    phone: "0901 234 567",
    status: "new",
    sentAt: "2024-03-28 09:15",
    message:
      "Chúng tôi muốn nhận tư vấn về giải pháp thiết bị xếp dỡ cho kho hàng mới.",
  },
  {
    id: "contact-002",
    name: "Trần Quốc Huy",
    company: "Cảng Minh Hải",
    email: "quochuy@example.com",
    phone: "0912 345 678",
    status: "in_progress",
    assignee: "Nhân viên",
    sentAt: "2024-03-27 15:40",
    message:
      "Vui lòng cung cấp thêm thông tin kỹ thuật và thời gian dự kiến bàn giao.",
    internalNote: "Đã chuyển yêu cầu cho bộ phận kỹ thuật chuẩn bị tài liệu.",
  },
  {
    id: "contact-003",
    name: "Lê Thu Hà",
    email: "thuha@example.com",
    phone: "0988 111 222",
    status: "waiting_customer",
    assignee: "Quản trị viên",
    sentAt: "2024-03-26 11:20",
    message:
      "Tôi cần trao đổi về chính sách bảo hành cho thiết bị đã bàn giao.",
    internalNote: "Đã gửi email yêu cầu khách hàng cung cấp mã hợp đồng.",
  },
  {
    id: "contact-004",
    name: "Phạm Hoàng Long",
    company: "Công ty Công nghiệp Biển",
    email: "hoanglong@example.com",
    phone: "0933 456 789",
    status: "resolved",
    assignee: "Nhân viên",
    sentAt: "2024-03-24 08:30",
    message: "Đề nghị xác nhận lịch khảo sát tại cảng trong tuần tới.",
    internalNote: "Hai bên đã thống nhất lịch khảo sát vào ngày 02/04.",
  },
  {
    id: "contact-005",
    name: "Đỗ Hải Nam",
    email: "hainam@example.com",
    phone: "0909 555 666",
    status: "archived",
    assignee: "Quản trị viên",
    sentAt: "2024-03-20 14:05",
    message: "Yêu cầu gửi lại hồ sơ năng lực của doanh nghiệp.",
  },
];

export const adminActivities: readonly AdminActivity[] = [
  {
    id: "activity-001",
    title: "Nhân viên đã đăng bài viết",
    description: "Nhân viên đã đăng bài “Hoàn thành bàn giao thiết bị cảng”.",
    occurredAt: "28/03/2024, 10:20",
  },
  {
    id: "activity-002",
    title: "Liên hệ mới",
    description: "Nguyễn Minh Anh đã gửi một yêu cầu tư vấn.",
    occurredAt: "28/03/2024, 09:15",
  },
  {
    id: "activity-003",
    title: "Cập nhật trạng thái liên hệ",
    description: "Yêu cầu của Trần Quốc Huy đang được xử lý.",
    occurredAt: "27/03/2024, 16:05",
  },
];

export const articleCategories = [
  "Tin thời sự",
  "Tin tức tập đoàn",
  "Bàn giao sản phẩm",
  "Thông báo",
] as const;
