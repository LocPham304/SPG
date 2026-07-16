import type { AppLocale } from "@/i18n/routing";

export type ContainerHandlingGalleryItem = {
  src: string;
  caption: string;
};

export type ContainerHandlingSection = {
  id: "shore-crane" | "rail-crane" | "tyred-crane" | "portal-crane" | "aigt";
  title: string;
  paragraphs: readonly string[];
  images: readonly ContainerHandlingGalleryItem[];
};

export type ContainerHandlingContent = {
  title: string;
  description: string;
  productsLabel: string;
  introLabel: string;
  intro: string;
  previousLabel: string;
  nextLabel: string;
  galleryLabel: string;
  sections: readonly ContainerHandlingSection[];
};

type SectionId = ContainerHandlingSection["id"];
type LocalizedText = Record<AppLocale, string>;

const assetRoot = "/images/Container handling systems";

const galleryAssets: Record<
  SectionId,
  readonly { file: string; caption: LocalizedText }[]
> = {
  "shore-crane": [
    {
      file: "854c8870538d7e2a21b24986e26810e6.gif",
      caption: {
        en: "Remote control of shore container cranes",
        vi: "Điều khiển từ xa cẩu giàn container bờ",
        zh: "远控岸边集装箱起重机",
      },
    },
    {
      file: "9e42f437ca9487e5dcf66b4f5d6b69f1_lp.jpg",
      caption: {
        en: "Qingdao Port QQCT-70T70M shore container crane",
        vi: "Cẩu giàn container bờ QQCT-70T70M tại Cảng Thanh Đảo",
        zh: "青岛港QQCT-70T70M岸边集装箱起重机",
      },
    },
    {
      file: "634cb9b8289613d96a9f88758e533a74_lp.jpg",
      caption: {
        en: "Qingdao Port QQCTU-70T70M shore container crane",
        vi: "Cẩu giàn container bờ QQCTU-70T70M tại Cảng Thanh Đảo",
        zh: "青岛港QQCTU-70T70M岸边集装箱起重机",
      },
    },
    {
      file: "172d0a00fab32b7cb3e5dc992d112a75_lp.jpg",
      caption: {
        en: "Qingdao Port QQCTU-70T70M shore container crane",
        vi: "Cẩu giàn container bờ QQCTU-70T70M tại Cảng Thanh Đảo",
        zh: "青岛港QQCTU-70T70M岸边集装箱起重机",
      },
    },
    {
      file: "7fbeab947e9a04506effbe750ef7f815_lp.jpg",
      caption: {
        en: "Weifang Port - 70T50T shore container crane",
        vi: "Cẩu giàn container bờ 70T50T tại Cảng Duy Phường",
        zh: "潍坊港-70T50T岸边集装箱起重机",
      },
    },
    {
      file: "c06b477a692d6c3fb76a3f7a13b1ad64_lp.jpg",
      caption: {
        en: "Qingdao Port QQCT semi-automatic 80T70M double-hoisting shore container crane",
        vi: "Cẩu bờ nâng kép bán tự động QQCT 80T70M tại Cảng Thanh Đảo",
        zh: "青岛港QQCT-半自动化80T70M双起升岸边集装箱起重机",
      },
    },
    {
      file: "333ee429532a28cc13d676742aa3df5b_lp.jpg",
      caption: {
        en: "Zhejiang Zhapu Port - 40.5T35M shore container crane",
        vi: "Cẩu giàn container bờ 40,5T35M tại Cảng Zhapu, Chiết Giang",
        zh: "浙江乍浦港-40.5T35M岸边集装箱起重机",
      },
    },
  ],
  "rail-crane": [
    {
      file: "d9565f8fe4a32f5b64c25c92e2ef9cd7.gif",
      caption: {
        en: "Automated rail cranes",
        vi: "Cẩu chạy ray tự động",
        zh: "自动化轨道吊",
      },
    },
    {
      file: "a0a3e9282759308e4e96ddc7ef627241_lp.jpg",
      caption: {
        en: "Qingdao Port QQCTN Phase III - 41T automatic rail crane",
        vi: "Cẩu ray tự động QQCTN 41T giai đoạn III tại Cảng Thanh Đảo",
        zh: "青岛港QQCTN三期-41T自动化轨道吊",
      },
    },
    {
      file: "57356f72e78e1cc7f22f6a139b55c02b_lp.jpg",
      caption: {
        en: "Qingdao Port QQCTN Phase II - 41T automatic rail crane",
        vi: "Cẩu ray tự động QQCTN 41T giai đoạn II tại Cảng Thanh Đảo",
        zh: "青岛港QQCTN二期-41T自动化轨道吊",
      },
    },
    {
      file: "65a59424974c5b4bc882ce01bc6fed8a_lp.jpg",
      caption: {
        en: "Qingdao Port QQCTN Phase III - 41T automated rail crane 2",
        vi: "Cẩu ray tự động QQCTN 41T số 2, giai đoạn III tại Cảng Thanh Đảo",
        zh: "青岛港QQCTN三期-41T自动化轨道吊2",
      },
    },
    {
      file: "613c90a703d29daeb793681f2991b103_lp.jpg",
      caption: {
        en: "Qingdao Port QQCTU - 41T rail crane",
        vi: "Cẩu ray QQCTU 41T tại Cảng Thanh Đảo",
        zh: "青岛港QQCTU-41T轨道吊",
      },
    },
    {
      file: "5a5e438704d71961e0bc005efe99a452_lp.jpg",
      caption: {
        en: "Qingdao Port QQCTN Phase I - 41T automatic rail crane",
        vi: "Cẩu ray tự động QQCTN 41T giai đoạn I tại Cảng Thanh Đảo",
        zh: "青岛港QQCTN一期-41T自动化轨道吊",
      },
    },
  ],
  "tyred-crane": [
    {
      file: "f0b7a05afa6f4e3c15d53e4e55fb3737.gif",
      caption: {
        en: "Qingdao Port QQCTU automatic tyre crane",
        vi: "Cẩu bánh lốp tự động QQCTU tại Cảng Thanh Đảo",
        zh: "青岛港QQCTU-自动化轮胎吊",
      },
    },
    {
      file: "89d33b655c1bcfd0b4c5e29e50b86c7a_lp.jpg",
      caption: {
        en: "Jiangsu Zhenjiang Port - 40.5T tyre crane",
        vi: "Cẩu bánh lốp 40,5T tại Cảng Trấn Giang, Giang Tô",
        zh: "江苏镇江港-40.5T轮胎吊",
      },
    },
    {
      file: "6970047016d430f9f6cb48590e5fa9db_lp.jpg",
      caption: {
        en: "Yantai Longkou Port - 40.5T tyre crane",
        vi: "Cẩu bánh lốp 40,5T tại Cảng Long Khẩu, Yên Đài",
        zh: "烟台龙口港-40.5T轮胎吊",
      },
    },
    {
      file: "bbf72a3868e979d63937ef6935f5e719_lp.jpg",
      caption: {
        en: "Shandong Hi-Speed Weifang Port - 40.5T tyre crane",
        vi: "Cẩu bánh lốp 40,5T tại Cảng Duy Phường, Shandong Hi-Speed",
        zh: "山东高速潍坊港-40.5T轮胎吊",
      },
    },
  ],
  "portal-crane": [
    ["7944e491f330f09056626d8dcc7a61b9_lp.jpg", "Fujian Jiangyin Port - 40T43M portal crane", "Cẩu chân đế 40T43M tại Cảng Giang Âm, Phúc Kiến", "福建江阴港-40T43M门机"],
    ["7ddbc3f321cf7d5a6abf27139d484492_lp.jpg", "Jiangxi Zhangshugang - 25T25M portal crane", "Cẩu chân đế 25T25M tại Cảng Chương Thụ, Giang Tây", "江西樟树港-25T25M门机"],
    ["4e555637187070aa673240814bac12e7_lp.jpg", "Jiangsu Yangzhou Port - 40T40M portal crane", "Cẩu chân đế 40T40M tại Cảng Dương Châu, Giang Tô", "江苏扬州港-40T40M门机"],
    ["63945706d6c79b2703eb303995cea398_lp.jpg", "Russia Vladivostok - 60T45M portal crane", "Cẩu chân đế 60T45M tại Vladivostok, Nga", "俄罗斯海参崴-60T45M门机"],
    ["2168d86c21587ba4d950b98a84ac3b8b_lp.jpg", "Jiangsu Zhenjiang Port - 40T40T portal crane", "Cẩu chân đế 40T40T tại Cảng Trấn Giang, Giang Tô", "江苏镇江港-40T40T门机"],
    ["3342a75ed56be700aec700fff1351606.gif", "Automatic portal crane", "Cẩu chân đế tự động", "自动化门机"],
    ["08aa27ea475dcbbaf51687216dc1e48d_lp.jpg", "Qingdao Port Datang - 40T40M portal crane", "Cẩu chân đế 40T40M tại Đại Đường, Cảng Thanh Đảo", "青岛港大唐-40T40M门机"],
    ["33761b62910b20238320256ca3098837_lp.jpg", "Qingdao Port Dongfen - 40T40M portal crane", "Cẩu chân đế 40T40M tại Dongfen, Cảng Thanh Đảo", "青岛港董分-40T40M门机"],
    ["64bbdad5c0ab1eba2f9419732c40142d_lp.jpg", "Qingdao Port Dongjiakou Huaneng - 40T40M portal crane", "Cẩu chân đế 40T40M tại Huaneng Dongjiakou, Cảng Thanh Đảo", "青岛港董家口华能-40T40M门机"],
    ["b22a26a2b3b55c9d3253aa3d7a268974_lp.jpg", "Taixing Xinpu Chemical - 25T38M portal crane", "Cẩu chân đế 25T38M tại Xinpu Chemical, Thái Hưng", "泰兴新浦化学-25T38M门机"],
    ["17a6bae22260c9dc8daf463ed545f8f9_lp.jpg", "Qingdao Port Dagang - 45T40M portal crane", "Cẩu chân đế 45T40M tại Dagang, Cảng Thanh Đảo", "青岛港大港-45T40M门机"],
    ["0fc117591f1df320b564b18807e31aad_lp.jpg", "Qingdao Port Xilian - 40T43M portal crane", "Cẩu chân đế 40T43M tại Xilian, Cảng Thanh Đảo", "青岛港西联-40T43M门机"],
    ["8e39b6891662d820106816e77ee18d2f_lp.jpg", "Tianjin Yuanhang - 40T45M portal crane", "Cẩu chân đế 40T45M tại Yuanhang, Thiên Tân", "天津远航-40T45M门机"],
    ["82637bb82632b997eec8a832ef8ba69a_lp.jpg", "Tianjin Coal Terminal - 40T45M portal crane", "Cẩu chân đế 40T45M tại Bến than Thiên Tân", "天津煤码头-40T45M门机"],
    ["c6edad351aec31e5bdcc170b04d6a220_lp.jpg", "Tianjin Port - 25T35M portal crane", "Cẩu chân đế 25T35M tại Cảng Thiên Tân", "天津港-25T35M门机"],
  ].map(([file, en, vi, zh]) => ({ file, caption: { en, vi, zh } })),
  aigt: [
    {
      file: "4ff480c8ca26ed3b510811b2ec978704_lp.jpg",
      caption: { en: "Qingdao Port QQCTU-AIGT", vi: "AIGT QQCTU tại Cảng Thanh Đảo", zh: "青岛港QQCTU-AIGT" },
    },
    {
      file: "65818e1932015a2086e7f311cbd6a275_lp.jpg",
      caption: { en: "Qingdao Port QQCTU-AIGT", vi: "AIGT QQCTU tại Cảng Thanh Đảo", zh: "青岛港QQCTU-AIGT" },
    },
  ],
};

const sectionText: Record<
  AppLocale,
  Record<SectionId, { title: string; paragraphs: readonly string[] }>
> = {
  en: {
    "shore-crane": {
      title: "Overhead shore container crane",
      paragraphs: [
        "The self-developed double-hoisting shore container overhead crane with the world's largest lifting capacity (80 tons), ultra-long reach (70 meters) and ultra-high lifting height (52 meters) in the world.",
        "(1) Application of heavy-duty ultra-high self-lifting quay crane hoisting system.",
        "(2) Through the structural weight reduction design, the average energy consumption of the equipment is reduced by 10%, and the single wheel pressure load of the user's terminal is reduced by 10 tons.",
        "(3) The application of the world's leading remote automatic control system, the measured average operating efficiency of a single machine is 31 natural boxes/hour.",
        "The business covers a full range of products with a lifting capacity of 80 tons and below, automatic control with a reach distance of 70 meters and below, and conventional quay cranes, which can be customized according to needs.",
      ],
    },
    "rail-crane": {
      title: "Rail-mounted container gantry crane",
      paragraphs: [
        "The self-developed fully automated container stacker crane has been applied to the third phase of Qingdao Port Automated Terminal, the first fully autonomous automated terminal produced in China, achieving three independent breakthroughs.",
        "(1) Integrate and innovate the first set of nationally produced automated electronic control system and achieve large-scale application.",
        "(2) The automatic rail crane applies the DC mobile power supply system.",
        "(3) Localization substitution of key core components.",
        "The business covers the manufacturing, installation, transformation and maintenance of products of 41 tons and below, which can be customized according to needs.",
      ],
    },
    "tyred-crane": {
      title: "Rubber-tyred container gantry crane",
      paragraphs: [
        "The self-developed products are equipped with accurate and reliable spatial positioning technology, advanced automatic control and safety protection technology, intelligent scanning technology, etc., which provide basic technical support for the precise control of automation, and realize the free and flexible switching of various operation modes such as local maintenance mode, remote control automatic operation mode, remote manual emergency operation mode, and local driver's cab operation mode.",
        "The business covers the manufacturing, installation, transformation and maintenance of products of 41 tons and below, which can be customized according to needs.",
      ],
    },
    "portal-crane": {
      title: "Multi-purpose portal crane",
      paragraphs: [
        "With A-level production license, the use of double four-link anti-sway technology, combined with physical anti-sway, electronic anti-sway technology, can replace container spreaders, hooks to achieve precise control and high safety assurance of containers, general cargo transportation, and can also use automatic control technology and 5G remote operation to achieve automation, lightweight and standardization of equipment, which can be customized according to needs.",
      ],
    },
    aigt: {
      title: "AIGT",
      paragraphs: [
        "The AIGT developed by the Land and Sea Equipment Group adopts multi-sensor fusion positioning technologies such as satellite navigation and positioning, lidar SLAM, and visual SLAM, which can share environmental information for fusion and positioning with multiple vehicles, and has autonomous driving and multi-vehicle linkage intelligence, and the intelligent driving level can reach L5 level in closed scenes, and can highly utilize the existing infrastructure of the wharf, with a small transformation, and the positioning accuracy can reach ±30mm.",
        "Compared with the AGV positioned by magnetic nails, the new generation of automatic container transporter is lighter, smarter, more energy-saving, and the cost is lower, about 70% of that of AGV. Tailored to your needs.",
      ],
    },
  },
  vi: {
    "shore-crane": {
      title: "Cẩu giàn container bờ",
      paragraphs: [
        "Cẩu giàn container bờ nâng kép do doanh nghiệp tự nghiên cứu có sức nâng thuộc hàng lớn nhất thế giới (80 tấn), tầm với siêu dài (70 m) và chiều cao nâng rất lớn (52 m).",
        "(1) Ứng dụng hệ thống nâng cẩu bờ tự nâng siêu cao, tải trọng lớn.",
        "(2) Nhờ thiết kế giảm khối lượng kết cấu, mức tiêu thụ năng lượng trung bình của thiết bị giảm 10%, đồng thời tải trọng bánh xe đơn tác động lên cầu cảng của khách hàng giảm 10 tấn.",
        "(3) Ứng dụng hệ thống điều khiển tự động từ xa tiên tiến hàng đầu thế giới; hiệu suất vận hành trung bình đo được của một máy đạt 31 container tiêu chuẩn/giờ.",
        "Danh mục sản phẩm bao phủ toàn bộ cẩu bờ thông thường và cẩu điều khiển tự động có sức nâng đến 80 tấn, tầm với đến 70 m; có thể tùy chỉnh theo nhu cầu.",
      ],
    },
    "rail-crane": {
      title: "Cẩu giàn container chạy ray",
      paragraphs: [
        "Cẩu xếp container tự động hoàn toàn do doanh nghiệp tự nghiên cứu đã được ứng dụng tại giai đoạn III của bến container tự động Cảng Thanh Đảo — bến tự động đầu tiên tại Trung Quốc được sản xuất hoàn toàn trong nước và vận hành tự chủ — qua đó đạt ba đột phá độc lập.",
        "(1) Tích hợp và đổi mới bộ hệ thống điều khiển điện tự động hóa sản xuất trong nước đầu tiên, đồng thời triển khai ở quy mô lớn.",
        "(2) Cẩu ray tự động sử dụng hệ thống cấp điện di động một chiều.",
        "(3) Nội địa hóa các linh kiện cốt lõi quan trọng.",
        "Phạm vi kinh doanh gồm chế tạo, lắp đặt, cải tạo và bảo trì sản phẩm đến 41 tấn, có thể tùy chỉnh theo nhu cầu.",
      ],
    },
    "tyred-crane": {
      title: "Cẩu giàn container bánh lốp",
      paragraphs: [
        "Sản phẩm tự nghiên cứu được trang bị công nghệ định vị không gian chính xác và tin cậy, công nghệ điều khiển tự động và bảo vệ an toàn tiên tiến, cùng công nghệ quét thông minh. Đây là nền tảng kỹ thuật cho điều khiển tự động chính xác và cho phép chuyển đổi linh hoạt giữa chế độ bảo trì tại chỗ, vận hành tự động từ xa, thao tác khẩn cấp thủ công từ xa và vận hành tại cabin lái.",
        "Phạm vi kinh doanh gồm chế tạo, lắp đặt, cải tạo và bảo trì sản phẩm đến 41 tấn, có thể tùy chỉnh theo nhu cầu.",
      ],
    },
    "portal-crane": {
      title: "Cẩu chân đế đa dụng",
      paragraphs: [
        "Sản phẩm có giấy phép sản xuất cấp A, sử dụng công nghệ chống lắc bốn khâu kép kết hợp chống lắc cơ học và điện tử. Thiết bị có thể thay đổi giữa khung nâng container và móc cẩu để vận chuyển container, hàng bách hóa với độ chính xác và an toàn cao; đồng thời ứng dụng điều khiển tự động và vận hành từ xa 5G để đạt mức tự động hóa, nhẹ hóa và tiêu chuẩn hóa, tùy chỉnh theo nhu cầu.",
      ],
    },
    aigt: {
      title: "AIGT",
      paragraphs: [
        "AIGT do Tập đoàn Thiết bị Lục Hải phát triển sử dụng công nghệ định vị hợp nhất đa cảm biến như định vị vệ tinh, LiDAR SLAM và Visual SLAM. Nhiều xe có thể chia sẻ thông tin môi trường để định vị hợp nhất, hỗ trợ lái tự động và phối hợp nhiều xe; cấp độ lái thông minh đạt L5 trong môi trường khép kín. Giải pháp tận dụng tối đa hạ tầng cầu cảng hiện có, chỉ cần cải tạo nhỏ và đạt độ chính xác định vị ±30 mm.",
        "So với AGV định vị bằng đinh từ, thế hệ xe vận chuyển container tự động mới nhẹ hơn, thông minh hơn, tiết kiệm năng lượng hơn và có chi phí chỉ khoảng 70% AGV. Có thể tùy chỉnh theo nhu cầu.",
      ],
    },
  },
  zh: {
    "shore-crane": {
      title: "桥式岸边集装箱起重机",
      paragraphs: [
        "自主研制的世界上起升量超大（80吨）、前伸距超长（70米）、起升高度超高（52米）的双起升岸边集装箱桥式起重机。",
        "（1）应用重载超高自提升式岸桥吊装系统。",
        "（2）通过结构减重设计，设备的平均能耗降低10%，为用户码头单个轮压负荷降低了10吨。",
        "（3）应用国际领先的远程自动控制系统，实测单机平均作业效率达31自然箱/小时。",
        "业务涵盖起重量80吨及以下、前伸距70米及以下自动化控制、常规岸桥全系列产品，可根据需求量身定制。",
      ],
    },
    "rail-crane": {
      title: "轨道式集装箱门式起重机",
      paragraphs: [
        "自主研制的全自动化集装箱堆垛机应用于全国首个全国产全自主自动化码头——青岛港自动化码头三期，实现三大自主突破。",
        "（1）集成创新首套全国产化自动化电控系统并实现规模化应用。",
        "（2）自动化轨道吊应用直流移动供电系统。",
        "（3）关键核心零部件的国产化替代。",
        "业务涵盖41吨及以下产品制造、安装、改造、维修，可根据需求量身定制。",
      ],
    },
    "tyred-crane": {
      title: "轮胎式集装箱门式起重机",
      paragraphs: [
        "自主研制的产品配备精确可靠的空间定位技术，先进的自动控制与安全保护技术、智能扫描技术等，为自动化的精准控制提供了基础技术保障，实现了设备本地维护模式、远控自动化作业模式、远程人工应急操作模式、本地司机室操作模式等多种作业模式的自由灵活切换。",
        "业务涵盖41吨及以下产品制造、安装、改造、维修，可根据需求量身定制。",
      ],
    },
    "portal-crane": {
      title: "多用途门座式起重机",
      paragraphs: [
        "具备A级生产许可证，使用双四连杆防摇技术，糅合物理防摇、电子防摇技术，可以更换集装箱吊具、吊钩实现集装箱、件杂货运输的精准控制和高安全性保证，还可采用自动化控制技术和5G远程操作，实现设备的自动化、轻量化和标准化，可根据需求量身定制。",
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

const localeCopy: Record<AppLocale, Omit<ContainerHandlingContent, "sections">> = {
  en: {
    title: "Container handling systems",
    description: "Customized container handling equipment and intelligent terminal solutions from Shandong Port Equipment Group.",
    productsLabel: "Products & Solutions",
    introLabel: "Solution Introduction",
    intro: "Provide a full range of customized products such as automatic bridge grab ship unloader, automatic continuous bulk cargo ship loader, automated port loading and unloading portal crane, automatic stacker/reclaimer, belt conveyor, round pipe belt conveyor, automatic loading building/transfer machine room and supporting equipment, and support digital material yard, automatic collision avoidance, one-key automatic anchoring, intelligent status management system, intelligent lubrication, automatic fire protection, intelligent lightning protection, unmanned inspection and intelligent lighting and other functions according to demand.",
    previousLabel: "Previous image",
    nextLabel: "Next image",
    galleryLabel: "Product gallery",
  },
  vi: {
    title: "Hệ thống xếp dỡ container",
    description: "Thiết bị xếp dỡ container tùy chỉnh và giải pháp cảng thông minh của Tập đoàn Thiết bị Cảng Sơn Đông.",
    productsLabel: "Sản phẩm & Giải pháp",
    introLabel: "Giới thiệu giải pháp",
    intro: "Cung cấp đầy đủ các sản phẩm tùy chỉnh gồm cẩu giàn container bờ bán tự động điều khiển từ xa, cẩu giàn container chạy ray, bánh lốp và đường sắt tự động, cẩu chân đế đa dụng tự động, xe vận chuyển container không người lái; đồng thời tích hợp theo nhu cầu các chức năng quét biên dạng tàu, nhận dạng biển số và số container, định vị xe, chống nâng nhầm xe, chống va chạm tự động, neo tự động một chạm, quản lý trạng thái thông minh, bôi trơn và chữa cháy tự động, chống sét thông minh, cổng kiểm soát và chiếu sáng thông minh.",
    previousLabel: "Ảnh trước",
    nextLabel: "Ảnh tiếp theo",
    galleryLabel: "Thư viện sản phẩm",
  },
  zh: {
    title: "集装箱装卸系统解决方案",
    description: "山东港口装备集团集装箱装卸设备与智慧码头解决方案。",
    productsLabel: "产品与解决方案",
    introLabel: "解决方案介绍",
    intro: "提供远控半自动化岸边集装箱起重机、自动化轨道式/轮胎式/铁路专用集装箱门式起重机、自动化多用途门座式起重机、无人集卡等全系列定制化产品，并根据需求配套船型扫描、车号/箱号识别、集卡定位、集卡防吊起、自动防撞、一键自动锚定、智能状态管理系统、智能润滑、自动消防、智能防雷、智慧闸口及智慧照明等功能。",
    previousLabel: "上一张图片",
    nextLabel: "下一张图片",
    galleryLabel: "产品图片",
  },
};

const sectionOrder: readonly SectionId[] = [
  "shore-crane",
  "rail-crane",
  "tyred-crane",
  "portal-crane",
  "aigt",
];

export function getContainerHandlingContent(
  locale: AppLocale,
): ContainerHandlingContent {
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

export const containerHandlingOverviewImage =
  `${assetRoot}/ac1354015046793c99baba02c284a04a.jpg`;
