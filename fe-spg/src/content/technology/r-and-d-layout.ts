import type { AppLocale } from "@/i18n/routing";

export type ResearchLayoutCard = {
  image: {
    alt: string;
    height: number;
    src: string;
    width: number;
  };
  primaryLabel: string;
  secondaryLabel?: string;
};

export type ResearchLayoutSection = {
  cards: readonly ResearchLayoutCard[];
  id: string;
  title: string;
  tone?: "muted";
};

export type ResearchLayoutContent = {
  description: string;
  pageTitle: string;
  sections: readonly ResearchLayoutSection[];
  title: string;
};

const imagePaths = {
  highTech: [
    {
      height: 826,
      src: "/images/uploads/allimg/20240223/62be53fd12ed72eb565baf67b49cde03.png",
      width: 1171,
    },
    {
      height: 830,
      src: "/images/uploads/allimg/20240327/ee8e5e34a502b0fb6e7c17be9264aef6.png",
      width: 1174,
    },
    {
      height: 1130,
      src: "/images/uploads/allimg/20240222/100bd078628bd7df98ca493ad7b13ab4.jpg",
      width: 1678,
    },
    {
      height: 689,
      src: "/images/uploads/allimg/20240222/46dfa27fdd5b2762e8bf44f2b66df9dc.jpg",
      width: 1000,
    },
  ],
  specialized: [
    {
      height: 348,
      src: "/images/uploads/allimg/20240327/4878aef0f0c3a2e4786818833d486100.jpg",
      width: 576,
    },
    {
      height: 348,
      src: "/images/uploads/allimg/20240327/8f3212067f96e870047f03df81a8a6b0.jpg",
      width: 576,
    },
    {
      height: 348,
      src: "/images/uploads/allimg/20240327/edb64283036519b27631cc7039a5706a.jpg",
      width: 576,
    },
  ],
  platforms: [4, 5, 6, 7].map((number) => ({
    height: 218,
    src: `/images/public/files/image/technology_layout_img${number}.jpg`,
    width: 350,
  })),
} as const;

function createCards(
  images: readonly { height: number; src: string; width: number }[],
  labels: readonly { primary: string; secondary?: string }[],
): readonly ResearchLayoutCard[] {
  return labels.map((label, index) => ({
    image: {
      ...images[index],
      alt: [label.primary, label.secondary].filter(Boolean).join(" - "),
    },
    primaryLabel: label.primary,
    secondaryLabel: label.secondary,
  }));
}

const content: Record<AppLocale, ResearchLayoutContent> = {
  en: {
    title: "Technical Innovation",
    pageTitle: "R&D layout",
    description:
      "The research and development network and innovation platforms of Shandong Port Equipment Group.",
    sections: [
      {
        id: "high-tech-enterprises",
        title: "High-tech enterprises",
        cards: createCards(imagePaths.highTech, [
          { primary: "Qingdao equipment" },
          { primary: "Rizhao ship engine" },
          { primary: "Land and Sea Heavy Industries" },
          { primary: "Rizhao Port" },
        ]),
      },
      {
        id: "specialized-enterprises",
        title: "Provincial-level specialized and special new enterprises",
        tone: "muted",
        cards: createCards(imagePaths.specialized, [
          { primary: "Land and Sea Heavy Industries" },
          { primary: "Rizhao ship engine" },
          { primary: "Rizhao Port" },
        ]),
      },
      {
        id: "research-platforms",
        title: "Provincial and ministerial R&D platform",
        cards: createCards(imagePaths.platforms, [
          {
            primary: "Rizhao Port",
            secondary: "Shandong Province Marine Ranching Platform",
          },
          {
            primary: "Rizhao Port",
            secondary:
              "Shandong Provincial Marine In-situ Sensor Collaborative Innovation Center",
          },
          {
            primary: "Rizhao ship engine",
            secondary:
              "Shandong Engineering Research Center of Intelligent Control and Robotics",
          },
          {
            primary: "Equipment Group",
            secondary:
              "R&D center for automated terminal technology and transportation industry",
          },
        ]),
      },
    ],
  },
  vi: {
    title: "Đổi mới công nghệ",
    pageTitle: "Bố trí R&D",
    description:
      "Mạng lưới nghiên cứu phát triển và các nền tảng đổi mới của Tập đoàn Thiết bị Cảng Sơn Đông.",
    sections: [
      {
        id: "high-tech-enterprises",
        title: "Doanh nghiệp công nghệ cao",
        cards: createCards(imagePaths.highTech, [
          { primary: "Thiết bị Thanh Đảo" },
          { primary: "Công ty Nhật Chiếu" },
          { primary: "Công nghiệp nặng Lục Hải" },
          { primary: "Cảng Nhật Chiếu" },
        ]),
      },
      {
        id: "specialized-enterprises",
        title: "Doanh nghiệp chuyên biệt, tinh gọn và đổi mới cấp tỉnh",
        tone: "muted",
        cards: createCards(imagePaths.specialized, [
          { primary: "Công nghiệp nặng Lục Hải" },
          { primary: "Công ty Nhật Chiếu" },
          { primary: "Cảng Nhật Chiếu" },
        ]),
      },
      {
        id: "research-platforms",
        title: "Nền tảng R&D cấp tỉnh và cấp bộ",
        cards: createCards(imagePaths.platforms, [
          {
            primary: "Cảng Nhật Chiếu",
            secondary: "Nền tảng nuôi biển tỉnh Sơn Đông",
          },
          {
            primary: "Cảng Nhật Chiếu",
            secondary:
              "Trung tâm Đổi mới Hợp tác Cảm biến Biển tại chỗ tỉnh Sơn Đông",
          },
          {
            primary: "Công ty Nhật Chiếu",
            secondary:
              "Trung tâm Nghiên cứu Kỹ thuật Sơn Đông về Điều khiển Thông minh và Robot",
          },
          {
            primary: "Tập đoàn Thiết bị",
            secondary:
              "Trung tâm R&D công nghệ bến cảng tự động và ngành vận tải",
          },
        ]),
      },
    ],
  },
  zh: {
    title: "技术创新",
    pageTitle: "研发布局",
    description: "山东陆海装备集团的研发网络与创新平台。",
    sections: [
      {
        id: "high-tech-enterprises",
        title: "高新技术企业",
        cards: createCards(imagePaths.highTech, [
          { primary: "青岛公司" },
          { primary: "日照公司" },
          { primary: "烟台公司" },
          { primary: "港达船舶" },
        ]),
      },
      {
        id: "specialized-enterprises",
        title: "省级专精特新企业",
        tone: "muted",
        cards: createCards(imagePaths.specialized, [
          { primary: "烟台公司" },
          { primary: "日照公司" },
          { primary: "港达船舶" },
        ]),
      },
      {
        id: "research-platforms",
        title: "省部级研发平台",
        cards: createCards(imagePaths.platforms, [
          { primary: "港达船舶", secondary: "山东省海洋牧场平台" },
          {
            primary: "港达船舶",
            secondary: "山东省海洋原位传感器协同创新中心",
          },
          {
            primary: "日照公司",
            secondary: "智能控制与机器人山东省工程研究中心",
          },
          {
            primary: "青岛公司",
            secondary: "自动化码头技术交通运输行业研发中心",
          },
        ]),
      },
    ],
  },
};

export function getResearchLayoutContent(locale: AppLocale) {
  return content[locale];
}
