import type { AppLocale } from "@/i18n/routing";

import type { ContainerHandlingGalleryItem } from "./container-handling";

type LiquefiedOilSectionId =
  | "tank-piping-installation"
  | "steel-structure-engineering"
  | "tank-maintenance";

type LocalizedText = Record<AppLocale, string>;

type GalleryAsset = {
  file: string;
  caption: LocalizedText;
};

export type LiquefiedOilHandlingContent = {
  title: string;
  description: string;
  productsLabel: string;
  intro: string;
  previousLabel: string;
  nextLabel: string;
  galleryLabel: string;
  sections: readonly {
    id: LiquefiedOilSectionId;
    title: string;
    paragraphs: readonly string[];
    images: readonly ContainerHandlingGalleryItem[];
  }[];
};

const assetRoot = "/images/uploads/allimg/20240531";

function asset(file: string, en: string, vi: string, zh: string): GalleryAsset {
  return { file, caption: { en, vi, zh } };
}

const galleryAssets: Record<LiquefiedOilSectionId, readonly GalleryAsset[]> = {
  "tank-piping-installation": [
    asset("129714c13ed56ff030c83aebdf6d1b68_lp.jpg", "Qingdao Port - Dongjiakou crude oil tank farm", "Khu bồn chứa dầu thô Dongjiakou, Cảng Thanh Đảo", "青岛港-董家口原油罐区"),
    asset("0bdf3f025af155067d0b5cc45cb6b180_lp.jpg", "Qingdao Port - Dongjiakou crude oil tank farm", "Khu bồn chứa dầu thô Dongjiakou, Cảng Thanh Đảo", "青岛港-董家口原油罐区"),
    asset("d06064239941bc96d47398bb6f1fd6ed_lp.jpg", "Qingdao Port - Dongjiakou crude oil tank farm", "Khu bồn chứa dầu thô Dongjiakou, Cảng Thanh Đảo", "青岛港-董家口原油罐区"),
    asset("70e43a561bd1663c046a4ef04b9afd3d_lp.jpg", "Qingdao Port - Dongjiakou crude oil tank farm", "Khu bồn chứa dầu thô Dongjiakou, Cảng Thanh Đảo", "青岛港-董家口原油罐区"),
    asset("e4d44bbdaeef608bf1164030d08b5a99_lp.jpg", "Qingdao Port - Dongjiakou crude oil tank farm", "Khu bồn chứa dầu thô Dongjiakou, Cảng Thanh Đảo", "青岛港-董家口原油罐区"),
  ],
  "steel-structure-engineering": [
    asset("82fd53f9d2bd080e41ab11af2a70ec08_lp.jpg", "Crude oil pipeline arm", "Cần xuất nhập dầu thô", "原油管道输油臂"),
    asset("94e4c53cd9740f58880c027b51406af8_lp.jpg", "Crude oil pipelines", "Đường ống dầu thô", "原油管线"),
    asset("d177c7efcc80676ea08e59a8f4ff80fd_lp.jpg", "Binzhou Port liquid bulk operation area project", "Dự án khu khai thác hàng lỏng tại Cảng Tân Châu", "滨州港海港港区液体散货作业区工程"),
    asset("139cbd4bd011d33495e69e63c4ca6135_lp.jpg", "Crude oil tank farms and pipelines", "Khu bồn chứa và đường ống dầu thô", "原油罐区及管线"),
    asset("9c91bd1784791776702c65340a25a43b_lp.jpg", "Binzhou Port liquid bulk operation area project", "Dự án khu khai thác hàng lỏng tại Cảng Tân Châu", "滨州港海港港区液体散货作业区工程"),
    asset("ecaeea7222aaf8bb0f04619efb8794f8_lp.jpg", "Lanshan 300,000-ton oil terminal", "Bến dầu 300.000 tấn Lanshan", "岚山30万吨油码头"),
    asset("05e2cb96eb0aee678002d6aab332eaa1_lp.jpg", "Asia Symbol PM14 pipe-gallery steel structure project", "Dự án kết cấu thép hành lang ống Asia Symbol PM14", "亚太森博PM14管廊钢结构项目"),
    asset("2dc2d42ad1c928f9c1d3ab9bbc5e94df_lp.jpg", "Lanshan 300,000-ton steel approach bridge project", "Dự án cầu dẫn thép 300.000 tấn Lanshan", "岚山30万吨钢引桥工程"),
    asset("c8d5f543c3739e75eec310e620965bb6_lp.jpg", "Asia Symbol RB11R steel pipe-gallery project", "Dự án hành lang ống kết cấu thép Asia Symbol RB11R", "亚太森博浆纸有限公司RB11R项目钢结构管廊"),
    asset("685e3957a6bf9447732bbde27873af74_lp.jpg", "Yantai Port West Port Area crude oil terminal phase II", "Giai đoạn II bến dầu thô khu cảng phía Tây, Cảng Yên Đài", "烟台港西港区原油码头二期工程"),
    asset("b89fdabe4a05bd4afdc890f7c75ea04c_lp.jpg", "Yantai Port crude oil terminal phase II external pipeline steel structure", "Kết cấu thép tuyến ống ngoài giai đoạn II bến dầu thô Cảng Yên Đài", "烟台港西港区原油码头二期外接管线钢结构工程"),
  ],
  "tank-maintenance": [
    asset("0c9b645d3ef8a0386c14b18980239aaa_lp.jpg", "Tank anti-corrosion - floating-roof manholes and reinforcing rings", "Chống ăn mòn bồn chứa - cửa người chui và vòng gia cường mái nổi", "储罐防腐-浮舱人孔、加强圈防腐"),
    asset("598b0c9e1214001aff5f6f74fa0063eb_lp.jpg", "Tank anti-corrosion - tank-top platform", "Chống ăn mòn bồn chứa - sàn thao tác trên nóc bồn", "储罐防腐-罐顶平台防腐"),
    asset("2f65f572220ea7e2397a403182617aeb_lp.jpg", "Tank anti-corrosion - nine-section wall panels", "Chống ăn mòn bồn chứa - tấm thành chín đoạn", "储罐防腐-九节壁板防腐"),
    asset("ff1406857b0d49fbadcdeb0eb0fe827e_lp.jpg", "Tank cleaning - oil-water separation", "Vệ sinh bồn chứa - tách dầu và nước", "储罐清洗-油水分离"),
    asset("15707f2ca61d9a96aa2f62d6ee3d3ce1_lp.jpg", "Tank cleaning - cleaning guns", "Vệ sinh bồn chứa - súng làm sạch", "储罐清洗-清洗枪"),
    asset("eb4a5eba51aa1236bc39bfb78d03b11d_lp.jpg", "Tank cleaning - pipeline layout", "Vệ sinh bồn chứa - bố trí đường ống", "储罐清洗-管道布设"),
    asset("2361df0b7cc9dda8c09c925fc62f6771_lp.jpg", "Tank cleaning - cleaning-machine layout", "Vệ sinh bồn chứa - bố trí máy làm sạch", "储罐清洗-清洗机布设"),
    asset("21b725252cb9d06a9775d059f5fd1394_lp.jpg", "Tank cleaning - nitrogen generator", "Vệ sinh bồn chứa - máy tạo nitơ", "储罐清洗-制氮机"),
    asset("79d2ccce577336a94d8fce63f6b0b600_lp.jpg", "Tank maintenance operation", "Công tác bảo trì bồn chứa", "储罐维护作业"),
    asset("7ca2d190e9b2ba83a5602580dc5a0399_lp.jpg", "Tank repair - wax scraper removal and replacement", "Sửa chữa bồn chứa - tháo và thay bộ gạt sáp", "储罐维修-刮蜡器拆除更换"),
    asset("eb3d1ce72ee8ef11ce868ac45d4ea5e0_lp.jpg", "Tank repair - anode block", "Sửa chữa bồn chứa - khối anốt", "储罐维修-阳极块"),
    asset("d95a52f78ece37292907f33ff7f04598_lp.jpg", "Tank repair - fire-sprinkler system replacement", "Sửa chữa bồn chứa - thay hệ thống phun chữa cháy", "储罐维修-消防喷淋系统拆除更换"),
    asset("ca068500bac4a3a0c94df0dbebc7711c_lp.jpg", "Tank maintenance - primary and secondary seal replacement", "Bảo trì bồn chứa - lắp đặt thay thế phớt sơ cấp và thứ cấp", "储罐维修-一二次密封更换安装"),
  ],
};

const sectionText: Record<
  AppLocale,
  Record<LiquefiedOilSectionId, { title: string; paragraphs: readonly string[] }>
> = {
  en: {
    "tank-piping-installation": {
      title: "Tank and piping installation",
      paragraphs: [
        "The group holds second-level general contracting qualifications for mechanical and electrical installation and petrochemical engineering construction, together with professional anti-corrosion and thermal-insulation contracting qualifications. Its business covers storage tanks and process pipelines, including spherical and floating-roof tanks. Projects include the Dongjiakou Mercuria tank farm, Weifang and Guangrao tank farms, Dongjiakou commercial storage, the Lianyungang Shenghong petrochemical pipeline and the Rizhao Lanshan Chambroad pipeline.",
      ],
    },
    "steel-structure-engineering": {
      title: "Steel Structure Engineering",
      paragraphs: [
        "The business scope covers pipe-gallery steel structures, steel approach bridges, pipe-belt and belt-conveyor steel structures, supporting wharf steel structures and equipment steel structures.",
        "Projects include the steel pipe gallery for phase II of Yantai Port West Port Area crude oil terminal, the Binzhou Port liquid bulk operation area, the supporting tank farm for the 20,000-ton/5,000-ton liquid bulk terminal in central Lanshan Port Area, phase I of the Lanshan public oil and gas pipe gallery, the 300,000-ton steel approach bridge at Lanshan liquid chemical terminal, and the Asia Symbol RB11R and PM14 TG4 pipe-gallery steel structures.",
      ],
    },
    "tank-maintenance": {
      title: "Tank cleaning, anti-corrosion, maintenance",
      paragraphs: [
        "Work follows national and petrochemical-industry specifications, standards and operating requirements for mechanized petroleum tank cleaning, anti-corrosion and maintenance. After cleaning, tanks are free of water and residue. Anti-corrosion coatings are smooth and uniform, without bubbles, runs or missed areas. Hydrostatic testing is performed at a standard height of 17.5 metres for 48 hours, and completed works meet national acceptance standards.",
      ],
    },
  },
  vi: {
    "tank-piping-installation": {
      title: "Lắp đặt bồn chứa và đường ống",
      paragraphs: [
        "Tập đoàn có năng lực tổng thầu cấp II về lắp đặt cơ điện và thi công công trình hóa dầu, đồng thời có năng lực chuyên ngành chống ăn mòn và bảo ôn. Phạm vi hoạt động bao gồm xây dựng bồn cầu, bồn mái nổi và hệ thống đường ống công nghệ. Các dự án tiêu biểu gồm khu bồn Mercuria Dongjiakou, khu bồn Weifang và Guangrao, kho thương mại Dongjiakou, đường ống hóa dầu Shenghong Liên Vân Cảng và đường ống Chambroad Lanshan, Nhật Chiếu.",
      ],
    },
    "steel-structure-engineering": {
      title: "Công trình kết cấu thép",
      paragraphs: [
        "Phạm vi hoạt động gồm kết cấu thép hành lang ống, cầu dẫn thép, kết cấu thép băng tải ống và băng tải thường, kết cấu thép phụ trợ cầu cảng và kết cấu thép thiết bị.",
        "Các dự án tiêu biểu gồm hành lang ống thép giai đoạn II bến dầu thô khu cảng phía Tây Yên Đài, khu khai thác hàng lỏng Cảng Tân Châu, khu bồn phụ trợ bến hàng lỏng 20.000/5.000 tấn tại trung tâm khu cảng Lanshan, giai đoạn I hành lang ống dầu khí công cộng Lanshan, cầu dẫn thép 300.000 tấn tại bến hóa chất lỏng Lanshan, cùng các hành lang ống thép Asia Symbol RB11R và PM14 TG4.",
      ],
    },
    "tank-maintenance": {
      title: "Vệ sinh, chống ăn mòn và bảo trì bồn chứa",
      paragraphs: [
        "Công việc tuân thủ các quy chuẩn, tiêu chuẩn và yêu cầu vận hành quốc gia hoặc ngành hóa dầu đối với vệ sinh cơ giới, chống ăn mòn và bảo trì bồn dầu. Sau khi vệ sinh, bồn không còn nước và cặn; lớp phủ chống ăn mòn nhẵn, đồng đều, không phồng rộp, chảy sơn hay bỏ sót. Thử thủy lực được thực hiện ở độ cao tiêu chuẩn 17,5 m trong 48 giờ và công trình hoàn thành đáp ứng tiêu chuẩn nghiệm thu quốc gia.",
      ],
    },
  },
  zh: {
    "tank-piping-installation": {
      title: "储罐及管道安装",
      paragraphs: [
        "拥有机电安装、石油化工工程施工总承包二级资质、防腐保温工程专业承包企业资质，业务涵盖球罐、浮顶罐等储罐及工艺管道建设，先后承建董家口摩科瑞库区、潍坊罐区、广饶罐区、董家口商储库、连云港盛虹石化管道、日照岚山京博管道等系列工程项目。",
      ],
    },
    "steel-structure-engineering": {
      title: "钢结构工程",
      paragraphs: [
        "业务范围涵盖管廊钢结构、钢引桥、管带机钢结构、皮带机钢结构、码头配套钢结构、设备钢结构等。",
        "先后承建了烟台港西港区原油码头二期工程钢结构管廊、滨州港海港港区液体散货作业区工程钢结构管廊、日照港岚山港区中区2万吨/5千吨级液体散货码头配套罐区管廊工程、岚山油气公共管廊项目一期工程、岚山液体化工码头30万吨钢引桥工程、亚太森博浆纸有限公司RB11R项目钢结构管廊工程、亚太森博浆纸有限公司PM14 TG4段管廊钢结构等系列工程项目。",
      ],
    },
    "tank-maintenance": {
      title: "储罐清洗、防腐、维修",
      paragraphs: [
        "按照国家或者石化行业相应的石油储罐机械化清洗技术、防腐技术、维修技术规范、标准、作业要求执行，清洗后罐内达到无水、无渣，防腐后达到涂层外观光滑均匀，无气泡、无流淌、无涂漏，上水试验标准高度为十七点五米，静压保持四十八小时，单位工程合格率100%，符合国家验收标准。",
      ],
    },
  },
};

const localeCopy: Record<
  AppLocale,
  Omit<LiquefiedOilHandlingContent, "sections">
> = {
  en: {
    title: "Liquefied oil handling systems",
    description: "Integrated liquefied-oil storage, transfer, piping and maintenance solutions from Shandong Port Equipment Group.",
    productsLabel: "Products & Solutions",
    intro: "Provide a full range of customized products such as oil-arm installation, boarding bridges, storage tanks, loading systems, pipelines and pump rooms, with optional emergency release, explosion protection, intelligent temperature control, intelligent lighting and other functions configured to demand.",
    previousLabel: "Previous image",
    nextLabel: "Next image",
    galleryLabel: "Product gallery",
  },
  vi: {
    title: "Hệ thống xếp dỡ dầu hóa lỏng",
    description: "Giải pháp tích hợp lưu trữ, trung chuyển, đường ống và bảo trì dầu hóa lỏng của Tập đoàn Thiết bị Cảng Sơn Đông.",
    productsLabel: "Sản phẩm & Giải pháp",
    intro: "Cung cấp đầy đủ các sản phẩm tùy chỉnh gồm cần xuất nhập dầu, cầu lên tàu, bồn chứa, hệ thống xuất hàng, đường ống và trạm bơm; đồng thời có thể tích hợp theo nhu cầu chức năng ngắt khẩn cấp, chống cháy nổ an toàn, điều khiển nhiệt độ thông minh, chiếu sáng thông minh và các chức năng khác.",
    previousLabel: "Ảnh trước",
    nextLabel: "Ảnh tiếp theo",
    galleryLabel: "Thư viện sản phẩm",
  },
  zh: {
    title: "液化油品装卸系统解决方案",
    description: "山东港口装备集团液化油品储运、管道及维护一体化解决方案。",
    productsLabel: "产品与解决方案",
    intro: "提供输油臂安装、登船桥、储罐、装车系统、管道、泵房等全系列定制产品，并根据需求配套紧急脱离、安全防爆、智能温控及智慧照明等功能。",
    previousLabel: "上一张图片",
    nextLabel: "下一张图片",
    galleryLabel: "产品图片",
  },
};

const sectionOrder: readonly LiquefiedOilSectionId[] = [
  "tank-piping-installation",
  "steel-structure-engineering",
  "tank-maintenance",
];

export function getLiquefiedOilHandlingContent(
  locale: AppLocale,
): LiquefiedOilHandlingContent {
  return {
    ...localeCopy[locale],
    sections: sectionOrder.map((id) => ({
      id,
      ...sectionText[locale][id],
      images: galleryAssets[id].map(({ file, caption }) => ({
        src: `${assetRoot}/${file}`,
        caption: caption[locale],
      })),
    })),
  };
}

export const liquefiedOilOverviewImage =
  "/images/uploads/allimg/20240731/78b9d37e5dd457555b97baa2fc3695a9.jpg";
