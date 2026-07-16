import type { AppLocale } from "@/i18n/routing";

import type { ContainerHandlingGalleryItem } from "./container-handling";

type ShipbuildingRepairSectionId =
  | "multi-purpose-tugboat"
  | "container-vessel"
  | "multi-purpose-transport-vessels"
  | "engineering-special-vessels"
  | "deep-sea-intelligent-cages"
  | "offshore-platforms"
  | "installation-portal-cranes"
  | "shipbuilding-gantry-cranes";

type LocalizedText = Record<AppLocale, string>;

type GalleryAsset = {
  file: string;
  caption: LocalizedText;
};

export type ShipbuildingRepairContent = {
  title: string;
  description: string;
  productsLabel: string;
  intro: string;
  previousLabel: string;
  nextLabel: string;
  galleryLabel: string;
  sections: readonly {
    id: ShipbuildingRepairSectionId;
    title: string;
    paragraphs: readonly string[];
    images: readonly ContainerHandlingGalleryItem[];
  }[];
};

const assetRoot = "/images/uploads/allimg/20240531";

function asset(file: string, en: string, vi: string, zh: string): GalleryAsset {
  return {
    file: `${assetRoot}/${file}_lp.jpg`,
    caption: { en, vi, zh },
  };
}

const galleryAssets: Record<
  ShipbuildingRepairSectionId,
  readonly GalleryAsset[]
> = {
  "multi-purpose-tugboat": [
    asset("84518d2b98df187758f69295c5cb4599", "Qingdao Port - Asia 19", "Cảng Thanh Đảo - Tàu Asia 19", "青岛港-亚洲十九号"),
    asset("99e3d509dd7dcc28b2ee773f982c03a0", "Rizhao Port - 130 m³ oil spill recovery vessel", "Cảng Nhật Chiếu - Tàu thu gom dầu tràn 130 m³", "日照港-130方溢油回收船"),
    asset("582230bb3efc24e4b109b9442e42951a", "Rizhao Port - 500T oil spill emergency response vessel", "Cảng Nhật Chiếu - Tàu ứng cứu sự cố tràn dầu 500T", "日照港-500T溢油应急处置船"),
    asset("f1fc284b26fc6d5b517f3fde0ce8f09b", "Singapore - 70-ton bollard-pull azimuth tug", "Singapore - Tàu kéo phương vị lực kéo 70 tấn", "新加坡-70吨拖力全回转拖轮"),
    asset("e9f9dd56ca811d98e1d650c0327efcc2", "Rizhao Port - Rigang Tug 27", "Cảng Nhật Chiếu - Tàu kéo Rigang 27", "日照港-日港拖27"),
    asset("f79a9d7c5b72d34cbcb4672f13a985f8", "Rizhao Port - Rigang Tug 1", "Cảng Nhật Chiếu - Tàu kéo Rigang 1", "日照港-日港拖1"),
    asset("fb7160fc059747130a1984f529ea053c", "Rizhao Port - Langang Tug 15", "Cảng Nhật Chiếu - Tàu kéo Langang 15", "日照港-岚港拖15"),
    asset("9ee0381f841f81ad264277cf948c36ff", "Rizhao Port - Rigang Tug 1 and 2", "Cảng Nhật Chiếu - Tàu kéo Rigang 1 và 2", "日照港-日港拖1、2"),
    asset("7ebc78489ad4512869ad2e360a7b1d60", "Yantai Port - Yangang Tug 28", "Cảng Yên Đài - Tàu kéo Yangang 28", "烟台港-烟港拖28"),
    asset("1dc73ce798c49d6cfe2088bee68e6904", "Yulong Port - Yulong Tug 1 and 2", "Cảng Yulong - Tàu kéo Yulong 1 và 2", "裕龙港务-裕龙拖1、2"),
  ],
  "container-vessel": [
    asset("bf7c0c1fad87bf923af3e1e0cebecfb9", "Shandong Port Shipping Group - Shangang Qingdao", "Tập đoàn Vận tải biển Cảng Sơn Đông - Shangang Qingdao", "山东港口航运集团-山港青岛号"),
    asset("3517244fea76e98b6bcc7b6f4e8f6e6f", "Shandong Port Shipping Group - Shangang Rizhao", "Tập đoàn Vận tải biển Cảng Sơn Đông - Shangang Rizhao", "山东港口航运集团-山港日照号"),
    asset("37ecc8fb165716890942c1c2399d4008", "Shandong Port Shipping Group - Shangang Rizhao", "Tập đoàn Vận tải biển Cảng Sơn Đông - Shangang Rizhao", "山东港口航运集团-山港日照号"),
  ],
  "multi-purpose-transport-vessels": [
    asset("eb316ec46610cf1601ea59e63f5f8caa", "Rizhao Port - Rigang Barge", "Cảng Nhật Chiếu - Sà lan Rigang", "日照港-日港驳"),
    asset("b9b5d337c031d391267327c1ea9e88eb", "Guanghui Oil - 4,100 DWT oil vessel", "Guanghui Oil - Tàu chở dầu 4.100 DWT", "光汇石油-4100DWT油船"),
    asset("524b2af4c4208a001bb93437e0d70d42", "CCCC First Harbor Engineering - 6,000-ton self-propelled deck vessel", "CCCC First Harbor Engineering - Tàu boong tự hành 6.000 tấn", "中交一航二-6000吨自航甲板船"),
    asset("90131d2ddc59b7b9c766df65d654897b", "Indonesia - 5,900 m³ CPO palm-oil barge", "Indonesia - Sà lan dầu cọ CPO 5.900 m³", "印尼-5900m³CPO棕榈油驳船"),
    asset("8da932071e6d7cf9ae8bf41e65279f03", "Hong Kong - 7,400 DWT multi-purpose vessel", "Hồng Kông - Tàu đa dụng 7.400 DWT", "香港-7400DWT多用途船"),
  ],
  "engineering-special-vessels": [
    asset("85e01cde70848d0a2cb8b2efbe885905", "Electric-propulsion large backhoe dredger", "Tàu nạo vét gầu nghịch cỡ lớn chạy điện", "电力推进大型反铲挖泥船"),
    asset("5939cd203328b7de9f930fc858b559b3", "Singapore - 59 m offshore-platform service vessel", "Singapore - Tàu dịch vụ giàn khoan ngoài khơi dài 59 m", "新加坡59米海上平台服务船"),
    asset("e9e682318cfff0de32018c04e5a8f475", "Leveling dredger", "Tàu nạo vét san phẳng", "整平挖泥船"),
    asset("11ec80e8b53c35d30bbb9f2cee70ee9e", "Fishery administration and law-enforcement vessel", "Tàu kiểm ngư và thực thi pháp luật", "渔政执法船"),
    asset("74ae7005ebbe700765de63705da9beac", "Aquaculture vessel Lulan Yuyang 61699", "Tàu nuôi trồng thủy sản Lulan Yuyang 61699", "养殖工船鲁岚渔养61699"),
  ],
  "deep-sea-intelligent-cages": [
    asset("a7b467d6c14a061229bbaf24d69c2cde", "Deep-sea aquaculture cage", "Lồng nuôi trồng thủy sản biển sâu", "深远海养殖网箱"),
    asset("9626c0c49887233f5ab582bde8a5c794", "Deep-sea aquaculture cage", "Lồng nuôi trồng thủy sản biển sâu", "深远海养殖网箱"),
  ],
  "offshore-platforms": [
    asset("433b17eaab3a18ebc5d9bcd71e7e8d14", "Column-stabilized marine-ranching platform", "Giàn nuôi biển dạng cột ổn định", "柱稳式海洋牧场平台"),
    asset("ea73225e6ec4fecdd3c967574813e98b", "Pastoral leisure platform at sea", "Nền tảng nghỉ dưỡng Hải Thượng Mục Ca", "海上牧歌休闲平台"),
  ],
  "installation-portal-cranes": [
    asset("c3b3b6eaef4c30eedfbff7f79184d98c", "Tianjin BOMESC - 50T105M portal crane", "Tianjin BOMESC - Cẩu chân đế 50T105M", "天津博迈科-50T105M门机"),
    asset("13c0e01425de6cd053bf63c8c17aa0f2", "Tianjin BOMESC - 50T105M portal crane", "Tianjin BOMESC - Cẩu chân đế 50T105M", "天津博迈科-50T105M门机"),
    asset("37265de051ded7a6933b7422d674f1a5", "Zhenjiang - 50T70M portal crane", "Trấn Giang - Cẩu chân đế 50T70M", "镇江-50T70M门机"),
  ],
  "shipbuilding-gantry-cranes": [
    asset("ea07912592538cc7d6f61603e2c67467", "Dalian COSCO - 200T gantry crane", "Đại Liên COSCO - Cẩu giàn 200T", "大连中远-200T龙门吊"),
  ],
};

const sectionText: Record<
  AppLocale,
  Record<
    ShipbuildingRepairSectionId,
    { title: string; paragraphs: readonly string[] }
  >
> = {
  en: {
    "multi-purpose-tugboat": {
      title: "Multi-purpose tugboat",
      paragraphs: [
        "The business covers multi-functional new-energy tugboats for port operations, offshore engineering, firefighting and oil-spill recovery.",
        "The 5,000 HP Robert tug is the first Robert-type tugboat in Shandong Province. The 6,000 HP azimuth oil-spill recovery tug is China's first azimuth tugboat with integrated oil-spill recovery and won the Rizhao Science and Technology Progress Award.",
        "The 8,000 HP azimuth tug is an offshore Z-drive tug and currently China's highest-powered multi-purpose port tug, capable of both port pushing and offshore engineering construction. The 70-ton bollard-pull azimuth tug was developed for European customers and meets advanced international standards for harbor towing and external firefighting.",
      ],
    },
    "container-vessel": {
      title: "Container vessel",
      paragraphs: [
        "(1) Outstanding efficiency: a low-voltage shipborne shore-power system enables zero emissions while berthed.",
        "(2) Advanced design: the vessel combines container-ship and general dry-cargo functions, carrying standard and refrigerated containers as well as mixed refrigerated and dangerous-goods cargo.",
        "(3) Intelligent upgrades include 5G, Wi-Fi, enhanced lookout, AI behavior recognition, engine-room patrol check-in, ship energy-efficiency and navigation analysis, driving-assistance decisions and autonomous navigation.",
      ],
    },
    "multi-purpose-transport-vessels": {
      title: "Multi-purpose transport vessels",
      paragraphs: [
        "The business covers product tankers, bulk carriers and self-propelled deck barges.",
        "Indonesia's new-energy bio-oil barge can transport Class II and III chemical liquid cargo, uses an environmentally friendly design with photovoltaic power, and adopts modular block construction. The 6,000-ton self-propelled deck vessel uses twin engines and twin ducted fixed-pitch propellers, with a broad cargo deck and a bow ramp for 60-ton heavy vehicles.",
        "The 7,400 DWT multi-purpose vessel combines excellent design and economic performance with efficient loading and operation, while meeting Tier III emissions and EEDI Phase 2 requirements.",
      ],
    },
    "engineering-special-vessels": {
      title: "Engineering & special vessels",
      paragraphs: [
        "The business covers dredgers, offshore-platform service vessels and aquaculture vessels.",
        "The leveling dredger is the first self-elevating work vessel in China and abroad to combine underwater rubble-foundation leveling with dredging. It holds a national invention patent and won the second prize for scientific and technological progress from the China Ports & Harbors Association.",
        "The electric-propulsion large backhoe dredger has China's largest excavator capacity and deepest dredging depth. It combines self-propulsion with trolley-assisted positioning and was recognized as a first-of-its-kind technical product in Shandong Province in 2021.",
      ],
    },
    "deep-sea-intelligent-cages": {
      title: "High-end intelligent cages in the deep sea",
      paragraphs: [
        "(1) The modular fully enclosed double-layer net system uses small net panels and low-creep netting, reducing deformation and improving safety.",
        "(2) The automatic fish-feed system supports both semi-submersible and fully submersible seabed aquaculture.",
        "(3) A comprehensive cage-security system combines video monitoring with intelligent image recognition to warn of large aggressive animals, achieving prediction accuracy above 90%.",
        "(4) An optoelectronic integrated-chip multi-parameter sensor enables long-term, low-cost and accurate marine-ranch monitoring.",
      ],
    },
    "offshore-platforms": {
      title: "Offshore platforms",
      paragraphs: [
        "The business covers floating docks, marine leisure platforms and marine-ranching platforms.",
        "The Sea Pastoral leisure platform is China's largest leisure platform, with fishing and rest areas, a 3D marine restaurant, a marine-science area and a beer square. The marine-ranching platform can serve as the support facility and control center for intelligent deep-sea cages while integrating aquaculture management, fishery experiences, ecological tourism, environmental monitoring and science education.",
      ],
    },
    "installation-portal-cranes": {
      title: "Installation portal cranes",
      paragraphs: [
        "With an A-level production license, the business supplies a full range of portal cranes for shipbuilding and repair. The products withstand harsh working conditions and high utilization rates, use proprietary machining technology for the upper and lower flange surfaces of slewing bearings, and can be customized to demand.",
      ],
    },
    "shipbuilding-gantry-cranes": {
      title: "Shipbuilding gantry cranes",
      paragraphs: [
        "With an A-level production license, the business covers the manufacture, installation, transformation and maintenance of a full range of shipbuilding gantry cranes, customized to customer requirements.",
      ],
    },
  },
  vi: {
    "multi-purpose-tugboat": {
      title: "Tàu kéo đa năng",
      paragraphs: [
        "Phạm vi kinh doanh bao gồm tàu kéo đa chức năng sử dụng năng lượng mới cho khai thác cảng, công trình biển, chữa cháy và thu gom dầu tràn.",
        "Tàu kéo Robert 5.000 HP là tàu đầu tiên thuộc dòng Robert tại tỉnh Sơn Đông. Tàu kéo phương vị thu gom dầu tràn 6.000 HP là tàu đầu tiên tại Trung Quốc tích hợp khả năng thu gom dầu tràn và đã giành Giải thưởng Tiến bộ Khoa học Công nghệ Nhật Chiếu.",
        "Tàu kéo phương vị 8.000 HP sử dụng hệ truyền động chữ Z, hiện là tàu kéo cảng đa năng có công suất lớn nhất Trung Quốc, đáp ứng cả nhiệm vụ đẩy tàu trong cảng và thi công công trình biển. Tàu kéo lực kéo 70 tấn được phát triển cho thị trường châu Âu, đạt trình độ tiên tiến quốc tế về kéo tàu và chữa cháy ngoài tàu.",
      ],
    },
    "container-vessel": {
      title: "Tàu container",
      paragraphs: [
        "(1) Hiệu suất nổi bật: hệ thống điện bờ hạ áp trên tàu giúp tàu không phát thải khi neo đậu tại cảng.",
        "(2) Thiết kế tiên tiến: tàu kết hợp chức năng tàu container và tàu chở hàng khô thông thường, vận chuyển được container tiêu chuẩn, container lạnh cũng như hàng lạnh đi cùng hàng nguy hiểm.",
        "(3) Hệ thống thông minh gồm mạng 5G, Wi-Fi, tăng cường quan sát, nhận dạng hành vi bằng AI, tuần tra buồng máy, phân tích hiệu suất năng lượng và hành trình, hỗ trợ quyết định lái tàu và dẫn đường tự động.",
      ],
    },
    "multi-purpose-transport-vessels": {
      title: "Tàu vận tải đa dụng",
      paragraphs: [
        "Phạm vi kinh doanh bao gồm tàu chở dầu thành phẩm, tàu hàng rời và sà lan boong tự hành.",
        "Sà lan vận chuyển dầu sinh học năng lượng mới tại Indonesia có thể chở hàng lỏng hóa chất loại II và III, sử dụng thiết kế thân thiện môi trường, nguồn điện quang năng và phương pháp đóng tàu theo mô-đun. Tàu boong tự hành 6.000 tấn dùng hai động cơ, hai chân vịt bước cố định trong ống đạo lưu, có boong hàng rộng và cầu dẫn mũi cho xe tải 60 tấn.",
        "Tàu đa dụng 7.400 DWT có thiết kế, hiệu quả kinh tế và năng lực khai thác nổi bật, đồng thời đáp ứng tiêu chuẩn khí thải Tier III và EEDI giai đoạn 2.",
      ],
    },
    "engineering-special-vessels": {
      title: "Tàu công trình và tàu chuyên dụng",
      paragraphs: [
        "Phạm vi kinh doanh bao gồm tàu nạo vét, tàu dịch vụ giàn khoan ngoài khơi và tàu nuôi trồng thủy sản.",
        "Tàu nạo vét san phẳng là tàu công tác tự nâng đầu tiên trong và ngoài Trung Quốc kết hợp san phẳng nền đá dưới nước với nạo vét. Sản phẩm có bằng sáng chế quốc gia và đạt giải nhì về tiến bộ khoa học công nghệ của Hiệp hội Cảng biển Trung Quốc.",
        "Tàu nạo vét gầu nghịch cỡ lớn chạy điện có năng lực máy đào lớn nhất và độ sâu nạo vét lớn nhất Trung Quốc. Tàu vừa tự hành vừa định vị bằng xe kéo, được công nhận là thiết bị kỹ thuật đầu tiên cùng loại tại tỉnh Sơn Đông năm 2021.",
      ],
    },
    "deep-sea-intelligent-cages": {
      title: "Lồng nuôi biển sâu thông minh cao cấp",
      paragraphs: [
        "(1) Hệ thống lưới kín hai lớp dạng mô-đun sử dụng các tấm lưới nhỏ và vật liệu ít dão, giúp giảm biến dạng và tăng độ an toàn.",
        "(2) Hệ thống cho cá ăn tự động đáp ứng mô hình nuôi bán chìm và chìm hoàn toàn xuống đáy.",
        "(3) Hệ thống giám sát an toàn lồng nuôi kết hợp video với nhận dạng hình ảnh thông minh để cảnh báo sớm động vật lớn có khả năng tấn công, độ chính xác dự báo trên 90%.",
        "(4) Cảm biến đa thông số ứng dụng chip quang điện tích hợp cho phép giám sát trang trại biển chính xác, lâu dài với chi phí thấp.",
      ],
    },
    "offshore-platforms": {
      title: "Giàn và nền tảng ngoài khơi",
      paragraphs: [
        "Phạm vi kinh doanh bao gồm ụ nổi, nền tảng nghỉ dưỡng biển và nền tảng trang trại biển.",
        "Nền tảng nghỉ dưỡng Hải Thượng Mục Ca là nền tảng nghỉ dưỡng lớn nhất Trung Quốc, có khu câu cá nghỉ ngơi, nhà hàng đại dương 3D, khu phổ biến khoa học biển và quảng trường bia. Nền tảng trang trại biển có thể làm cơ sở hỗ trợ và trung tâm điều khiển cho lồng nuôi biển sâu thông minh, đồng thời tích hợp quản lý nuôi trồng, trải nghiệm nghề cá, du lịch sinh thái, quan trắc môi trường và giáo dục khoa học.",
      ],
    },
    "installation-portal-cranes": {
      title: "Cẩu chân đế lắp đặt cho đóng tàu",
      paragraphs: [
        "Với giấy phép sản xuất cấp A, doanh nghiệp cung cấp đầy đủ các dòng cẩu chân đế cho đóng mới và sửa chữa tàu. Sản phẩm đáp ứng điều kiện làm việc khắc nghiệt và cường độ khai thác cao, ứng dụng công nghệ gia công độc quyền cho bề mặt bích trên và dưới của vòng quay, đồng thời có thể tùy chỉnh theo yêu cầu.",
      ],
    },
    "shipbuilding-gantry-cranes": {
      title: "Cẩu giàn đóng tàu",
      paragraphs: [
        "Với giấy phép sản xuất cấp A, doanh nghiệp đảm nhận chế tạo, lắp đặt, cải tạo và bảo trì đầy đủ các dòng cẩu giàn đóng tàu, có thể thiết kế riêng theo yêu cầu khách hàng.",
      ],
    },
  },
  zh: {
    "multi-purpose-tugboat": {
      title: "多用途拖轮",
      paragraphs: [
        "业务涵盖港作、海工、消防、溢油回收等多功能（新能源）动力拖轮。",
        "5000HP罗伯特拖轮是山东省内首艘罗伯特船型拖轮；6000HP全回转溢油回收拖轮是国内首艘兼具溢油回收功能的全回转拖轮，并获得日照市科学技术进步奖。",
        "8000HP全回转拖轮采用近海Z型推进，是目前国内马力最大的港口多功能拖轮，具备港口顶推和海上工程施工能力。70吨拖力全回转拖轮专为欧洲客户开发，可满足港口拖带、对外消防等作业要求，整体性能达到国际先进水平。",
      ],
    },
    "container-vessel": {
      title: "集装箱船",
      paragraphs: [
        "（1）船舶效能突出。配置低压船载岸电系统，可实现港口停泊零排放。",
        "（2）设计理念先进。兼具集装箱船和普通干货船功能，可运输普通集装箱、冷藏集装箱，并具备冷藏集装箱与危险品混装运输能力。",
        "（3）智慧智能提升。配备5G网络、WIFI无线热点、增强瞭望、AI行为识别、机舱巡检、船舶能效分析、航行动态分析、驾驶辅助决策和自主导航等系统。",
      ],
    },
    "multi-purpose-transport-vessels": {
      title: "多功能运输船",
      paragraphs: [
        "业务涵盖成品油船、散货船、自航甲板驳等。",
        "印尼新能源生物油运输驳船兼顾二、三类化学品液货运输能力，采用环保设计、光伏供电系统和模块化总段建造。6000吨自航甲板船采用双机、双导管定距桨轴系推进，配有宽敞载货甲板和可供60吨重型汽车通行的艏部跳板。",
        "7400DWT多用途船设计性能优异，具备良好的经济性和高效装载、运行能力，并满足Tier III排放和EEDI第二阶段要求。",
      ],
    },
    "engineering-special-vessels": {
      title: "工程与特种船",
      paragraphs: [
        "业务涵盖挖泥船、海上平台服务船、养殖工船等。",
        "整平挖泥船为国内外首艘兼具水下抛石基床整平和挖泥功能的自升式工作船，获国家发明专利和中国港口协会科技进步二等奖。",
        "电力推进大型反铲挖泥船为国内挖机吨位最大、挖深最深的挖泥船，兼具自航及台车牵引移船功能，是2021年度山东省首台套技术装备。",
      ],
    },
    "deep-sea-intelligent-cages": {
      title: "深远海高端智能网箱",
      paragraphs: [
        "（1）网衣系统采用双层网模块化全封闭设计，基于小片网和低蠕变网纲，网衣变形更小、安全性更高。",
        "（2）鱼饲料自动投喂系统可满足半潜和全潜坐底养殖投喂需求。",
        "（3）全方位网箱安全监护系统结合视频监控与智能图像识别，可提前预警大型攻击性动物，预测准确率超过90%。",
        "（4）基于光电集成芯片技术的海洋牧场多参数传感器，可实现长期、低成本的准确监测。",
      ],
    },
    "offshore-platforms": {
      title: "海上平台",
      paragraphs: [
        "业务涵盖浮船坞、海上休闲平台、海洋牧场平台等。",
        "海上牧歌休闲平台是国内最大的休闲平台，设有垂钓休息区、3D海洋餐厅、海洋科普区和啤酒广场。海洋牧场平台可作为深海智能网箱的配套设施和控制中心，并集养殖管护、牧渔体验、生态观光、海洋环境监测和科普教育于一体。",
      ],
    },
    "installation-portal-cranes": {
      title: "安装门机",
      paragraphs: [
        "具备A级生产许可证，业务涵盖修造船安装门机全系列产品，经受恶劣工况及设备高利用率考验，具有专有的回转支承上下法兰面加工工艺，可根据需求量身定制。",
      ],
    },
    "shipbuilding-gantry-cranes": {
      title: "造船龙门吊",
      paragraphs: [
        "具备A级生产许可证，涵盖造船门式起重机全系列产品制造、安装、改造和维修，可根据需求量身定制。",
      ],
    },
  },
};

const localeCopy: Record<
  AppLocale,
  Omit<ShipbuildingRepairContent, "sections">
> = {
  en: {
    title: "Shipbuilding and repairing",
    description: "Shipbuilding, repair and marine-engineering solutions for specialized vessels, offshore platforms, intelligent aquaculture and shipyard cranes.",
    productsLabel: "Products & Solutions",
    intro: "Provide manufacturing and maintenance services for ocean-going research vessels, dredgers, fishery administration vessels, coast guard vessels, aquaculture vessels, multi-purpose vessels and tugboats. Design, development, processing and manufacturing services are also provided for marine structures used in resource exploration, offshore operations, aquaculture, emergency rescue and environmental surveys.",
    previousLabel: "Previous image",
    nextLabel: "Next image",
    galleryLabel: "Product gallery",
  },
  vi: {
    title: "Đóng mới và sửa chữa tàu",
    description: "Giải pháp đóng mới, sửa chữa tàu và công trình biển cho tàu chuyên dụng, giàn ngoài khơi, nuôi biển thông minh và thiết bị nâng hạ tại nhà máy đóng tàu.",
    productsLabel: "Sản phẩm & Giải pháp",
    intro: "Cung cấp dịch vụ chế tạo và bảo trì tàu nghiên cứu đại dương, tàu nạo vét, tàu kiểm ngư, tàu cảnh sát biển, tàu nuôi trồng thủy sản, tàu đa dụng và tàu kéo. Đồng thời cung cấp dịch vụ thiết kế, phát triển, gia công và chế tạo kết cấu công trình biển phục vụ thăm dò tài nguyên, khai thác ngoài khơi, nuôi biển, cứu hộ cứu nạn và khảo sát môi trường biển.",
    previousLabel: "Ảnh trước",
    nextLabel: "Ảnh tiếp theo",
    galleryLabel: "Thư viện sản phẩm",
  },
  zh: {
    title: "修造船系统解决方案",
    description: "面向特种船舶、海上平台、深海智能养殖及船厂起重设备的修造船与海洋工程解决方案。",
    productsLabel: "产品与解决方案",
    intro: "提供制造、维修远洋科考船、挖泥船、渔政船、海警船、养殖工船、多用途船和拖轮服务，并根据需求提供海洋资源勘探、海上作业、海上养殖、海洋抢险救助、海上环境调查等海洋工程结构物的设计研发、加工制造服务。",
    previousLabel: "上一张图片",
    nextLabel: "下一张图片",
    galleryLabel: "产品图片",
  },
};

const sectionOrder: readonly ShipbuildingRepairSectionId[] = [
  "multi-purpose-tugboat",
  "container-vessel",
  "multi-purpose-transport-vessels",
  "engineering-special-vessels",
  "deep-sea-intelligent-cages",
  "offshore-platforms",
  "installation-portal-cranes",
  "shipbuilding-gantry-cranes",
];

export function getShipbuildingRepairContent(
  locale: AppLocale,
): ShipbuildingRepairContent {
  return {
    ...localeCopy[locale],
    sections: sectionOrder.map((id) => ({
      id,
      ...sectionText[locale][id],
      images: galleryAssets[id].map(({ file, caption }) => ({
        src: file,
        caption: caption[locale],
      })),
    })),
  };
}

export const shipbuildingRepairOverviewImage =
  "/images/uploads/allimg/20240731/5a1b3b6e0d438e3b2317c70295f1ab4c.jpg";
