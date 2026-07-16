import type { AppLocale } from "@/i18n/routing";

import type { ContainerHandlingGalleryItem } from "./container-handling";

type BreakbulkSectionId = "port-portal-crane" | "gantry-crane" | "steel-structure";

type LocalizedText = Record<AppLocale, string>;

type GalleryAsset = {
  file: string;
  caption: LocalizedText;
};

export type BreakbulkHandlingContent = {
  title: string;
  description: string;
  productsLabel: string;
  intro: string;
  previousLabel: string;
  nextLabel: string;
  galleryLabel: string;
  sections: readonly {
    id: BreakbulkSectionId;
    title: string;
    paragraphs: readonly string[];
    images: readonly ContainerHandlingGalleryItem[];
  }[];
};

const assetRoot = "/images/uploads/allimg/20240531";

function asset(file: string, en: string, vi: string, zh: string): GalleryAsset {
  return { file, caption: { en, vi, zh } };
}

const galleryAssets: Record<BreakbulkSectionId, readonly GalleryAsset[]> = {
  "port-portal-crane": [
    asset("7944e491f330f09056626d8dcc7a61b9_lp.jpg", "Fujian Jiangyin Port - 40T43M portal crane", "Cẩu chân đế 40T43M tại Cảng Giang Âm, Phúc Kiến", "福建江阴港-40T43M门机"),
    asset("7ddbc3f321cf7d5a6abf27139d484492_lp.jpg", "Jiangxi Zhangshugang - 25T25M portal crane", "Cẩu chân đế 25T25M tại Cảng Chương Thụ, Giang Tây", "江西樟树港-25T25M门机"),
    asset("4e555637187070aa673240814bac12e7_lp.jpg", "Jiangsu Yangzhou Port - 40T40M portal crane", "Cẩu chân đế 40T40M tại Cảng Dương Châu, Giang Tô", "江苏扬州港-40T40M门机"),
    asset("63945706d6c79b2703eb303995cea398_lp.jpg", "Russia Vladivostok - 60T45M portal crane", "Cẩu chân đế 60T45M tại Vladivostok, Nga", "俄罗斯海参崴-60T45M门机"),
    asset("2168d86c21587ba4d950b98a84ac3b8b_lp.jpg", "Jiangsu Zhenjiang Port - 40T40M portal crane", "Cẩu chân đế 40T40M tại Cảng Trấn Giang, Giang Tô", "江苏镇江港-40T40M门机"),
    asset("3342a75ed56be700aec700fff1351606.gif", "Automatic portal crane", "Cẩu chân đế tự động", "自动化门机"),
    asset("08aa27ea475dcbbaf51687216dc1e48d_lp.jpg", "Qingdao Port Datang - 40T40M portal crane", "Cẩu chân đế 40T40M tại Đại Đường, Cảng Thanh Đảo", "青岛港大唐-40T40M门机"),
    asset("33761b62910b20238320256ca3098837_lp.jpg", "Qingdao Port Dongfen - 40T40M portal crane", "Cẩu chân đế 40T40M tại Dongfen, Cảng Thanh Đảo", "青岛港董分-40T40M门机"),
    asset("64bbdad5c0ab1eba2f9419732c40142d_lp.jpg", "Qingdao Port Dongjiakou Huaneng - 40T40M portal crane", "Cẩu chân đế 40T40M tại Huaneng Dongjiakou, Cảng Thanh Đảo", "青岛港董家口华能-40T40M门机"),
    asset("b22a26a2b3b55c9d3253aa3d7a268974_lp.jpg", "Qingdao Port Xilian - 40T43M portal crane", "Cẩu chân đế 40T43M tại Xilian, Cảng Thanh Đảo", "青岛港西联-40T43M门机"),
    asset("0fc117591f1df320b564b18807e31aad_lp.jpg", "Qingdao Port Xilian - 40T43M portal crane", "Cẩu chân đế 40T43M tại Xilian, Cảng Thanh Đảo", "青岛港西联-40T43M门机"),
    asset("8e39b6891662d820106816e77ee18d2f_lp.jpg", "Tianjin Yuanhang - 40T45M portal crane", "Cẩu chân đế 40T45M tại Yuanhang, Thiên Tân", "天津远航-40T45M门机"),
    asset("82637bb82632b997eec8a832ef8ba69a_lp.jpg", "Tianjin Coal Terminal - 40T45M portal crane", "Cẩu chân đế 40T45M tại Bến than Thiên Tân", "天津煤码头-40T45M门机"),
    asset("c6edad351aec31e5bdcc170b04d6a220_lp.jpg", "Tianjin Port - 25T35M portal crane", "Cẩu chân đế 25T35M tại Cảng Thiên Tân", "天津港-25T35M门机"),
  ],
  "gantry-crane": [
    asset("0d7a8a107a03cd0ce3d8189f9f8dba37.gif", "Automated rail-mounted gantry crane", "Cẩu giàn chạy ray tự động", "自动化轨道吊"),
    asset("769ca4adfaf9512c434455603c9f35d3_lp.jpg", "Qingdao Port QQCTN Phase III - 41T automated rail crane", "Cẩu ray tự động 41T giai đoạn III tại Cảng Thanh Đảo QQCTN", "青岛港QQCTN三期-41T自动化轨道吊"),
    asset("8fdcbe112f31d9712ac1cae3c0a462a0_lp.jpg", "Qingdao Port QQCTN Phase III - 41T automated rail crane 2", "Cẩu ray tự động 41T giai đoạn III số 2 tại Cảng Thanh Đảo QQCTN", "青岛港QQCTN三期-41T自动化轨道吊2"),
    asset("e3838acda191b7b9dea00042c67fb4b1_lp.jpg", "Qingdao Port QQCTU - 41T rail crane", "Cẩu ray 41T tại Cảng Thanh Đảo QQCTU", "青岛港QQCTU-41T轨道吊"),
    asset("af3cebb2d4d191de356e757b2731066e_lp.jpg", "Qingdao Port QQCTN Phase II - 41T automated rail crane", "Cẩu ray tự động 41T giai đoạn II tại Cảng Thanh Đảo QQCTN", "青岛港QQCTN二期-41T自动化轨道吊"),
    asset("d4beebbf207e05fa3a32319045e910f2_lp.jpg", "Yantai Longkou Port - 40.5T rail crane", "Cẩu ray 40,5T tại Cảng Long Khẩu, Yên Đài", "烟台龙口港-40.5T轨道吊"),
    asset("41c1500fd1bd988f5f046019aee9da8e_lp.jpg", "Qingdao Port QQCTN Phase I - 41T automated rail crane", "Cẩu ray tự động 41T giai đoạn I tại Cảng Thanh Đảo QQCTN", "青岛港QQCTN一期-41T自动化轨道吊"),
  ],
  "steel-structure": [
    asset("4cd40209849460e941ec198d4d918187_lp.jpg", "Yantai Hyundai Motor R&D Center project", "Dự án Trung tâm R&D Hyundai Motor tại Yên Đài", "烟台市·现代汽车研发中心项目"),
    asset("93e60d66c29c4debfab196c046737ea2_lp.jpg", "Qingdao Haitian Hotel super high-rise steel structure project", "Dự án kết cấu thép siêu cao tầng Khách sạn Haitian Thanh Đảo", "青岛市·海天大酒店超高层钢结构项目"),
    asset("9920b2461fe4d84efa328b3e686b17bc_lp.jpg", "Rizhao Ocean Park steel structure project", "Dự án kết cấu thép Công viên Đại dương Nhật Chiếu", "日照市·海洋公园钢结构工程"),
    asset("333e9b0ac19be18cd7e82fc39d62d82e_lp.jpg", "Qingdao Goertek Business Center steel structure project", "Dự án kết cấu thép Trung tâm Thương mại Goertek Thanh Đảo", "青岛市·歌尔商务中心钢结构项目"),
    asset("5aa6cfd7c784ba03c6c7c9b4ebc54ce0_lp.jpg", "Rizhao Port Shijiu breakbulk warehouse project", "Dự án kho hàng bách hóa khu cảng Shijiu, Cảng Nhật Chiếu", "日照港·日照港石臼港区件杂货库工程"),
    asset("c687c72dbb1a3e6f8b901ac025df3c5e_lp.jpg", "Jinan Distribution Center steel structure project", "Dự án kết cấu thép Trung tâm Phân phối Tế Nam", "济南市·济南分拨中心项目钢结构工程"),
    asset("46cfb8744bb308eb4c3225b7603f7203_lp.jpg", "Rizhao Culture Expo Center project", "Dự án Trung tâm Triển lãm Văn hóa Nhật Chiếu", "日照市·文化博览中心项目"),
    asset("c526bfe0249e6d36b5f99e7ad2107d36_lp.jpg", "Rizhao Culture Expo Center project", "Dự án Trung tâm Triển lãm Văn hóa Nhật Chiếu", "日照市·文化博览中心项目"),
    asset("4ecc50297351f6226561325c926d4f8e_lp.jpg", "Rizhao Ocean Park steel structure project", "Dự án kết cấu thép Công viên Đại dương Nhật Chiếu", "日照市·海洋公园钢结构工程"),
    asset("61a4d2a9a98e1e8dcf4cd85184e20d3f_lp.jpg", "Shanhaitian Sunshine Coast greenway floating bridge", "Cầu nổi đường xanh Bờ biển Ánh Dương tại khu nghỉ dưỡng Shanhaitian", "日照市·山海天阳光海岸绿道飘桥"),
    asset("e5f07e5c298bc7e8af09fd74a7939abc_lp.jpg", "Wulian Huangyachuan floating bridge", "Cầu nổi Huangyachuan tại Wulian", "日照市·五莲黄崖川飘桥"),
    asset("f6df6f0db6955709b2ae0eb7b2dd1893_lp.jpg", "Rizhao Lanshan District Government restaurant project", "Dự án nhà ăn Chính quyền quận Lanshan, Nhật Chiếu", "日照市·岚山区政府餐厅项目"),
  ],
};

const sectionText: Record<
  AppLocale,
  Record<BreakbulkSectionId, { title: string; paragraphs: readonly string[] }>
> = {
  en: {
    "port-portal-crane": {
      title: "Port portal crane",
      paragraphs: [
        "With an A-level production license, double four-link anti-sway technology is combined with physical and electronic anti-sway systems to provide precise control and high safety for breakbulk cargo handling. Automatic control and 5G remote operation can also be applied to automate, lighten and standardize the equipment, with configurations customized to demand.",
      ],
    },
    "gantry-crane": {
      title: "Gantry crane",
      paragraphs: [
        "(1) The hoisting mechanism adopts a reliable wire-rope winding system.",
        "(2) The trolley drive system can be configured in several forms.",
        "(3) A reliable, purpose-designed anti-sway system is used for breakbulk operating conditions.",
        "(4) Remote and automated operation can be realized.",
        "With an A-level production license covering the manufacture, installation, transformation and maintenance of the full product range, each system can be customized to demand.",
      ],
    },
    "steel-structure": {
      title: "Steel structure building",
      paragraphs: [
        "The group holds special-grade steel structure manufacturing and first-grade professional steel structure construction qualifications. It has passed integrated management system certification, European EN 1090 certification and American AWS process certification.",
        "Its business covers high-standard industrial buildings and supporting facilities, major public facilities, integrated housing, prefabricated steel buildings, spatial and bridge steel structures, equipment structures, and the fabrication and installation of high-rise steel structures.",
        "Completed projects include the Qingdao Haitian Hotel high-rise steel structure, Rizhao Ocean Park, Rizhao Culture Expo Center, the Shanhaitian Sunshine Coast greenway floating bridge and the Wulian Huangyachuan floating bridge.",
      ],
    },
  },
  vi: {
    "port-portal-crane": {
      title: "Cẩu chân đế cảng",
      paragraphs: [
        "Với giấy phép sản xuất cấp A, thiết bị kết hợp công nghệ chống lắc hai bộ bốn thanh liên kết với hệ thống chống lắc vật lý và điện tử, bảo đảm điều khiển chính xác và an toàn cao khi xếp dỡ hàng bách hóa. Thiết bị có thể tích hợp điều khiển tự động và vận hành từ xa 5G để đạt mức tự động hóa, nhẹ hóa và tiêu chuẩn hóa, đồng thời tùy chỉnh theo nhu cầu.",
      ],
    },
    "gantry-crane": {
      title: "Cẩu giàn",
      paragraphs: [
        "(1) Cơ cấu nâng sử dụng hệ thống cuốn cáp thép có độ tin cậy cao.",
        "(2) Hệ truyền động di chuyển xe con có thể được cấu hình theo nhiều hình thức.",
        "(3) Sử dụng hệ thống chống lắc chuyên dụng, tin cậy cho điều kiện khai thác hàng bách hóa.",
        "(4) Có thể vận hành từ xa và tự động hóa.",
        "Với giấy phép sản xuất cấp A bao phủ toàn bộ hoạt động chế tạo, lắp đặt, cải tạo và bảo trì sản phẩm, hệ thống có thể được thiết kế riêng theo nhu cầu.",
      ],
    },
    "steel-structure": {
      title: "Công trình kết cấu thép",
      paragraphs: [
        "Tập đoàn có chứng nhận năng lực đặc biệt về chế tạo kết cấu thép và năng lực thi công chuyên ngành kết cấu thép cấp I; đã đạt chứng nhận hệ thống quản lý tích hợp, chứng nhận EN 1090 của châu Âu và chứng nhận quy trình AWS của Hoa Kỳ.",
        "Phạm vi hoạt động gồm nhà xưởng và hạ tầng phụ trợ tại khu công nghiệp tiêu chuẩn cao, công trình công cộng quy mô lớn, nhà tích hợp, công trình thép lắp ghép, kết cấu không gian, kết cấu cầu, kết cấu thiết bị, cùng hoạt động chế tạo và lắp đặt kết cấu thép cao tầng.",
        "Các dự án tiêu biểu gồm kết cấu thép cao tầng Khách sạn Haitian Thanh Đảo, Công viên Đại dương Nhật Chiếu, Trung tâm Triển lãm Văn hóa Nhật Chiếu, cầu nổi đường xanh Bờ biển Ánh Dương Shanhaitian và cầu nổi Huangyachuan tại Wulian.",
      ],
    },
  },
  zh: {
    "port-portal-crane": {
      title: "港口门座式起重机",
      paragraphs: [
        "具备A级生产许可证，使用双四连杆防摇技术，结合物理防摇、电子防摇技术，实现件杂货运输的精准控制和高安全性保障，还可采用自动化控制技术和5G远程操作，实现设备的自动化、轻量化和标准化，可根据需求量身定制。",
      ],
    },
    "gantry-crane": {
      title: "龙门式起重机",
      paragraphs: [
        "（1）起升机构采用可靠的钢丝绳缠绕系统。",
        "（2）小车运行驱动系统可采用多种形式。",
        "（3）针对件杂货工况使用可靠专用的减摇系统。",
        "（4）可实现远程/自动化操作。",
        "具备A级生产许可证，涵盖全系列产品制造、安装、改造、维修，可根据需求量身定制。",
      ],
    },
    "steel-structure": {
      title: "钢结构建筑",
      paragraphs: [
        "拥有钢结构制造特级资质、钢结构专业施工壹级资质，通过三体系质量认证、欧标EN1090体系认证、美标AWS工艺认证等。",
        "业务范围主要以高标准产业园区厂房及配套、大型公共设施、集成房屋、钢结构装配式建筑和各类空间钢构、桥梁钢构、设备钢构、高层钢构制作、安装为主。",
        "先后承建了青岛海天大酒店高层钢结构项目、日照市海洋公园钢结构、日照市文化博览中心钢结构、日照市山海天阳光海岸绿道飘桥、五莲黄崖川飘桥等工程。",
      ],
    },
  },
};

const localeCopy: Record<
  AppLocale,
  Omit<BreakbulkHandlingContent, "sections">
> = {
  en: {
    title: "Breakbulk handling systems",
    description: "Integrated breakbulk cargo handling and steel structure solutions from Shandong Port Equipment Group.",
    productsLabel: "Products & Solutions",
    intro: "Provide a full range of customized products such as automated port loading and unloading portal cranes, steel structure buildings, automatic rail cranes for general cargo and unmanned container trucks. Functions can be configured to demand, including multifunctional rotary spreaders and hooks, automatic collision avoidance, one-key automatic anchoring, intelligent status management, intelligent lubrication, automatic fire protection, intelligent lightning protection, intelligent gates and intelligent lighting.",
    previousLabel: "Previous image",
    nextLabel: "Next image",
    galleryLabel: "Product gallery",
  },
  vi: {
    title: "Hệ thống xếp dỡ hàng bách hóa",
    description: "Giải pháp tích hợp xếp dỡ hàng bách hóa và kết cấu thép của Tập đoàn Thiết bị Cảng Sơn Đông.",
    productsLabel: "Sản phẩm & Giải pháp",
    intro: "Cung cấp đầy đủ các sản phẩm tùy chỉnh gồm cẩu chân đế xếp dỡ cảng tự động, công trình kết cấu thép, cẩu ray tự động chuyên dụng cho hàng bách hóa và xe vận chuyển container không người lái. Hệ thống có thể tích hợp theo nhu cầu khung nâng hoặc móc quay đa chức năng, chống va chạm tự động, neo tự động một chạm, quản lý trạng thái thông minh, bôi trơn và chữa cháy tự động, chống sét thông minh, cổng kiểm soát và chiếu sáng thông minh.",
    previousLabel: "Ảnh trước",
    nextLabel: "Ảnh tiếp theo",
    galleryLabel: "Thư viện sản phẩm",
  },
  zh: {
    title: "件杂货装卸系统解决方案",
    description: "山东港口装备集团件杂货装卸与钢结构一体化解决方案。",
    productsLabel: "产品与解决方案",
    intro: "提供自动化港口装卸门座起重机、钢结构建筑、件杂货自动化专用轨道吊、无人集卡等全系列定制化产品，并根据需求配套多功能旋转吊具/吊钩、自动防撞、一键自动锚定、智能状态管理系统、智能润滑、自动消防、智能防雷、智慧闸口及智慧照明等功能。",
    previousLabel: "上一张图片",
    nextLabel: "下一张图片",
    galleryLabel: "产品图片",
  },
};

const sectionOrder: readonly BreakbulkSectionId[] = [
  "port-portal-crane",
  "gantry-crane",
  "steel-structure",
];

export function getBreakbulkHandlingContent(
  locale: AppLocale,
): BreakbulkHandlingContent {
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

export const breakbulkOverviewImage =
  "/images/uploads/allimg/20240731/0e6a37023001a0826e8a3d842626d0d4.jpg";
