import type { AppLocale } from "@/i18n/routing";

import type { ContainerHandlingGalleryItem } from "./container-handling";

type GrainSiloSectionId =
  | "air-cushion-conveyor"
  | "screw-ship-unloader"
  | "multi-purpose-portal-crane"
  | "loading-building";

type LocalizedText = Record<AppLocale, string>;

type GalleryAsset = {
  file: string;
  caption: LocalizedText;
};

export type GrainSiloHandlingContent = {
  title: string;
  description: string;
  productsLabel: string;
  intro: string;
  previousLabel: string;
  nextLabel: string;
  galleryLabel: string;
  sections: readonly {
    id: GrainSiloSectionId;
    title: string;
    paragraphs: readonly string[];
    images: readonly ContainerHandlingGalleryItem[];
  }[];
};

const assetRoot = "/images/uploads/allimg/20240531";

function asset(file: string, en: string, vi: string, zh: string): GalleryAsset {
  return { file, caption: { en, vi, zh } };
}

const galleryAssets: Record<GrainSiloSectionId, readonly GalleryAsset[]> = {
  "air-cushion-conveyor": [
    asset("9e1afb5a96012cf5eaa818f316aa345c_lp.jpg", "Dongjiakou granary", "Kho ngũ cốc Dongjiakou", "董家口粮仓"),
    asset("ea2be8105e7657e6147c60fc4feab144_lp.jpg", "Rizhao Port - Lanshan bulk grain", "Hệ thống ngũ cốc rời Lanshan, Cảng Nhật Chiếu", "日照港-岚山散粮"),
    asset("a3f06ee468a711f2c2c2a1e93d0e9f77_lp.jpg", "Rizhao Port - Lanshan bulk grain", "Hệ thống ngũ cốc rời Lanshan, Cảng Nhật Chiếu", "日照港-岚山散粮"),
    asset("74b80eebe4e0d49f974555dcdbd467c4_lp.jpg", "Rizhao Port - Shijiu bulk grain", "Hệ thống ngũ cốc rời Shijiu, Cảng Nhật Chiếu", "日照港-石臼散粮"),
    asset("3d639a30a99badec42bb7ad53d9446ae_lp.jpg", "Rizhao Port - Lanshan bulk grain", "Hệ thống ngũ cốc rời Lanshan, Cảng Nhật Chiếu", "日照港-岚山散粮"),
    asset("93c6f5c7b07d4ca7ee63793f041a476c_lp.jpg", "Rizhao Port - Lanshan bulk grain", "Hệ thống ngũ cốc rời Lanshan, Cảng Nhật Chiếu", "日照港-岚山散粮"),
    asset("69612ced8788f6a0724a044f1faae1cf_lp.jpg", "Rizhao Port - Lanshan bulk grain", "Hệ thống ngũ cốc rời Lanshan, Cảng Nhật Chiếu", "日照港-岚山散粮"),
    asset("fb1cf507211d5fa0efe9197ba3b71880_lp.jpg", "Yantai Port - bulk grain transportation project", "Dự án vận chuyển ngũ cốc rời tại Cảng Yên Đài", "烟台港-散粮输送项目"),
  ],
  "screw-ship-unloader": [
    asset("c499f3e760a34d62c9be24e785be575e_lp.jpg", "Spiral bucket ship-unloader test bench", "Bệ thử máy dỡ tàu gầu xoắn", "螺旋带斗卸船机试验台"),
    asset("7c8c49ae7ab284870f5d274331b1bf3b_lp.jpg", "Spiral bucket ship-unloader test bench", "Bệ thử máy dỡ tàu gầu xoắn", "螺旋带斗卸船机试验台"),
  ],
  "multi-purpose-portal-crane": [
    asset("7944e491f330f09056626d8dcc7a61b9_lp.jpg", "Fujian Jiangyin Port - 40T43M portal crane", "Cẩu chân đế 40T43M tại Cảng Giang Âm, Phúc Kiến", "福建江阴港-40T43M门机"),
    asset("7ddbc3f321cf7d5a6abf27139d484492_lp.jpg", "Jiangxi Zhangshugang - 25T25M portal crane", "Cẩu chân đế 25T25M tại Cảng Chương Thụ, Giang Tây", "江西樟树港-25T25M门机"),
    asset("4e555637187070aa673240814bac12e7_lp.jpg", "Jiangsu Yangzhou Port - 40T40M portal crane", "Cẩu chân đế 40T40M tại Cảng Dương Châu, Giang Tô", "江苏扬州港-40T40M门机"),
    asset("63945706d6c79b2703eb303995cea398_lp.jpg", "Russia Vladivostok - 60T45M portal crane", "Cẩu chân đế 60T45M tại Vladivostok, Nga", "俄罗斯海参崴-60T45M门机"),
    asset("2168d86c21587ba4d950b98a84ac3b8b_lp.jpg", "Jiangsu Zhenjiang Port - 40T40M portal crane", "Cẩu chân đế 40T40M tại Cảng Trấn Giang, Giang Tô", "江苏镇江港-40T40M门机"),
    asset("3342a75ed56be700aec700fff1351606.gif", "Automatic portal crane", "Cẩu chân đế tự động", "自动化门机"),
    asset("08aa27ea475dcbbaf51687216dc1e48d_lp.jpg", "Qingdao Port Datang - 40T40M portal crane", "Cẩu chân đế 40T40M tại Đại Đường, Cảng Thanh Đảo", "青岛港大唐-40T40M门机"),
    asset("33761b62910b20238320256ca3098837_lp.jpg", "Qingdao Port Dongfen - 40T40M portal crane", "Cẩu chân đế 40T40M tại Dongfen, Cảng Thanh Đảo", "青岛港董分-40T40M门机"),
    asset("64bbdad5c0ab1eba2f9419732c40142d_lp.jpg", "Qingdao Port Dongjiakou Huaneng - 40T40M portal crane", "Cẩu chân đế 40T40M tại Huaneng Dongjiakou, Cảng Thanh Đảo", "青岛港董家口华能-40T40M门机"),
    asset("b22a26a2b3b55c9d3253aa3d7a268974_lp.jpg", "Taixing Xinpu Chemical - 25T38M portal crane", "Cẩu chân đế 25T38M tại Hóa chất Xinpu Thái Hưng", "泰兴新浦化学-25T38M门机"),
    asset("0fc117591f1df320b564b18807e31aad_lp.jpg", "Qingdao Port Xilian - 40T43M portal crane", "Cẩu chân đế 40T43M tại Xilian, Cảng Thanh Đảo", "青岛港西联-40T43M门机"),
    asset("8e39b6891662d820106816e77ee18d2f_lp.jpg", "Tianjin Yuanhang - 40T45M portal crane", "Cẩu chân đế 40T45M tại Yuanhang, Thiên Tân", "天津远航-40T45M门机"),
    asset("82637bb82632b997eec8a832ef8ba69a_lp.jpg", "Tianjin Coal Terminal - 40T45M portal crane", "Cẩu chân đế 40T45M tại Bến than Thiên Tân", "天津煤码头-40T45M门机"),
    asset("c6edad351aec31e5bdcc170b04d6a220_lp.jpg", "Tianjin Port - 25T35M portal crane", "Cẩu chân đế 25T35M tại Cảng Thiên Tân", "天津港-25T35M门机"),
  ],
  "loading-building": [
    asset("aa016770df7fd37386e57885128b0070_lp.jpg", "Qingdao Port Dongjiakou North Third Jetty grain silo phase III", "Giai đoạn III silo ngũ cốc và hệ thống phụ trợ tại cầu cảng Bắc số 3 Dongjiakou, Cảng Thanh Đảo", "青岛港董家口港区北三突堤粮食筒仓三期及配套流程工程"),
    asset("58664039af211bbfc91370e58e7babcc_lp.jpg", "Lanshan Port south area bulk-grain system reconstruction and expansion", "Dự án cải tạo, mở rộng hệ thống lưu trữ và vận chuyển ngũ cốc rời khu phía Nam Cảng Lanshan", "日照港岚山港区南作业区散粮储运系统改扩建工程"),
    asset("e5f496261366219037da9bdfef1f08b3_lp.jpg", "Rizhao Port grain base project", "Dự án cơ sở ngũ cốc Cảng Nhật Chiếu", "日照港粮食基地工程"),
    asset("7647c078394f79509f31eaa5c1bd9e00_lp.jpg", "Lanshan Port south area bulk-grain system reconstruction and expansion 2", "Dự án cải tạo, mở rộng hệ thống ngũ cốc rời khu phía Nam Cảng Lanshan 2", "日照港岚山港区南作业区散粮储运系统改扩建工程2"),
    asset("524d5aa542a114243a8dd4517d374ab3_lp.jpg", "Lanshan Port south operation area railway project", "Dự án đường sắt khu khai thác phía Nam Cảng Lanshan", "日照港岚山港区南作业区铁路工程"),
    asset("972d1d611370318caecfa868c680b9dc_lp.jpg", "Rizhao Port grain base project", "Dự án cơ sở ngũ cốc Cảng Nhật Chiếu", "日照港粮食基地工程"),
    asset("9d045f2dbb1cc96ce0f14ca0200639b4_lp.jpg", "Transfer building", "Nhà trung chuyển", "转载楼"),
    asset("43322c09980b131a4b11133bb5fd33a9_lp.jpg", "Lanshan Port south area bulk-grain system reconstruction and expansion", "Dự án cải tạo, mở rộng hệ thống ngũ cốc rời khu phía Nam Cảng Lanshan", "日照港岚山港区南作业区散粮储运系统改扩建工程"),
    asset("15cbef167bb59008d2f76a94f8b0e022_lp.jpg", "Loading building", "Nhà xuất hàng", "装车楼"),
  ],
};

const sectionText: Record<
  AppLocale,
  Record<GrainSiloSectionId, { title: string; paragraphs: readonly string[] }>
> = {
  en: {
    "air-cushion-conveyor": {
      title: "Air cushion belt conveyor",
      paragraphs: [
        "The group can integrate a wide range of grain-conveying equipment, including double-air-cushion and single-roller belt conveyors, bucket elevators, buried scraper conveyors and multi-point discharge belt conveyors. Supporting systems cover power supply and lighting, automatic control, grain-condition monitoring, dust removal and ventilation.",
      ],
    },
    "screw-ship-unloader": {
      title: "Ship unloader with screw bucket",
      paragraphs: [
        "This continuous conveying machine uses a material-lifting head with self-reclaiming capability, or a separate reclaiming and feeding device, to lift bulk material continuously from the ship's hold. Material is discharged onto the boom or frame and transferred to the main shore conveyor system. Configurations can be customized to customer requirements.",
      ],
    },
    "multi-purpose-portal-crane": {
      title: "Multi-purpose portal crane",
      paragraphs: [
        "With an A-level production license, double four-link anti-sway technology is combined with physical and electronic anti-sway systems. Interchangeable container spreaders and hooks provide precise, safe handling of containers and breakbulk cargo. Automatic control and 5G remote operation can also be applied to automate, lighten and standardize the equipment, with configurations customized to demand.",
      ],
    },
    "loading-building": {
      title: "Loading building",
      paragraphs: [
        "The business covers equipment steel structures, steel structures for bulk-grain storage and transportation systems, steel structures for bulk-material conveying systems and steel transfer towers. Projects include phase III of the Dongjiakou North Third Jetty grain silo and supporting process system, the Lanshan Port south operation area railway, the steel stair project for the Lanshan south bulk-grain system reconstruction and expansion, and expansion of the bulk-grain train loading station in the west operation area of Rizhao Port's Shijiu Port Area.",
      ],
    },
  },
  vi: {
    "air-cushion-conveyor": {
      title: "Băng tải đệm khí",
      paragraphs: [
        "Tập đoàn có khả năng tích hợp nhiều loại thiết bị vận chuyển ngũ cốc như băng tải đệm khí đôi, băng tải con lăn đơn, gầu tải, băng tải cào chôn kín và băng tải dỡ liệu nhiều điểm. Hệ thống phụ trợ bao gồm cấp điện và chiếu sáng, điều khiển tự động, giám sát tình trạng ngũ cốc, hút bụi và thông gió.",
      ],
    },
    "screw-ship-unloader": {
      title: "Máy dỡ tàu gầu xoắn",
      paragraphs: [
        "Thiết bị vận chuyển liên tục sử dụng đầu nâng vật liệu có khả năng tự lấy liệu, hoặc kết hợp bộ phận lấy và cấp liệu riêng, để liên tục đưa vật liệu rời ra khỏi khoang tàu. Vật liệu sau đó được xả lên cần hoặc khung máy và chuyển tới hệ thống băng tải chính trên bờ. Cấu hình có thể tùy chỉnh theo nhu cầu khách hàng.",
      ],
    },
    "multi-purpose-portal-crane": {
      title: "Cẩu chân đế đa dụng",
      paragraphs: [
        "Với giấy phép sản xuất cấp A, thiết bị kết hợp công nghệ chống lắc hai bộ bốn thanh liên kết với hệ thống chống lắc vật lý và điện tử. Khung nâng container và móc cẩu có thể thay đổi để xếp dỡ container và hàng bách hóa chính xác, an toàn. Thiết bị có thể tích hợp điều khiển tự động và vận hành từ xa 5G để đạt mức tự động hóa, nhẹ hóa và tiêu chuẩn hóa, đồng thời tùy chỉnh theo nhu cầu.",
      ],
    },
    "loading-building": {
      title: "Nhà xuất hàng",
      paragraphs: [
        "Phạm vi hoạt động gồm kết cấu thép thiết bị, kết cấu thép hệ thống lưu trữ và vận chuyển ngũ cốc rời, kết cấu thép hệ thống vận chuyển vật liệu rời và tháp trung chuyển thép. Các dự án tiêu biểu gồm giai đoạn III silo ngũ cốc và hệ thống phụ trợ tại cầu cảng Bắc số 3 Dongjiakou, tuyến đường sắt khu khai thác phía Nam Cảng Lanshan, hạng mục thang thép thuộc dự án cải tạo hệ thống ngũ cốc rời Lanshan và dự án mở rộng ga xếp ngũ cốc rời lên tàu hỏa tại khu phía Tây cảng Shijiu, Cảng Nhật Chiếu.",
      ],
    },
  },
  zh: {
    "air-cushion-conveyor": {
      title: "气垫带式输送机",
      paragraphs: [
        "拥有各类双气垫、单托辊皮带机、斗式提升机、埋刮板输送机、多点卸料皮带机等各类粮食输送设备集成能力，并配套实施供电照明、自动控制、粮情检测、除尘通风等系统。",
      ],
    },
    "screw-ship-unloader": {
      title: "螺旋带斗卸船机",
      paragraphs: [
        "利用连续输送机械制成能提升散粒物料的机头，或兼有自行取料能力，或配以取料、喂料装置，将散粒物料连续不断地提出船舱，然后卸载到臂架或机架并输送至岸边主输送机系统，可根据客户需求量身定制。",
      ],
    },
    "multi-purpose-portal-crane": {
      title: "多用途门座式起重机",
      paragraphs: [
        "具备A级生产许可证，使用双四连杆防摇技术，糅合物理防摇、电子防摇技术，可以更换集装箱吊具、吊钩实现集装箱、件杂货运输的精准控制和高安全性保证，还可采用自动化控制技术和5G远程操作，实现设备的自动化、轻量化和标准化，可根据需求量身定制。",
      ],
    },
    "loading-building": {
      title: "装车楼",
      paragraphs: [
        "业务范围主要包括设备钢结构、散粮储运系统钢结构、散料输送系统钢结构、钢结构转接塔等。先后承建了青岛港董家口港区北三突堤粮食筒仓三期及配套流程工程、日照港岚山港区南作业区铁路工程、日照港岚山港区南作业区散粮储运系统改扩建工程钢梯工程、日照港石臼港区西作业区散粮储运系统散粮火车装车站扩建工程等系列工程项目。",
      ],
    },
  },
};

const localeCopy: Record<
  AppLocale,
  Omit<GrainSiloHandlingContent, "sections">
> = {
  en: {
    title: "Grain silo loading and unloading system",
    description: "Integrated grain silo loading, unloading, conveying and storage solutions from Shandong Port Equipment Group.",
    productsLabel: "Products & Solutions",
    intro: "Provide a full range of customized products such as automated screw ship unloaders, automated port loading and unloading portal cranes, hoppers, silos, filling and packing buildings, loading buildings and supporting equipment, air-cushion belt conveyors, belt conveyors, round-pipe belt conveyors and unmanned container trucks. Optional functions include dust suppression and explosion prevention, intelligent anti-blocking, intelligent status management, intelligent lubrication, automatic fire protection, unmanned inspection and intelligent lighting.",
    previousLabel: "Previous image",
    nextLabel: "Next image",
    galleryLabel: "Product gallery",
  },
  vi: {
    title: "Hệ thống bốc dỡ silo ngũ cốc",
    description: "Giải pháp tích hợp bốc dỡ, vận chuyển và lưu trữ ngũ cốc bằng silo của Tập đoàn Thiết bị Cảng Sơn Đông.",
    productsLabel: "Sản phẩm & Giải pháp",
    intro: "Cung cấp đầy đủ các sản phẩm tùy chỉnh gồm máy dỡ tàu gầu xoắn tự động, cẩu chân đế xếp dỡ cảng tự động, phễu, silo, nhà đóng bao, nhà xuất hàng và thiết bị phụ trợ, băng tải đệm khí, băng tải thường, băng tải ống tròn và xe vận chuyển container không người lái. Các chức năng tùy chọn gồm khử bụi và chống nổ, chống tắc nghẽn thông minh, quản lý trạng thái, bôi trơn thông minh, chữa cháy tự động, kiểm tra không người lái và chiếu sáng thông minh.",
    previousLabel: "Ảnh trước",
    nextLabel: "Ảnh tiếp theo",
    galleryLabel: "Thư viện sản phẩm",
  },
  zh: {
    title: "粮食筒仓装卸系统解决方案",
    description: "山东港口装备集团粮食筒仓装卸、输送与储存一体化解决方案。",
    productsLabel: "产品与解决方案",
    intro: "提供自动化螺旋卸船机、自动化港口装卸门座起重机、料斗、筒仓、灌包楼/装车楼及配套设备、气垫皮带机、皮带输送机、圆管带式输送机、无人集卡等全系列定制产品，并根据需求配套抑尘防爆、智能防堵料、智能状态管理系统、智能润滑、自动消防、无人巡检及智慧照明等功能。",
    previousLabel: "上一张图片",
    nextLabel: "下一张图片",
    galleryLabel: "产品图片",
  },
};

const sectionOrder: readonly GrainSiloSectionId[] = [
  "air-cushion-conveyor",
  "screw-ship-unloader",
  "multi-purpose-portal-crane",
  "loading-building",
];

export function getGrainSiloHandlingContent(
  locale: AppLocale,
): GrainSiloHandlingContent {
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

export const grainSiloOverviewImage =
  "/images/uploads/allimg/20240731/156b1db6e97580239360d630872c13ef.jpg";
