import type { AppLocale } from "@/i18n/routing";

import type { ContainerHandlingGalleryItem } from "./container-handling";

type SmartLogisticsSectionId =
  | "rail-mounted-gantry-crane"
  | "rubber-tyred-gantry-crane"
  | "electric-reach-stacker"
  | "electric-stacker"
  | "aigt";

type LocalizedText = Record<AppLocale, string>;

type GalleryAsset = {
  file: string;
  caption: LocalizedText;
};

export type SmartLogisticsHandlingContent = {
  title: string;
  description: string;
  productsLabel: string;
  intro: string;
  previousLabel: string;
  nextLabel: string;
  galleryLabel: string;
  sections: readonly {
    id: SmartLogisticsSectionId;
    title: string;
    paragraphs: readonly string[];
    images: readonly ContainerHandlingGalleryItem[];
  }[];
};

const uploadAssetRoot = "/images/uploads/allimg/20240531";
const containerAssetRoot = "/images/Container handling systems";

const containerGalleryFiles = new Set([
  "d9565f8fe4a32f5b64c25c92e2ef9cd7.gif",
  "a0a3e9282759308e4e96ddc7ef627241_lp.jpg",
  "57356f72e78e1cc7f22f6a139b55c02b_lp.jpg",
  "65a59424974c5b4bc882ce01bc6fed8a_lp.jpg",
  "613c90a703d29daeb793681f2991b103_lp.jpg",
  "5a5e438704d71961e0bc005efe99a452_lp.jpg",
  "f0b7a05afa6f4e3c15d53e4e55fb3737.gif",
  "89d33b655c1bcfd0b4c5e29e50b86c7a_lp.jpg",
  "6970047016d430f9f6cb48590e5fa9db_lp.jpg",
  "bbf72a3868e979d63937ef6935f5e719_lp.jpg",
]);

const containerGalleryAliases: Record<string, string> = {
  "50bd1a9c4762aeaa78c49f3814097789_lp.jpg":
    "65818e1932015a2086e7f311cbd6a275_lp.jpg",
  "50fc7383a5e153040676352266200182_lp.jpg":
    "4ff480c8ca26ed3b510811b2ec978704_lp.jpg",
};

function asset(file: string, en: string, vi: string, zh: string): GalleryAsset {
  const localFile = containerGalleryAliases[file] ?? file;
  const root =
    containerGalleryFiles.has(file) || containerGalleryAliases[file]
      ? containerAssetRoot
      : uploadAssetRoot;

  return { file: `${root}/${localFile}`, caption: { en, vi, zh } };
}

const galleryAssets: Record<SmartLogisticsSectionId, readonly GalleryAsset[]> =
  {
    "rail-mounted-gantry-crane": [
      asset(
        "d9565f8fe4a32f5b64c25c92e2ef9cd7.gif",
        "Automated rail crane",
        "Cẩu ray tự động",
        "自动化轨道吊",
      ),
      asset(
        "a0a3e9282759308e4e96ddc7ef627241_lp.jpg",
        "Qingdao Port QQCTN Phase III - 41T automated rail crane",
        "Cẩu ray tự động 41T giai đoạn III QQCTN tại Cảng Thanh Đảo",
        "青岛港QQCTN三期-41T自动化轨道吊",
      ),
      asset(
        "57356f72e78e1cc7f22f6a139b55c02b_lp.jpg",
        "Qingdao Port QQCTN Phase II - 41T automated rail crane",
        "Cẩu ray tự động 41T giai đoạn II QQCTN tại Cảng Thanh Đảo",
        "青岛港QQCTN二期-41T自动化轨道吊",
      ),
      asset(
        "65a59424974c5b4bc882ce01bc6fed8a_lp.jpg",
        "Qingdao Port QQCTN Phase III - 41T automated rail crane",
        "Cẩu ray tự động 41T giai đoạn III QQCTN tại Cảng Thanh Đảo",
        "青岛港QQCTN三期-41T自动化轨道吊",
      ),
      asset(
        "613c90a703d29daeb793681f2991b103_lp.jpg",
        "Qingdao Port QQCTU - 41T rail crane",
        "Cẩu ray 41T QQCTU tại Cảng Thanh Đảo",
        "青岛港QQCTU-41T轨道吊",
      ),
      asset(
        "5a5e438704d71961e0bc005efe99a452_lp.jpg",
        "Qingdao Port QQCTN Phase I - 41T automated rail crane",
        "Cẩu ray tự động 41T giai đoạn I QQCTN tại Cảng Thanh Đảo",
        "青岛港QQCTN一期-41T自动化轨道吊",
      ),
    ],
    "rubber-tyred-gantry-crane": [
      asset(
        "f0b7a05afa6f4e3c15d53e4e55fb3737.gif",
        "Qingdao Port QQCTU - automated rubber-tyred gantry crane",
        "Cẩu giàn bánh lốp tự động QQCTU tại Cảng Thanh Đảo",
        "青岛港QQCTU-自动化轮胎吊",
      ),
      asset(
        "89d33b655c1bcfd0b4c5e29e50b86c7a_lp.jpg",
        "Jiangsu Zhenjiang Port - 40.5T rubber-tyred gantry crane",
        "Cẩu giàn bánh lốp 40,5T tại Cảng Trấn Giang, Giang Tô",
        "江苏镇江港-40.5T轮胎吊",
      ),
      asset(
        "6970047016d430f9f6cb48590e5fa9db_lp.jpg",
        "Yantai Longkou Port - 40.5T rubber-tyred gantry crane",
        "Cẩu giàn bánh lốp 40,5T tại Cảng Long Khẩu, Yên Đài",
        "烟台龙口港-40.5T轮胎吊",
      ),
      asset(
        "bbf72a3868e979d63937ef6935f5e719_lp.jpg",
        "Shandong Hi-Speed Weifang Port - 40.5T rubber-tyred gantry crane",
        "Cẩu giàn bánh lốp 40,5T tại Cảng Duy Phường, Sơn Đông",
        "山东高速潍坊港-40.5T轮胎吊",
      ),
    ],
    "electric-reach-stacker": [
      asset(
        "8080aeb773c5592765898043f2d41b29_lp.jpg",
        "Shandong Port Logistics Group - electric reach stacker",
        "Xe nâng container điện của Tập đoàn Logistics Cảng Sơn Đông",
        "山东港口物流集团-电动正面吊",
      ),
      asset(
        "08773ae37f244bf03d5ab0472ffcfe18_lp.jpg",
        "Shandong Port Logistics Group - electric reach stacker",
        "Xe nâng container điện của Tập đoàn Logistics Cảng Sơn Đông",
        "山东港口物流集团-电动正面吊",
      ),
      asset(
        "fdaf86cd906b7346c6802a29e9405129_lp.jpg",
        "Shandong Port Logistics Group - electric reach stacker",
        "Xe nâng container điện của Tập đoàn Logistics Cảng Sơn Đông",
        "山东港口物流集团-电动正面吊",
      ),
      asset(
        "8547bb56783f4acb16fce3d5f8a0b563_lp.jpg",
        "Shandong Port Logistics Group - electric reach stacker",
        "Xe nâng container điện của Tập đoàn Logistics Cảng Sơn Đông",
        "山东港口物流集团-电动正面吊",
      ),
      asset(
        "b3cb6586a8ed557c7612e5f5b384797a_lp.jpg",
        "Shandong Port Logistics Group - electric reach stacker",
        "Xe nâng container điện của Tập đoàn Logistics Cảng Sơn Đông",
        "山东港口物流集团-电动正面吊",
      ),
      asset(
        "681391d847b35607fcc5970da0437abf_lp.jpg",
        "Shandong Port Logistics Group - electric reach stacker",
        "Xe nâng container điện của Tập đoàn Logistics Cảng Sơn Đông",
        "山东港口物流集团-电动正面吊",
      ),
      asset(
        "98d0697f5e3ae19507e1ef021968eb5f_lp.jpg",
        "Shandong Port Logistics Group - electric reach stacker",
        "Xe nâng container điện của Tập đoàn Logistics Cảng Sơn Đông",
        "山东港口物流集团-电动正面吊",
      ),
    ],
    "electric-stacker": [
      asset(
        "40bf2a7c9ed9cc84b8ceea78e48e139c_lp.jpg",
        "Qingdao Port QQCT - electric stacker",
        "Xe nâng xếp điện QQCT tại Cảng Thanh Đảo",
        "青岛港QQCT-电动堆高机",
      ),
      asset(
        "aad62f72634b1a06cb2398ef89e456b3_lp.jpg",
        "Qingdao Port QQCT - electric stacker",
        "Xe nâng xếp điện QQCT tại Cảng Thanh Đảo",
        "青岛港QQCT-电动堆高机",
      ),
      asset(
        "82aa1f5471532d7f0782184c68cfff1f_lp.jpg",
        "Qingdao Port QQCT - electric stacker",
        "Xe nâng xếp điện QQCT tại Cảng Thanh Đảo",
        "青岛港QQCT-电动堆高机",
      ),
      asset(
        "731a826f3ba7951f1a1a9c7fbb1d8878_lp.jpg",
        "Qingdao Port QQCT - electric stacker",
        "Xe nâng xếp điện QQCT tại Cảng Thanh Đảo",
        "青岛港QQCT-电动堆高机",
      ),
      asset(
        "15a4aaea55662e41839c7f64db283c14_lp.jpg",
        "Qingdao Port QQCT - electric stacker",
        "Xe nâng xếp điện QQCT tại Cảng Thanh Đảo",
        "青岛港QQCT-电动堆高机",
      ),
    ],
    aigt: [
      asset(
        "50bd1a9c4762aeaa78c49f3814097789_lp.jpg",
        "Qingdao Port QQCTU - AIGT",
        "Xe vận chuyển container thông minh AIGT QQCTU tại Cảng Thanh Đảo",
        "青岛港QQCTU-AIGT",
      ),
      asset(
        "50fc7383a5e153040676352266200182_lp.jpg",
        "Qingdao Port QQCTU - AIGT",
        "Xe vận chuyển container thông minh AIGT QQCTU tại Cảng Thanh Đảo",
        "青岛港QQCTU-AIGT",
      ),
    ],
  };

const sectionText: Record<
  AppLocale,
  Record<
    SmartLogisticsSectionId,
    { title: string; paragraphs: readonly string[] }
  >
> = {
  en: {
    "rail-mounted-gantry-crane": {
      title: "Rail-mounted container gantry crane",
      paragraphs: [
        "The self-developed fully automated container stacker crane has been applied to the third phase of Qingdao Port Automated Terminal, China's first fully domestically developed autonomous automated terminal, achieving three independent breakthroughs.",
        "(1) The first domestically produced automated electronic control system was integrated and applied at scale.",
        "(2) The automated rail crane uses a DC mobile power supply system.",
        "(3) Key core components have been replaced with domestically produced alternatives.",
        "The business covers the manufacture, installation, transformation and maintenance of products with capacities of 41 tons and below, including railway-specific rail cranes that can be customized to customer needs.",
      ],
    },
    "rubber-tyred-gantry-crane": {
      title: "Rubber-tyred container gantry crane",
      paragraphs: [
        "The self-developed products use accurate and reliable spatial positioning, advanced automatic control and safety protection, and intelligent scanning technologies. These systems support precise automated control and flexible switching between local maintenance, remote automatic operation, remote manual emergency operation and local cab operation.",
        "The business covers the manufacture, installation, transformation and maintenance of products with capacities of 41 tons and below, with configurations customized to demand.",
      ],
    },
    "electric-reach-stacker": {
      title: "Electric reach stacker",
      paragraphs: [
        "The electric reach stacker uses advanced technologies including a new spreader, precise weighing, dynamic anti-tipping, automatic braking while reversing, a new electronic control system and energy recovery. A quick-change battery system provides one additional spare battery per vehicle; replacement takes less than 15 minutes, while overall machine operation saves approximately 40% energy.",
      ],
    },
    "electric-stacker": {
      title: "Electric stacker",
      paragraphs: [
        "The highly integrated power system assigns a dedicated motor to each movement for safer driving. A new mast design allows the spreader and mast to be controlled independently and removes passive energy consumption from the inner mast. Daily electricity costs are about RMB 156.4, approximately 79% lower than fuel, with no direct carbon emissions and substantially less environmental impact.",
      ],
    },
    aigt: {
      title: "AIGT",
      paragraphs: [
        "The AIGT developed by Shandong Port Equipment Group combines satellite navigation, LiDAR SLAM and visual SLAM for multi-sensor fusion positioning. Multiple vehicles can share environmental information for coordinated positioning, autonomous driving and intelligent fleet operation. It can achieve L5 intelligent driving in closed environments, reuse most existing terminal infrastructure with limited modification and position to within ±30 mm.",
        "Compared with magnetically guided AGVs, the new automated container transporter is lighter, smarter and more energy-efficient, while costing approximately 70% as much as an AGV. Configurations can be customized to demand.",
      ],
    },
  },
  vi: {
    "rail-mounted-gantry-crane": {
      title: "Cẩu giàn container chạy ray",
      paragraphs: [
        "Cẩu xếp container hoàn toàn tự động do tập đoàn tự nghiên cứu đã được ứng dụng tại giai đoạn III của Bến container tự động Cảng Thanh Đảo, bến tự động tự chủ đầu tiên do Trung Quốc phát triển, qua đó đạt ba bước đột phá độc lập.",
        "(1) Tích hợp hệ thống điều khiển điện tự động sản xuất trong nước đầu tiên và triển khai ở quy mô lớn.",
        "(2) Cẩu ray tự động sử dụng hệ thống cấp điện di động một chiều.",
        "(3) Thay thế các linh kiện cốt lõi quan trọng bằng sản phẩm trong nước.",
        "Phạm vi hoạt động bao gồm chế tạo, lắp đặt, cải tạo và bảo dưỡng thiết bị có sức nâng đến 41 tấn, đồng thời cung cấp cẩu ray chuyên dụng cho đường sắt và tùy chỉnh theo nhu cầu.",
      ],
    },
    "rubber-tyred-gantry-crane": {
      title: "Cẩu giàn container bánh lốp",
      paragraphs: [
        "Sản phẩm tự nghiên cứu sử dụng công nghệ định vị không gian chính xác, tin cậy, điều khiển tự động và bảo vệ an toàn tiên tiến cùng công nghệ quét thông minh. Hệ thống hỗ trợ điều khiển tự động chính xác và chuyển đổi linh hoạt giữa chế độ bảo trì tại chỗ, vận hành tự động từ xa, xử lý khẩn cấp thủ công từ xa và vận hành tại cabin.",
        "Phạm vi hoạt động bao gồm chế tạo, lắp đặt, cải tạo và bảo dưỡng thiết bị có sức nâng đến 41 tấn, với cấu hình được tùy chỉnh theo nhu cầu.",
      ],
    },
    "electric-reach-stacker": {
      title: "Xe nâng container điện",
      paragraphs: [
        "Xe nâng container điện được trang bị khung nâng thế hệ mới, cân chính xác, chống lật động, phanh tự động khi lùi, hệ thống điều khiển điện tử mới và công nghệ thu hồi năng lượng. Hệ thống pin thay nhanh bố trí thêm một pin dự phòng cho mỗi xe, thời gian thay pin dưới 15 phút và giúp toàn bộ máy tiết kiệm khoảng 40% năng lượng khi vận hành.",
      ],
    },
    "electric-stacker": {
      title: "Xe nâng xếp điện",
      paragraphs: [
        "Nguồn động lực được tích hợp cao, mỗi chuyển động sử dụng một động cơ riêng để vận hành an toàn hơn. Thiết kế khung nâng mới cho phép điều khiển độc lập khung nâng và bộ công tác, loại bỏ tổn hao năng lượng thụ động của khung trong. Chi phí điện mỗi ngày khoảng 156,4 nhân dân tệ, thấp hơn khoảng 79% so với nhiên liệu, không phát thải carbon trực tiếp và giảm đáng kể tác động đến môi trường.",
      ],
    },
    aigt: {
      title: "AIGT",
      paragraphs: [
        "AIGT do Tập đoàn Thiết bị Cảng Sealand Sơn Đông phát triển kết hợp định vị vệ tinh, LiDAR SLAM và SLAM thị giác để định vị hợp nhất đa cảm biến. Nhiều xe có thể chia sẻ dữ liệu môi trường, phối hợp định vị, tự hành và vận hành đội xe thông minh. Thiết bị có thể đạt mức tự hành L5 trong khu vực khép kín, tận dụng phần lớn hạ tầng cảng hiện hữu với mức cải tạo nhỏ và đạt độ chính xác định vị ±30 mm.",
        "So với AGV dẫn hướng bằng đinh từ, xe vận chuyển container tự động thế hệ mới nhẹ hơn, thông minh hơn, tiết kiệm năng lượng hơn và có chi phí chỉ khoảng 70% AGV. Cấu hình có thể tùy chỉnh theo nhu cầu.",
      ],
    },
  },
  zh: {
    "rail-mounted-gantry-crane": {
      title: "轨道式集装箱门式起重机",
      paragraphs: [
        "自主研制的全自动化集装箱堆垛机应用于全国首个全国产全自主自动化码头——青岛港自动化码头三期，实现三大自主突破。",
        "（1）集成创新首套全国产化自动化电控系统并实现规模化应用。",
        "（2）自动化轨道吊应用直流移动供电系统。",
        "（3）关键核心零部件的国产化替代。",
        "业务涵盖41吨及以下产品制造、安装、改造、维修，并有铁路专用轨道吊，可根据需求量身定制。",
      ],
    },
    "rubber-tyred-gantry-crane": {
      title: "轮胎式集装箱门式起重机",
      paragraphs: [
        "自主研制的产品配备精确可靠的空间定位技术，先进的自动控制与安全保护技术、智能扫描技术等，为自动化的精准控制提供了基础技术保障，实现了设备本地维护模式、远控自动化作业模式、远程人工应急操作模式、本地司机室操作模式等多种作业模式的自由灵活切换。",
        "业务涵盖41吨及以下产品制造、安装、改造、维修，可根据需求量身定制。",
      ],
    },
    "electric-reach-stacker": {
      title: "电动正面吊",
      paragraphs: [
        "搭载新型吊具、精确称重、动态防倾翻、倒车自动刹车、新型电控系统、能量回收技术等业内先进技术，采用部分快换电池，每车多配置1块备用电池，电池更换时间小于15分钟，整机综合作业节能约40%。",
      ],
    },
    "electric-stacker": {
      title: "电动堆高机",
      paragraphs: [
        "采用动力源高度集成，各动作配置不同的电机，驱动更安全；全新门架设计，吊具和门架可单独控制，取消内门架被动耗能，单日用电成本约为156.4元，相比燃油可降本79%，无直接碳排放，大大减少对环境的影响。",
      ],
    },
    aigt: {
      title: "AIGT",
      paragraphs: [
        "陆海装备集团研制AIGT采用卫星导航定位、激光雷达SLAM、视觉SLAM等多传感器融合定位技术，可多车协同共享环境信息进行融合定位，具备自动驾驶单车及多车联动智能，智能驾驶等级可达到封闭场景内L5级，能够高度利用码头已有基建，小幅改造，定位精度可达到±30mm。",
        "相对于磁钉定位的AGV，全新一代全自动集装箱运输车自重更轻、更智能、更节能，造价更低，约为AGV的70%。可根据需求量身定制。",
      ],
    },
  },
};

const localeCopy: Record<
  AppLocale,
  Omit<SmartLogisticsHandlingContent, "sections">
> = {
  en: {
    title: "Smart logistics park",
    description:
      "Integrated automated handling, intelligent transport and digital management solutions for smart logistics parks.",
    productsLabel: "Products & Solutions",
    intro:
      "Provide a full range of customized products including automated rail-mounted, rubber-tyred and railway-specific container gantry cranes, unmanned container trucks and prefabricated steel-structure buildings. Optional systems include vehicle and container number recognition, truck positioning, anti-lift protection, automatic collision avoidance, one-key automatic anchoring, intelligent status management, intelligent lubrication, automatic fire protection, smart gates and smart lighting.",
    previousLabel: "Previous image",
    nextLabel: "Next image",
    galleryLabel: "Product gallery",
  },
  vi: {
    title: "Khu logistics thông minh",
    description:
      "Giải pháp tích hợp thiết bị xếp dỡ tự động, vận chuyển thông minh và quản lý số cho khu logistics thông minh.",
    productsLabel: "Sản phẩm & Giải pháp",
    intro:
      "Cung cấp đầy đủ các sản phẩm tùy chỉnh gồm cẩu giàn container chạy ray, bánh lốp và chuyên dụng cho đường sắt tự động, xe vận chuyển container không người lái và nhà kết cấu thép lắp ghép. Các hệ thống tùy chọn gồm nhận dạng số xe và số container, định vị xe, chống nhấc xe, tránh va chạm tự động, neo tự động một chạm, quản lý trạng thái thông minh, bôi trơn thông minh, chữa cháy tự động, cổng thông minh và chiếu sáng thông minh.",
    previousLabel: "Ảnh trước",
    nextLabel: "Ảnh tiếp theo",
    galleryLabel: "Thư viện sản phẩm",
  },
  zh: {
    title: "智慧物流园区解决方案",
    description:
      "面向智慧物流园区的自动化装卸、智能运输与数字化管理一体化解决方案。",
    productsLabel: "产品与解决方案",
    intro:
      "提供自动化轨道式/轮胎式/铁路专用集装箱门式起重机、无人集卡、装配式钢结构建筑等全系列定制产品，并根据需求配套车号/箱号识别、集卡定位、集卡防吊起、自动防撞、一键自动锚定、智能状态管理系统、智能润滑、自动消防、智慧闸口及智慧照明等功能。",
    previousLabel: "上一张图片",
    nextLabel: "下一张图片",
    galleryLabel: "产品图片",
  },
};

const sectionOrder: readonly SmartLogisticsSectionId[] = [
  "rail-mounted-gantry-crane",
  "rubber-tyred-gantry-crane",
  "electric-reach-stacker",
  "electric-stacker",
  "aigt",
];

export function getSmartLogisticsHandlingContent(
  locale: AppLocale,
): SmartLogisticsHandlingContent {
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

export const smartLogisticsOverviewImage =
  "/images/uploads/allimg/20240731/b9b9deaaea19beef73f4e3440a91c2f5.jpg";
