import type { AppLocale } from "@/i18n/routing";

export type MajorProjectItem = {
  background: string;
  image: string;
  imageHeight: number;
  imageWidth: number;
  paragraphs: readonly string[];
  subtitle?: string;
  title: string;
};

export type MajorProjectContent = {
  description: string;
  pageTitle: string;
  projects: readonly MajorProjectItem[];
  title: string;
};

const projectMedia = [
  {
    background:
      "/images/uploads/allimg/20240327/5ac2c7b4941d9e0f6d2896ee98ca3cd5.jpg",
    image:
      "/images/uploads/allimg/20240327/5a6d1006308919f306d4b9b8411c72e7.jpg",
    imageWidth: 1200,
    imageHeight: 799,
  },
  {
    background:
      "/images/public/files/image/technology_major_project_img1_bg.jpg",
    image: "/images/public/files/image/technology_major_project_img1.jpg",
    imageWidth: 707,
    imageHeight: 410,
  },
  {
    background:
      "/images/public/files/image/technology_major_project_img2_bg.jpg",
    image: "/images/public/files/image/technology_major_project_img2.jpg",
    imageWidth: 707,
    imageHeight: 410,
  },
  {
    background:
      "/images/public/files/image/technology_major_project_img3_bg.jpg",
    image: "/images/public/files/image/technology_major_project_img3.jpg",
    imageWidth: 707,
    imageHeight: 410,
  },
  {
    background:
      "/images/public/files/image/technology_major_project_img4_bg.jpg",
    image: "/images/public/files/image/technology_major_project_img4.jpg",
    imageWidth: 707,
    imageHeight: 410,
  },
  {
    background:
      "/images/uploads/allimg/20240327/4e7cffa8d5b2f355b49b8c4b1f721cb6.jpg",
    image: "/images/public/files/image/technology_achievements_img1.jpg",
    imageWidth: 961,
    imageHeight: 643,
  },
  {
    background:
      "/images/uploads/allimg/20240327/375ff81dcc84586c41e931033d9eb681.jpg",
    image: "/images/public/files/image/technology_achievements_img2.jpg",
    imageWidth: 961,
    imageHeight: 643,
  },
] as const;

function withMedia(
  copy: readonly Omit<MajorProjectItem, keyof (typeof projectMedia)[number]>[],
) {
  return copy.map((item, index) => ({ ...projectMedia[index], ...item }));
}

const content: Record<AppLocale, MajorProjectContent> = {
  en: {
    title: "Technical Innovation",
    pageTitle: "Major project",
    description:
      "Major research, development and intelligent equipment projects of Shandong Port Equipment Group.",
    projects: withMedia([
      {
        title: "Scatter to set",
        paragraphs: [
          'The "scatter-to-set" automatic process system has a 360-meter-long, 75-meter-wide process greenhouse, strip silo, automatic unloading dust removal room, underground corridor and other closed operation areas. It mainly includes five system modules: unloading, stacking, reclaiming, packing and horizontal transportation. The system achieves new breakthroughs in dust suppression, cargo-damage reduction, packing efficiency and automation, raising the port\'s green and low-carbon development level and providing an environmentally friendly, green, intelligent and fast fully automated service.',
          "The system concept is first-class in China, and most process equipment is being applied domestically for the first time. It meets customer demand for coke dry quenching without adding water, with dust suppression reaching 97%. High-precision intelligent weighing and dumping equipment and the through-type hydraulic unloading platform enable data sharing and trade delivery while avoiding secondary handling. Large-scale oil-electric hybrid low-mast straddle carriers, remote-controlled stackers, unattended automatic weighing and fully automated packing improve yard use and can save 50% of labor costs. Permanent-magnet motors improve efficiency by 30% and reduce energy consumption by 20%.",
        ],
      },
      {
        title: "Development of deep-sea intelligent cages",
        subtitle: "2020 Shandong Provincial Key R&D Plan",
        paragraphs: [
          "According to relevant research, China's aquaculture demand will exceed 65 million tons in 2027, of which marine aquaculture will account for more than 50%. In this context, the project develops large-scale deep-sea aquaculture cages.",
          "The large remote intelligent aquaculture cage is mainly used for salmon and trout. The designed water volume of a single cage is at least 75,000 m³. It provides feed storage and automatic feeding, digital monitoring and automatic control, aquaculture lighting, underwater aeration, cleaning of marine organisms attached to the net and structure, and collection and transport of mature fish.",
          "The cage also provides power, electricity, communications, firefighting, lifesaving and vessel-berthing functions. It promotes intelligent and automated aquaculture equipment, connects upstream and downstream industrial chains, and supports green, coordinated and sustainable marine fisheries.",
        ],
      },
      {
        title:
          "Development of a new type of intelligent power supply automatic rail crane",
        subtitle:
          "Key science and technology projects in the transportation industry in 2022",
        paragraphs: [
          "The new intelligent power-supply automatic rail crane is used in automated terminal yards. It integrates advanced automation control technology and uses a low-voltage power rail, enabling fully automatic unmanned operation and changing the traditional container-terminal operating model.",
          "The product combines advanced technology, energy efficiency, environmental protection, reduced safety risks and high operational reliability. Its gantry speed reaches 270 m/min and lifting speed reaches 90 m/min. It operates efficiently around the clock, meets automated-yard upgrade requirements and offers strong technical portability for smart-port development.",
        ],
      },
      {
        title:
          "Development of a new super-large 70t-70m quay crane based on a digital platform",
        subtitle: "2020 Shandong Provincial Key R&D Plan",
        paragraphs: [
          'The 70t-70m quay crane is a new super-large digital intelligent port machine. Based on digital design, it features a unique "single-hoist, scissor-frame double-spreader" structure and an advanced intelligent control system. It has a maximum lifting capacity of 70 tons, a maximum lifting height of 52 meters and an outreach of up to 70 meters, allowing it to serve the world\'s largest container ships.',
          'By integrating artificial intelligence, big data, laser scanning and an immersive control experience, the crane creates an "Internet of Everything" and "Intelligent Connection of Everything" architecture. Its equipment-centered lifecycle management platform provides one-stop management services, improves quay-crane automation and intelligence, and lays a foundation for smart ports.',
        ],
      },
      {
        title: "Application of permanent magnet technology in port equipment",
        subtitle:
          "Key science and technology projects of Shandong Provincial Department of Communications in 2023",
        paragraphs: [
          "Energy conservation, green development and environmental protection are essential to modern ports. Portal cranes and horizontal belt conveyors are major loading and unloading equipment. This project applies permanent-magnet drive technology to these machines to support the construction of a world-class smart green port.",
          "After permanent-magnet electric drums are applied to the belt conveyor drive system, reliability and energy efficiency increase substantially, the system energy-saving rate reaches at least 14%, maintenance workload falls and overall conveyor performance improves.",
          "Replacing portal-crane motors with grade-one energy-efficient permanent-magnet synchronous motors creates a smaller, more rational layout. Vector control, magnetic-pole offset and sensorless sliding-mode control broaden the frequency range and improve low-frequency efficiency and power factor. Dynamic equipment monitoring, self-diagnosis and automatic voice alarms provide effective automatic control.",
        ],
      },
      {
        title: "Electric propulsion large backhoe dredger",
        paragraphs: [
          "The marine environmental protection electric-propulsion large backhoe dredger won the second prize of the China Port Science and Technology Progress Award and was recognized among Shandong's first-set technical equipment and key core components in 2021.",
          "The project uses Weldox 960 high-strength plate for the excavator arm, marking China's first welding process for a 960 MPa yield-strength thick-plate arm. It delivers 1,370 kN digging force and can excavate soft and weathered rock with compressive strength up to 50 MPa. A depth-monitoring system displays real-time depth and calculates excavated volume, while a dynamic monitoring and adjustment system tracks tidal changes and adjusts the hydraulic spud height.",
        ],
      },
      {
        title:
          "41 ton 36.5 m fully automatic rail-mounted container gantry crane",
        paragraphs: [
          "The 41-ton/36.5-meter fully automatic rail-mounted container gantry crane uses laser ranging, thermal imaging, audio detection and intelligent sensing. It supports path prediction, automatic obstacle avoidance, spreader attitude correction, automatic container alignment, and real-time temperature and noise monitoring. Precise whole-machine positioning, visual fire protection and online health monitoring improve the rationality, reliability and stability of the complete yard workflow.",
          "The crane has a maximum lifting capacity of 41 tons and a 36.5-meter rail gauge. Automatic weighing, laser scanning, intelligent identification, positioning and automatic anchoring enable intelligent operation with unmanned container trucks. A remote-control platform supports automatic, semi-automatic and manual modes, reducing energy and labor costs while improving terminal safety and operating efficiency.",
        ],
      },
    ]),
  },
  vi: {
    title: "Đổi mới công nghệ",
    pageTitle: "Dự án trọng điểm",
    description:
      "Các dự án nghiên cứu, phát triển và thiết bị thông minh trọng điểm của Tập đoàn Thiết bị Cảng Sealand Sơn Đông.",
    projects: withMedia([
      {
        title: "Hệ thống chuyển đổi hàng rời sang hàng đóng kiện",
        paragraphs: [
          "Hệ thống quy trình tự động chuyển đổi hàng rời sang hàng đóng kiện có nhà xưởng dài 360 m, rộng 75 m, kho silo dạng dải, phòng dỡ hàng và khử bụi tự động, hành lang ngầm cùng các khu vận hành khép kín. Năm phân hệ chính gồm dỡ hàng, xếp đống, thu hồi, đóng gói và vận chuyển ngang. Hệ thống tạo đột phá về kiểm soát bụi, giảm hư hỏng hàng hóa, nâng hiệu suất đóng gói và mức độ tự động hóa, góp phần phát triển cảng xanh, ít carbon.",
          "Ý tưởng thiết kế thuộc nhóm tiên tiến hàng đầu Trung Quốc, nhiều thiết bị quy trình được ứng dụng lần đầu trong nước. Tỷ lệ khử bụi đạt 97%. Hệ thống cân và lật đổ thông minh độ chính xác cao, sàn dỡ thủy lực xuyên suốt, xe nâng khung thấp hybrid dầu–điện, máy xếp điều khiển từ xa, cân không người trực và đóng gói tự động giúp tiết kiệm 50% chi phí lao động. Động cơ nam châm vĩnh cửu nâng hiệu suất 30% và giảm 20% năng lượng tiêu thụ.",
        ],
      },
      {
        title: "Phát triển lồng nuôi biển sâu thông minh",
        subtitle: "Kế hoạch R&D trọng điểm tỉnh Sơn Đông năm 2020",
        paragraphs: [
          "Theo các nghiên cứu liên quan, nhu cầu nuôi trồng thủy sản của Trung Quốc sẽ vượt 65 triệu tấn vào năm 2027, trong đó nuôi biển chiếm hơn 50%. Trong bối cảnh đó, dự án tập trung phát triển lồng nuôi quy mô lớn ở vùng biển sâu và xa bờ.",
          "Lồng nuôi thông minh điều khiển từ xa chủ yếu phục vụ cá hồi và cá hồi vân, với thể tích nước thiết kế của mỗi lồng không dưới 75.000 m³. Hệ thống tích hợp lưu trữ và cho ăn tự động, giám sát số, điều khiển tự động, chiếu sáng nuôi trồng, bổ sung khí dưới nước, làm sạch sinh vật bám và thu gom, vận chuyển cá trưởng thành.",
          "Lồng còn đảm nhiệm cấp động lực, điện, thông tin liên lạc, phòng cháy chữa cháy, cứu sinh và neo đậu tàu. Dự án thúc đẩy thiết bị nuôi trồng tự động, liên kết chuỗi công nghiệp thượng nguồn–hạ nguồn và phát triển nghề cá biển theo hướng xanh, đồng bộ, bền vững.",
        ],
      },
      {
        title: "Phát triển cần trục ray tự động cấp điện thông minh thế hệ mới",
        subtitle:
          "Dự án khoa học công nghệ trọng điểm ngành giao thông năm 2022",
        paragraphs: [
          "Cần trục ray tự động cấp điện thông minh được sử dụng tại bãi container tự động. Thiết bị tích hợp công nghệ điều khiển tự động tiên tiến và sử dụng ray cấp điện hạ áp, cho phép vận hành tự động hoàn toàn không người lái, thay đổi phương thức khai thác container truyền thống.",
          "Sản phẩm có công nghệ tiên tiến, tiết kiệm năng lượng, thân thiện môi trường, giảm nguy cơ mất an toàn và có độ tin cậy cao. Tốc độ di chuyển đạt 270 m/phút, tốc độ nâng đạt 90 m/phút, có thể vận hành liên tục 24 giờ, đáp ứng tốt yêu cầu nâng cấp bãi tự động và có khả năng chuyển giao công nghệ cao cho cảng thông minh.",
        ],
      },
      {
        title: "Phát triển cần trục bờ siêu lớn 70t-70m trên nền tảng số",
        subtitle: "Kế hoạch R&D trọng điểm tỉnh Sơn Đông năm 2020",
        paragraphs: [
          "Cần trục bờ 70t-70m là thiết bị cảng thông minh số hóa siêu lớn, được thiết kế hoàn toàn trên nền tảng số, sử dụng kết cấu độc đáo “một cơ cấu nâng – khung cắt hai bộ nâng” và hệ điều khiển thông minh tiên tiến. Sức nâng tối đa đạt 70 tấn, chiều cao nâng 52 m và tầm với 70 m, đủ khả năng xếp dỡ các tàu container lớn nhất thế giới.",
          "Việc tích hợp AI, dữ liệu lớn, quét laser và trải nghiệm điều khiển nhập vai tạo nên kiến trúc kết nối vạn vật. Nền tảng quản lý vòng đời lấy thiết bị làm trung tâm cung cấp dịch vụ quản lý một cửa, nâng cao mức tự động hóa và thông minh của cần trục bờ, tạo nền móng cho cảng thông minh.",
        ],
      },
      {
        title: "Ứng dụng công nghệ nam châm vĩnh cửu trong thiết bị cảng",
        subtitle:
          "Dự án khoa học công nghệ trọng điểm Sở Giao thông Sơn Đông năm 2023",
        paragraphs: [
          "Tiết kiệm năng lượng, phát triển xanh và bảo vệ môi trường là yêu cầu thiết yếu của cảng hiện đại. Dự án nghiên cứu ứng dụng truyền động nam châm vĩnh cửu cho cần trục chân đế và băng tải vận chuyển ngang, góp phần xây dựng cảng xanh thông minh đẳng cấp thế giới.",
          "Khi hệ truyền động băng tải dùng tang điện nam châm vĩnh cửu, độ tin cậy và hiệu suất năng lượng tăng rõ rệt, tỷ lệ tiết kiệm năng lượng đạt từ 14%, khối lượng bảo trì giảm và hiệu năng tổng thể được cải thiện.",
          "Động cơ đồng bộ nam châm vĩnh cửu hiệu suất cấp một giúp thiết bị nhỏ gọn và bố trí hợp lý hơn. Điều khiển vector, bù lệch cực từ và điều khiển trượt không cảm biến mở rộng dải tần, tăng hiệu suất ở tốc độ thấp. Hệ thống giám sát động, tự chẩn đoán và cảnh báo bằng giọng nói hỗ trợ điều khiển tự động hiệu quả.",
        ],
      },
      {
        title: "Tàu nạo vét gầu nghịch cỡ lớn chạy điện",
        paragraphs: [
          "Dự án tàu nạo vét gầu nghịch cỡ lớn chạy điện, thân thiện môi trường biển đã giành Giải Nhì Tiến bộ Khoa học và Công nghệ Cảng Trung Quốc, đồng thời được công nhận là thiết bị kỹ thuật bộ đầu tiên và linh kiện cốt lõi trọng điểm của Sơn Đông năm 2021.",
          "Cần đào sử dụng thép cường độ cao Weldox 960, lần đầu áp dụng tại Trung Quốc quy trình hàn thép tấm dày có giới hạn chảy 960 MPa. Lực đào đạt 1.370 kN, đáp ứng đá mềm và đá phong hóa có cường độ nén đến 50 MPa. Hệ thống giám sát độ sâu hiển thị dữ liệu thời gian thực, tính toán khối lượng bùn; hệ giám sát động theo dõi thủy triều và điều chỉnh chiều cao cọc thép thủy lực.",
        ],
      },
      {
        title:
          "Cần trục giàn container chạy ray tự động 41 tấn, khẩu độ 36,5 m",
        paragraphs: [
          "Cần trục sử dụng đo khoảng cách laser, ảnh nhiệt, nhận dạng âm thanh và cảm biến thông minh để dự báo đường đi, tránh chướng ngại vật, hiệu chỉnh tư thế bộ nâng, căn chỉnh container tự động, đồng thời giám sát nhiệt độ và tiếng ồn theo thời gian thực. Định vị chính xác toàn máy, trực quan hóa phòng cháy và giám sát sức khỏe trực tuyến nâng cao độ hợp lý, tin cậy và ổn định của toàn quy trình.",
          "Thiết bị có sức nâng tối đa 41 tấn, khẩu độ ray 36,5 m; tích hợp cân tự động, quét laser, nhận dạng thông minh, định vị và neo tự động. Thiết bị phối hợp với xe container không người lái, hỗ trợ chế độ tự động hoàn toàn, bán tự động và thủ công, qua đó giảm năng lượng, nhân công và nâng cao an toàn, hiệu suất khai thác cảng.",
        ],
      },
    ]),
  },
  zh: {
    title: "科技创新",
    pageTitle: "重点项目",
    description: "山东陆海装备集团重点研发与智能装备项目。",
    projects: withMedia([
      {
        title: "散改集",
        paragraphs: [
          "“散改集”自动化工艺系统拥有长360米、宽75米的工艺大棚，以及条形料仓、自动卸料除尘间、地下廊道等封闭作业区域，主要包括卸料、堆料、取料、装箱和水平运输五大系统模块，在强化抑尘、降低货损、提高装箱效率和自动化水平等方面实现新突破，提升港口绿色低碳发展水平。",
          "系统设计理念达到国内一流水平，多数工艺设备为国内首次应用，抑尘率高达97%。高精度智能称重翻车系统和贯通式液压卸车平台可实现数据共享和贸易交付，避免二次倒运；油电混合低门架跨运车、远程控制堆料机、无人值守自动称重及全自动装箱系统可节省50%人工成本；永磁电机使效率提升30%，能耗降低20%。",
        ],
      },
      {
        title: "深远海智能网箱的研制",
        subtitle: "2020年山东省重点研发计划",
        paragraphs: [
          "据相关研究，2027年我国水产养殖需求将超过6500万吨，其中海水养殖将达到50%以上。本项目在此背景下开展深远海大型养殖网箱研制。",
          "大型远程智能化养殖网箱主要用于鲑鳟鱼类养殖，单个网箱设计养殖水体不低于7.5万m³。网箱具备鱼饲料存储与自动投喂、数字化监测和自动管控、养殖光控、水下补气等功能，同时兼顾网衣及结构附着海生物清理、成鱼收集输送等需求。",
          "网箱还具备动力、电力、通信、消防救生、船舶靠泊等平台功能，将推动养殖装备智能化与自动化，带动上下游产业链汇聚发展，推动海洋渔业向绿色、协调、可持续方向发展。",
        ],
      },
      {
        title: "新型智慧供电自动化轨道吊研制",
        subtitle: "2022年度交通运输行业重点科技项目",
        paragraphs: [
          "新型智慧供电自动化轨道吊用于码头自动化堆场，融合先进自动化控制技术，采用低压供电轨供电，可实现全自动无人驾驶，彻底改变传统集装箱码头作业方式。",
          "产品具有技术先进、节能环保、降低安全隐患、作业可靠性高等特点。设备大车速度270米/分钟，起升速度90米/分钟，可全天候24小时作业，契合自动化堆场升级需求，技术可移植性强，对智慧港口发展具有重要意义。",
        ],
      },
      {
        title: "基于数字化平台的全新超大型70t-70m岸桥的研制",
        subtitle: "2020年山东省重点研发计划",
        paragraphs: [
          "70t-70m岸桥是全新超大型数字化智能港机装备，整机基于数字化设计，拥有独特的“单起升—剪式上架双吊具结构”和先进智能控制系统。最大起重量70吨，最大起升高度52米，前伸距可达70米，可装卸世界上最大的集装箱船。",
          "人工智能、大数据、激光扫描技术与沉浸式操控体验相融合，构建“万物互联、万物智联”的网络架构。以设备为核心的全生命周期智能管控平台提供一站式管理服务，提高岸桥自动化、智能化水平，为建设智慧港口奠定基础。",
        ],
      },
      {
        title: "永磁技术在港口装备中的应用",
        subtitle: "2023年度山东省交通运输厅重点科技项目",
        paragraphs: [
          "节能、绿色、环保是当前港口发展的必要元素。项目研究将永磁驱动技术用于港口门座式起重机和水平运输皮带机，助力世界一流智慧绿色港建设。",
          "皮带输送机拖动系统采用永磁电动滚筒后，可靠性和系统能效大幅提高，系统节能率不低于14%，维护工作量显著减少，提升皮带输送机整体性能。",
          "门座式起重机改用一级能效永磁同步电机后，体积更小、空间布置更合理。矢量控制、磁极偏移法、无传感滑模控制等技术拓宽变频范围，提高低频效率和功率因数；配合运行动态监测、自诊断和语音报警，实现有效自动控制。",
        ],
      },
      {
        title: "海洋环保型电力推进大型反铲挖泥船",
        paragraphs: [
          "海洋环保型电力推进大型反铲挖泥船项目获得中国港口协会科技进步奖二等奖，并入选2021年山东省首台（套）技术装备及关键核心零部件。",
          "项目采用Weldox 960高强板材制作挖臂，为国内首次采用屈服强度960MPa厚板挖臂焊接工艺，最大挖掘力达到1370kN，可开挖抗压强度50MPa及以下软岩和风化岩。挖深监测系统实时显示深度并计算泥方量，动态监控调整系统实时显示潮差变化并调整液压钢桩高度。",
        ],
      },
      {
        title: "41吨36.5米全自动轨道式集装箱龙门起重机",
        paragraphs: [
          "设备采用激光测距、热成像、音频检测、智能感知等技术，实现路径预判、自动避障、吊具姿态矫正、自动对箱及温度噪声实时监测。整机精准定位、消防可视化和在线健康监控提升了全流程的合理性、可靠性和稳定性。",
          "整机最大起重量41吨，轨距36.5米，配备自动称重、激光扫描、智能识别、定位和自动锚定等功能，可与堆场无人集卡协同智能作业。远程操作台具备全自动、半自动和手动功能，降低能耗和人工成本，提高码头安全性和作业效率。",
        ],
      },
    ]),
  },
};

export function getMajorProjectContent(locale: AppLocale) {
  return content[locale];
}
