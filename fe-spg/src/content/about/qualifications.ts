import type { AppLocale } from "@/i18n/routing";

export type QualificationCategoryId =
  | "permit"
  | "systems"
  | "qualifications";

export type QualificationCategory = {
  id: QualificationCategoryId;
  label: string;
  images: readonly string[];
};

export type QualificationCompany = {
  id: string;
  name: string;
  categories: readonly QualificationCategory[];
};

export type QualificationsContent = {
  closeLabel: string;
  companies: readonly QualificationCompany[];
};

const image = (fileName: string) =>
  `/images/uploads/allimg/20240221/${fileName}`;

const qualificationAssets: readonly {
  id: string;
  categories: readonly {
    id: QualificationCategoryId;
    images: readonly string[];
  }[];
}[] = [
  {
    id: "qingdao",
    categories: [
      {
        id: "permit",
        images: [
          image("700c1e73eea05ecc0c5ed5bee5271970.jpg"),
          image("35d403a4ea7480d4af4e1379a485b73a.jpg"),
          image("63fbbc50ce1115258a5898666186a898.jpg"),
          image("132a64c41eddf959f6b39cb25a8cc0c2.jpg"),
        ],
      },
      {
        id: "systems",
        images: [
          image("19c7c3bd6fb6bc77ee78cb7ae75ce86a.jpg"),
          image("d41bcf6654008525ac2aa7268d275b61.jpg"),
          image("6e40e77e0b629ff92212a891b1e10230.jpg"),
        ],
      },
      {
        id: "qualifications",
        images: [
          image("de793b3678e0b105c595f3c1a368873e.jpg"),
          image("1ce1a2af34ec2e445442fa7d0bbb9e8c.jpg"),
          image("ab0606f8fbc3eb2aa619efd4048932be.jpg"),
          image("ced90eb47c384ba6628dd6f036da9313.jpg"),
          image("b7ca9ebe977ba5cac6130c7e57ec9fcd.jpg"),
          image("4a44b8143d671777779aaa399de3e047.jpg"),
        ],
      },
    ],
  },
  {
    id: "rizhao",
    categories: [
      {
        id: "permit",
        images: [image("b4b499d1b857b87e71ef2d116a79c6d3.jpg")],
      },
      {
        id: "systems",
        images: [
          image("dc86aeab5662a68c033df4ea675d85af.jpg"),
          image("43bf0c337b3350c52c206157a4222db9.jpg"),
          image("b665a2841d6cac8a1ca5d5db7a7e1799.jpg"),
          image("981de01118e324220783948ef29021db.jpg"),
        ],
      },
      {
        id: "qualifications",
        images: [
          image("a875d1e0f414ed9574c10649c9d16d0e.jpg"),
          image("0dc38f1bef59bf12d2ee195ecbbbd712.jpg"),
          image("87db2fd77eb1b66b615e3055d9e15308.jpg"),
          image("894d27df442a2c8e188ddfaf316a532a.jpg"),
          image("ca116a7d10f0fdd61ce7a7499c218d80.jpg"),
          image("99f90fd67605972e187b5ce206b1fcd3.jpg"),
          image("368350b8f8bac3ffcf570caee6626116.jpg"),
        ],
      },
    ],
  },
  {
    id: "yantai",
    categories: [
      {
        id: "permit",
        images: [
          image("b384415a4d1391dc4683410387909a49.jpg"),
          image("2e37d6d736301303d71527a1d898d35e.jpg"),
          image("9364c338213e139984bebc21ecf42df6.jpg"),
          image("2ee12fc73e3a243cd2b9c71eb54cf981.jpg"),
        ],
      },
      {
        id: "systems",
        images: [image("b4e2f124df111ca8d2094b8cd58a95a6.jpg")],
      },
      {
        id: "qualifications",
        images: [
          image("dd94feed45f8e7e165db64d156121370.jpg"),
          image("05db5d75fa04b7ad5ba79b97fcd0390a.jpg"),
        ],
      },
    ],
  },
  {
    id: "gangda",
    categories: [
      {
        id: "systems",
        images: [
          image("395dc8d8462610dbe11c2c13ab2e2486.jpg"),
          image("1236e801f959d80f7b5a832de1d4a578.jpg"),
          image("a6f4c307192827c76c43099be638b2c2.jpg"),
        ],
      },
      {
        id: "qualifications",
        images: [
          image("7c168c1d9042048fc211bb908aced7aa.jpg"),
          image("6cc0601d54988372485bc2e9b0702419.jpg"),
          image("86076e09fdf410893ac962f461b8a333.jpg"),
          image("6a4514070f80ee4c5677aa3da7637bde.jpg"),
          image("57cc9f472d4e177f7940254b7012c70f.jpg"),
        ],
      },
    ],
  },
  {
    id: "offshore",
    categories: [
      {
        id: "systems",
        images: [
          image("2069451c46479bb016d4abfd2d89c8e3.jpg"),
          image("0e1443e4caf6611e52be176d06d15800.jpg"),
          image("9c97d7573f60e4cba606f3880ffa8297.jpg"),
        ],
      },
    ],
  },
];

const qualificationText: Record<
  AppLocale,
  {
    categoryLabels: Record<QualificationCategoryId, string>;
    closeLabel: string;
    companyNames: Record<string, string>;
  }
> = {
  en: {
    categoryLabels: {
      permit: "Permit",
      systems: "Three Systems",
      qualifications: "Qualifications",
    },
    closeLabel: "Close certificate preview",
    companyNames: {
      qingdao: "Qingdao Port Equipment Manufacturing Co., Ltd",
      rizhao: "Rizhao Port Marine Machinery Industry Co., Ltd",
      yantai: "Shandong Luhai Heavy Industry Co., Ltd",
      gangda: "Rizhao Gangda Shipbuilding Heavy Industry Co., Ltd",
      offshore: "Shangang (Shandong) Offshore Equipment Co., Ltd",
    },
  },
  vi: {
    categoryLabels: {
      permit: "Giấy phép",
      systems: "Ba hệ thống",
      qualifications: "Chứng nhận năng lực",
    },
    closeLabel: "Đóng bản xem trước chứng chỉ",
    companyNames: {
      qingdao: "Công ty TNHH Tập đoàn Thiết bị Lục Hải Sơn Đông - Thanh Đảo",
      rizhao: "Công ty TNHH Tập đoàn Thiết bị Lục Hải Sơn Đông - Nhật Chiếu",
      yantai: "Công ty TNHH Tập đoàn Thiết bị Lục Hải Sơn Đông - Yên Đài",
      gangda: "Công ty TNHH Công nghiệp nặng Đóng tàu Cảng Đạt Nhật Chiếu",
      offshore: "Công ty TNHH Thiết bị Công trình biển Shangang (Sơn Đông)",
    },
  },
  zh: {
    categoryLabels: {
      permit: "许可证",
      systems: "三体系",
      qualifications: "资质证书",
    },
    closeLabel: "关闭证书预览",
    companyNames: {
      qingdao: "山东陆海装备集团青岛有限公司",
      rizhao: "山东陆海装备集团日照有限公司",
      yantai: "山东陆海装备集团烟台有限公司",
      gangda: "日照港达船舶重工有限公司",
      offshore: "山港（山东）海工装备有限公司",
    },
  },
};

export function getQualificationsContent(
  locale: AppLocale,
): QualificationsContent {
  const text = qualificationText[locale];

  return {
    closeLabel: text.closeLabel,
    companies: qualificationAssets.map((company) => ({
      id: company.id,
      name: text.companyNames[company.id],
      categories: company.categories.map((category) => ({
        ...category,
        label: text.categoryLabels[category.id],
      })),
    })),
  };
}
