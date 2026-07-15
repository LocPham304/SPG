import type { AppLocale } from "@/i18n/routing";
import type {
  NewsCategory,
  NewsCategoryKey,
  NewsPublicationStatus,
} from "@/types/news";

export const homeNewsAssets = {
  decorativeSilhouette: "/images/public/files/image/index_img7.png",
  arrow: "/images/public/files/image/index_img4.png",
  fallbackMedia: "/images/public/files/image/indexnew10.jpg",
} as const;

export const homeNewsCategories: readonly NewsCategory[] = [
  { id: "group-news", key: "groupNews", slug: "group-news" },
  {
    id: "product-delivery",
    key: "productDelivery",
    slug: "product-delivery-dynamics",
  },
  { id: "notices", key: "notices", slug: "notices" },
];

type LocalizedNewsCopy = {
  title: string;
  summary: string;
  imageAlt: string;
};

export type MockNewsRecord = {
  id: string;
  categoryKey: NewsCategoryKey;
  slug: string;
  publishedAt: string;
  status: NewsPublicationStatus;
  isFeatured: boolean;
  imageSrc: string;
  translations: Record<AppLocale, LocalizedNewsCopy>;
};

export const mockNewsRecords: readonly MockNewsRecord[] = [
  {
    id: "group-congress-2024",
    categoryKey: "groupNews",
    slug: "group-congress-2024",
    publishedAt: "2024-03-27T00:00:00.000Z",
    status: "published",
    isFeatured: true,
    imageSrc: "/images/public/files/image/indexnew1.jpg",
    translations: {
      vi: {
        title: "Tập đoàn tổ chức hội nghị đại biểu công đoàn và người lao động",
        summary:
          "Các đại biểu cùng đánh giá hoạt động năm qua và thống nhất nhiệm vụ trọng tâm cho giai đoạn tiếp theo.",
        imageAlt: "Hội nghị đại biểu của Tập đoàn Thiết bị Cảng Sơn Đông",
      },
      en: {
        title: "Shandong Port Equipment Group convened its employee congress",
        summary:
          "Representatives reviewed the past year's work and agreed on the priorities for the next stage.",
        imageAlt: "Shandong Port Equipment Group employee congress",
      },
      zh: {
        title: "山东港口装备集团召开职工代表大会",
        summary: "与会代表总结年度工作，并明确下一阶段重点任务。",
        imageAlt: "山东港口装备集团职工代表大会",
      },
    },
  },
  {
    id: "safety-first-lesson-2024",
    categoryKey: "groupNews",
    slug: "safety-first-lesson-2024",
    publishedAt: "2024-02-18T00:00:00.000Z",
    status: "published",
    isFeatured: false,
    imageSrc: "/images/public/files/image/indexnew2.jpg",
    translations: {
      vi: {
        title: "Triển khai bài học an toàn đầu tiên sau kỳ nghỉ Tết",
        summary: "Tập đoàn tăng cường nhận thức và biện pháp an toàn khi trở lại sản xuất.",
        imageAlt: "Chương trình đào tạo an toàn sau kỳ nghỉ Tết",
      },
      en: {
        title: "The first safety lesson after the Spring Festival holiday",
        summary: "The group strengthened safety awareness and measures before production resumed.",
        imageAlt: "Safety training after the Spring Festival holiday",
      },
      zh: {
        title: "开展春节复工复产安全生产第一课",
        summary: "集团在复工前进一步强化安全意识和保障措施。",
        imageAlt: "春节后复工安全培训",
      },
    },
  },
  {
    id: "annual-summary-2023",
    categoryKey: "groupNews",
    slug: "annual-summary-2023",
    publishedAt: "2024-02-07T00:00:00.000Z",
    status: "published",
    isFeatured: false,
    imageSrc: "/images/public/files/image/indexnew3.jpg",
    translations: {
      vi: {
        title: "Hội nghị tổng kết và tuyên dương năm 2023",
        summary: "Hội nghị tổng kết kết quả và ghi nhận các tập thể, cá nhân tiêu biểu.",
        imageAlt: "Hội nghị tổng kết năm 2023",
      },
      en: {
        title: "2023 annual summary and commendation conference",
        summary: "The conference reviewed results and recognised outstanding teams and employees.",
        imageAlt: "2023 annual summary conference",
      },
      zh: {
        title: "召开2023年度总结表彰大会",
        summary: "大会总结年度成果，并表彰优秀集体和个人。",
        imageAlt: "2023年度总结表彰大会",
      },
    },
  },
  {
    id: "equipment-relocation",
    categoryKey: "productDelivery",
    slug: "equipment-relocation",
    publishedAt: "2024-03-25T00:00:00.000Z",
    status: "published",
    isFeatured: true,
    imageSrc: "/images/public/files/image/indexnew5.jpg",
    translations: {
      vi: {
        title: "Hoàn thành di dời đồng bộ thiết bị cảng quy mô lớn",
        summary: "Các thiết bị được vận chuyển và bàn giao an toàn, đúng tiến độ.",
        imageAlt: "Thiết bị cẩu cảng được bàn giao",
      },
      en: {
        title: "Large-scale port equipment relocation completed successfully",
        summary: "The equipment was transported and delivered safely and on schedule.",
        imageAlt: "Port crane equipment delivery",
      },
      zh: {
        title: "大型港口设备搬迁项目顺利完成",
        summary: "设备安全运输并按计划完成交付。",
        imageAlt: "港口起重设备交付",
      },
    },
  },
  {
    id: "green-equipment",
    categoryKey: "productDelivery",
    slug: "green-equipment",
    publishedAt: "2024-03-10T00:00:00.000Z",
    status: "published",
    isFeatured: false,
    imageSrc: "/images/public/files/image/indexnew7.jpg",
    translations: {
      vi: {
        title: "Thiết bị xanh hỗ trợ xây dựng bến cảng gần như không carbon",
        summary: "Giải pháp điện hóa giúp giảm phát thải trong hoạt động khai thác cảng.",
        imageAlt: "Hệ thống thiết bị công nghiệp xanh",
      },
      en: {
        title: "Green equipment supports a near-zero-carbon terminal",
        summary: "Electrification solutions help reduce emissions in port operations.",
        imageAlt: "Green industrial equipment system",
      },
      zh: {
        title: "绿色装备助力建设近零碳码头",
        summary: "电动化改造方案帮助港口作业降低排放。",
        imageAlt: "绿色工业设备系统",
      },
    },
  },
  {
    id: "smart-port-delivery",
    categoryKey: "productDelivery",
    slug: "smart-port-delivery",
    publishedAt: "2024-03-02T00:00:00.000Z",
    status: "published",
    isFeatured: false,
    imageSrc: "/images/public/files/image/indexnew9.jpg",
    translations: {
      vi: {
        title: "Giải pháp thiết bị thông minh được đưa vào vận hành tại cảng",
        summary: "Dự án nâng cao hiệu quả vận hành và năng lực xếp dỡ hàng hóa.",
        imageAlt: "Thiết bị thông minh tại bến cảng",
      },
      en: {
        title: "Smart equipment solution enters service at the port",
        summary: "The project improves operating efficiency and cargo-handling capacity.",
        imageAlt: "Smart equipment at the port terminal",
      },
      zh: {
        title: "智慧装备解决方案在港口投入运行",
        summary: "项目进一步提升作业效率和货物装卸能力。",
        imageAlt: "港口码头智慧装备",
      },
    },
  },
  {
    id: "annual-commendation-notice",
    categoryKey: "notices",
    slug: "annual-commendation-notice",
    publishedAt: "2024-01-26T00:00:00.000Z",
    status: "published",
    isFeatured: true,
    imageSrc: "/images/public/files/image/indexnew4.jpg",
    translations: {
      vi: {
        title: "Thông báo về đối tượng đánh giá và tuyên dương năm 2023",
        summary: "Công bố danh sách đề xuất trong chương trình tổng kết và tuyên dương năm 2023.",
        imageAlt: "Hội nghị công bố thông báo doanh nghiệp",
      },
      en: {
        title: "Announcement on the 2023 annual commendation candidates",
        summary: "The proposed candidates for the 2023 annual review and commendation are announced.",
        imageAlt: "Corporate announcement conference",
      },
      zh: {
        title: "关于2023年度总结评选表彰对象的公示",
        summary: "现对2023年度总结评选表彰拟推荐对象进行公示。",
        imageAlt: "企业公示会议",
      },
    },
  },
  {
    id: "internal-draft",
    categoryKey: "groupNews",
    slug: "internal-draft",
    publishedAt: "2025-01-01T00:00:00.000Z",
    status: "draft",
    isFeatured: false,
    imageSrc: homeNewsAssets.fallbackMedia,
    translations: {
      vi: { title: "Bản nháp", summary: "Không công khai", imageAlt: "" },
      en: { title: "Draft", summary: "Not public", imageAlt: "" },
      zh: { title: "草稿", summary: "不公开", imageAlt: "" },
    },
  },
];
