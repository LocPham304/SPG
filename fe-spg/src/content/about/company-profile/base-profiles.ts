import type { HomeBaseId } from "@/data/home-bases";
import type { AppLocale } from "@/i18n/routing";

export type AboutBaseProfile = {
  title: string;
  image: string;
  paragraphs: readonly string[];
};

export type AboutBasePopupCopy = {
  closeLabel: string;
  previousLabel: string;
  nextLabel: string;
};

type AboutBaseProfiles = Record<HomeBaseId, readonly AboutBaseProfile[]>;

const images = {
  qingdao:
    "/images/public/files/image/about_introduction_img7.jpg",
  shanghai:
    "/images/uploads/allimg/20240606/d8f329ce0c53f71fd3f0913ac50c0e64.jpg",
  rizhaoMarine:
    "/images/uploads/allimg/20240125/26d5ae2492696737a55b175053a51a10.jpg",
  rizhaoShipbuilding:
    "/images/uploads/allimg/20240125/613ae91215483fbe0af04a4089efc6af.jpg",
  yantai:
    "/images/uploads/allimg/20240125/148bd14355df8df15f649f0ad14e9465.jpg",
} as const;

const en: AboutBaseProfiles = {
  qingdao: [
    {
      title: "Qingdao Port Equipment Manufacturing Co., Ltd",
      image: images.qingdao,
      paragraphs: [
        "Founded in 2020, it is located in Building 1, Floor 1, No. 58, Ganghuan Road, Shibei District, Qingdao City, Shandong Province, with a registered capital of 100 million yuan. The company has passed the ISO quality, environmental, and occupational health and safety management system certifications, and holds Class A manufacturing licenses together with installation and maintenance qualifications for a full range of container, dry bulk, and breakbulk port machinery.",
        "Its business scope includes container handling machinery, port portal cranes, continuous port loading and unloading process systems, offshore and shipbuilding cranes, steel structure manufacturing and installation, storage tank and pipeline installation, and port machinery repair and maintenance. It undertakes full-range port equipment manufacturing, port equipment and facility upgrades, and intelligent overall solutions for machinery across the entire port logistics chain.",
        "To date, the company has manufactured and delivered more than 260 portal cranes, more than 230 container cranes, and more than 40 continuous loading and unloading machines. Since 2021, it has developed and delivered two world-leading AIGTs, automated stacker cranes, reach stackers, and other new-energy mobile machinery, and has undertaken the world's leading ultra-large 8070 shore container crane.",
      ],
    },
    {
      title: "Shanghai Xiadong Lifting Equipment Technology Co., Ltd",
      image: images.shanghai,
      paragraphs: [
        "Founded in 2008 in Shanghai, one of the world's largest centers for port-crane resources, the company is formed by professionals with many years of experience in ports and cranes. It provides integrated solutions for ports, shipyards, and other lifting scenarios. Its products include shore container cranes, portal cranes, rail-mounted gantry cranes, bulk ship loaders and unloaders, bucket-wheel stacker-reclaimers, large installation gantry cranes, and shield machines. Its designs for manufacturers including ZPMC, Sany Heavy Industry, Nanjing Port Machinery, Huadian Heavy Industries, and Huacheng Heavy Industries have been exported to Europe, the Americas, Southeast Asia, the Middle East, and Russia.",
      ],
    },
  ],
  rizhao: [
    {
      title: "Rizhao Port Marine Machinery Industry Co., Ltd",
      image: images.rizhaoMarine,
      paragraphs: [
        "Founded in 2017, it is located in Rizhao Economic and Technological Development Zone, Shandong Province, with a registered capital of 500 million yuan.",
        "The company is a national high-tech enterprise, a member of the National Technical Committee for the Standardization of Continuous Handling Machinery, and home to the Shandong Engineering Research Center for Intelligent Control and Robotics.",
        "Its business covers engineering construction and design, special-equipment installation and repair, shipbuilding and ship repair, metal structures, offshore platforms, marine ranching equipment, general machinery, containers, refrigeration equipment, imports and exports, and overseas contracted projects. Serving ports, mining, power, cement, metallurgy, papermaking, offshore engineering, and other industries, it provides intelligent overall solutions for the entire port logistics chain and has the integrated capability to undertake EPC projects.",
        "The company has delivered high-quality projects including the 6,000 t/h Lanshan ore pipe-belt conveyor and the 645 mm-diameter Huaneng power-plant pipe-belt conveyor. It has manufactured and installed more than 200 kilometers of belt conveyors, built 200,000 square meters of steel-structure workshops, processed 380,000 tons of steel structures, and exported SPD-brand rollers, drums, liners, and related products to more than ten countries.",
      ],
    },
    {
      title: "Rizhao Gangda Shipbuilding Heavy Industry Co., Ltd",
      image: images.rizhaoShipbuilding,
      paragraphs: [
        "Founded in 2007 in Rizhao, Shandong, the company has a registered capital of 75 million yuan, covers 150,000 square meters, and owns fixed assets worth 210 million yuan. Its facilities include a 600-meter quay, a 30,000-ton dry dock, a 30,000-ton slipway, a 300-ton gantry crane, and a 200-ton hydraulic flatbed transporter.",
        "The company is qualified to build Class III general steel ships and Class I steel fishing vessels, and to design steel fishing vessels and offshore fishery platforms. It can build 30 ships of up to 30,000 tons and repair 30 ships of up to 200,000 tons annually, and has passed quality, environmental, occupational health and safety, CCS, GL, BV, and ABS certifications.",
        "Its business includes shipbuilding, offshore and large fishery equipment, high-end ship conversion and repair, and port machinery manufacturing. It has built and repaired many types of commercial, research, coast-guard, and offshore vessels, and developed advanced marine ranching equipment including China's first cold-water aquaculture vessel and large unattended deep-sea intelligent cages.",
      ],
    },
    {
      title: "Shangang (Shandong) Offshore Equipment Co., Ltd",
      image: images.qingdao,
      paragraphs: [
        "Established in 2023 in Lanshan District, Rizhao, the company has a registered capital of 80 million yuan and covers more than 1,000 mu. Its planned capacity includes ten 50,000-ton vessels, six vessels of 80 meters and below, and three 3,000-ton offshore modules annually, with a planned yearly output value of 3 billion yuan.",
        "The company uses integrated digital design across design, production, and management, together with precision hull, outfitting, and coating manufacture. It focuses on high-value offshore modules, deep-sea aquaculture equipment, and intelligent, environmentally friendly, new-energy ship construction and repair.",
        "The new Rizhao high-end offshore equipment industrial park forms part of Shandong Port Equipment Group's program to expand advanced manufacturing capacity, promote equipment upgrading, and contribute to the construction of a world-class port group.",
      ],
    },
  ],
  yantai: [
    {
      title: "Shandong Luhai Heavy Industry Co., Ltd",
      image: images.yantai,
      paragraphs: [
        "Founded in 2019, it is located at No. 23, Haigang Road, Zhifu District, Yantai City, Shandong Province, with a registered capital of 60 million yuan.",
        "The company is recognized as a specialized and innovative SME in Yantai and Shandong and as a national high-tech enterprise. It holds ISO and grab-product quality certifications, manufacturing and service qualifications for multiple classes of cranes, and construction qualifications for steel structures and electromechanical installation. It has obtained more than 30 invention and utility-model patents.",
        "Its business includes grabs, spreaders, passenger Ro-Ro equipment, slurry pumps, large steel structures, port equipment maintenance, mobile machinery repair, and crude-oil handling equipment services. It manufactured the world's first 800-ton underwater salvage grab, while its passenger Ro-Ro bridges and rail-mounted boarding ladders hold a leading domestic market share.",
      ],
    },
  ],
  haiyang: [
    {
      title: "Under construction",
      image: images.qingdao,
      paragraphs: ["Under construction"],
    },
  ],
  huaihai: [
    {
      title: "Under construction",
      image: images.qingdao,
      paragraphs: ["Under construction"],
    },
  ],
};

const vi: AboutBaseProfiles = {
  qingdao: [
    {
      title: "Công ty TNHH Chế tạo Thiết bị Cảng Thanh Đảo",
      image: images.qingdao,
      paragraphs: [
        "Thành lập năm 2020, công ty đặt tại Tòa nhà số 1, số 58 đường Ganghuan, quận Shibei, thành phố Thanh Đảo, tỉnh Sơn Đông, với vốn đăng ký 100 triệu nhân dân tệ. Công ty đã đạt chứng nhận hệ thống quản lý ISO về chất lượng, môi trường, an toàn và sức khỏe nghề nghiệp; đồng thời có giấy phép chế tạo cấp A cùng năng lực lắp đặt, bảo trì đầy đủ cho thiết bị cảng container, hàng rời khô và hàng tổng hợp.",
        "Phạm vi hoạt động gồm máy móc xếp dỡ container, cần trục chân đế cảng, hệ thống công nghệ bốc dỡ liên tục, cần trục công trình biển và đóng sửa tàu, chế tạo lắp đặt kết cấu thép, lắp đặt bồn bể và đường ống, sửa chữa bảo dưỡng máy cảng. Công ty đảm nhận chế tạo trọn bộ thiết bị cảng, nâng cấp cơ sở vật chất và cung cấp giải pháp thông minh tổng thể cho thiết bị trong toàn chuỗi logistics cảng.",
        "Đến nay, công ty đã chế tạo và bàn giao hơn 260 cần trục chân đế, hơn 230 cần trục container và hơn 40 thiết bị bốc dỡ liên tục. Từ năm 2021, công ty đã phát triển, bàn giao hai xe vận chuyển container tự hành AIGT đạt trình độ hàng đầu thế giới, cùng máy xếp tự động, xe nâng container và nhiều thiết bị lưu động năng lượng mới; đồng thời đảm nhận chế tạo cần trục bờ siêu lớn 8070.",
      ],
    },
    {
      title: "Công ty TNHH Công nghệ Thiết bị Nâng hạ Xiadong Thượng Hải",
      image: images.shanghai,
      paragraphs: [
        "Thành lập năm 2008 tại Thượng Hải, một trong những nơi tập trung nguồn lực cần trục cảng lớn nhất thế giới, công ty quy tụ đội ngũ chuyên gia nhiều năm kinh nghiệm trong lĩnh vực cảng và thiết bị nâng. Công ty cung cấp giải pháp tổng thể cho cảng, nhà máy đóng tàu và các ứng dụng nâng hạ khác. Danh mục sản phẩm gồm cần trục bờ container, cần trục chân đế, cổng trục chạy ray, máy bốc dỡ hàng rời, máy đánh đống–rút liệu bánh gầu, cổng trục lắp dựng cỡ lớn và máy đào hầm. Các thiết kế dành cho ZPMC, Sany, Nanjing Port Machinery, Huadian Heavy Industries và Huacheng Heavy Industries đã được xuất khẩu sang châu Âu, châu Mỹ, Đông Nam Á, Trung Đông và Nga.",
      ],
    },
  ],
  rizhao: [
    {
      title: "Công ty TNHH Công nghiệp Máy hàng hải Cảng Nhật Chiếu",
      image: images.rizhaoMarine,
      paragraphs: [
        "Thành lập năm 2017, công ty đặt tại Khu phát triển kinh tế và công nghệ Nhật Chiếu, tỉnh Sơn Đông, với vốn đăng ký 500 triệu nhân dân tệ.",
        "Đây là doanh nghiệp công nghệ cao cấp quốc gia, thành viên Ủy ban Kỹ thuật Tiêu chuẩn hóa quốc gia về máy vận chuyển liên tục và là đơn vị vận hành Trung tâm Nghiên cứu Kỹ thuật Sơn Đông về điều khiển thông minh và robot.",
        "Hoạt động của công ty bao gồm xây dựng và thiết kế công trình, lắp đặt sửa chữa thiết bị đặc chủng, đóng và sửa tàu, kết cấu kim loại, giàn công trình biển, thiết bị nuôi biển, máy móc thông dụng, container, thiết bị lạnh, xuất nhập khẩu và tổng thầu ở nước ngoài. Phục vụ các ngành cảng biển, khai khoáng, điện, xi măng, luyện kim, giấy và công trình biển, công ty cung cấp giải pháp thông minh tổng thể cho toàn chuỗi logistics cảng và có năng lực thực hiện dự án EPC.",
        "Công ty đã thực hiện các dự án tiêu biểu như băng tải ống quặng Lanshan công suất 6.000 tấn/giờ và băng tải ống đường kính 645 mm của Nhà máy điện Huaneng. Tổng khối lượng đã thực hiện gồm hơn 200 km băng tải, 200.000 m² nhà xưởng kết cấu thép và 380.000 tấn cấu kiện thép; các sản phẩm con lăn, tang và tấm lót thương hiệu SPD được xuất khẩu đến hơn mười quốc gia.",
      ],
    },
    {
      title: "Công ty TNHH Công nghiệp nặng Đóng tàu Gangda Nhật Chiếu",
      image: images.rizhaoShipbuilding,
      paragraphs: [
        "Thành lập năm 2007 tại Nhật Chiếu, Sơn Đông, công ty có vốn đăng ký 75 triệu nhân dân tệ, diện tích 150.000 m² và tài sản cố định 210 triệu nhân dân tệ. Hệ thống cơ sở vật chất gồm 600 m cầu cảng, ụ khô và đà tàu 30.000 tấn, cổng trục 300 tấn cùng xe sàn thủy lực 200 tấn.",
        "Công ty có năng lực đóng tàu thép phổ thông cấp III, tàu cá thép cấp I, thiết kế tàu cá và nền tảng thủy sản ngoài khơi. Năng lực hằng năm đạt 30 tàu đến 30.000 tấn và sửa chữa 30 tàu đến 200.000 tấn; các hệ thống đã được chứng nhận về chất lượng, môi trường, an toàn sức khỏe nghề nghiệp cùng CCS, GL, BV và ABS.",
        "Lĩnh vực kinh doanh gồm đóng tàu, thiết bị công trình biển và thủy sản quy mô lớn, hoán cải–sửa chữa tàu cao cấp và chế tạo máy cảng. Công ty đã đóng, sửa chữa nhiều loại tàu thương mại, tàu nghiên cứu, tàu cảnh sát biển và tàu công trình; đồng thời phát triển tàu nuôi thủy sản nước lạnh đầu tiên của Trung Quốc cùng các lồng nuôi biển sâu thông minh, không người trực.",
      ],
    },
    {
      title: "Công ty TNHH Thiết bị Ngoài khơi Shangang (Sơn Đông)",
      image: images.qingdao,
      paragraphs: [
        "Thành lập năm 2023 tại quận Lanshan, thành phố Nhật Chiếu, công ty có vốn đăng ký 80 triệu nhân dân tệ và diện tích hơn 1.000 mẫu. Công suất quy hoạch hằng năm gồm mười tàu 50.000 tấn, sáu tàu dài không quá 80 m và ba mô-đun công trình biển 3.000 tấn, với giá trị sản lượng dự kiến 3 tỷ nhân dân tệ.",
        "Công ty áp dụng thiết kế số tích hợp trong thiết kế, sản xuất và quản lý; triển khai chế tạo chính xác đồng bộ thân tàu, trang bị và sơn phủ. Trọng tâm là các mô-đun công trình biển giá trị cao, thiết bị nuôi biển sâu, đóng mới và sửa chữa tàu thông minh, thân thiện môi trường và sử dụng năng lượng mới.",
        "Khu công nghiệp thiết bị ngoài khơi cao cấp Nhật Chiếu là một phần trong chương trình mở rộng năng lực chế tạo tiên tiến của Tập đoàn Thiết bị Cảng Sơn Đông, thúc đẩy nâng cấp thiết bị và đóng góp vào việc xây dựng cụm cảng đẳng cấp thế giới.",
      ],
    },
  ],
  yantai: [
    {
      title: "Công ty TNHH Công nghiệp nặng Lục Hải Sơn Đông",
      image: images.yantai,
      paragraphs: [
        "Thành lập năm 2019, công ty đặt tại số 23 đường Haigang, quận Zhifu, thành phố Yên Đài, tỉnh Sơn Đông, với vốn đăng ký 60 triệu nhân dân tệ.",
        "Công ty được công nhận là doanh nghiệp vừa và nhỏ chuyên biệt, tinh gọn và đổi mới tại Yên Đài, Sơn Đông, đồng thời là doanh nghiệp công nghệ cao cấp quốc gia. Công ty có chứng nhận ISO, chứng nhận chất lượng sản phẩm gầu ngoạm, nhiều giấy phép chế tạo và dịch vụ cần trục, cùng năng lực thi công kết cấu thép và lắp đặt cơ điện; đã sở hữu hơn 30 bằng sáng chế và giải pháp hữu ích.",
        "Hoạt động kinh doanh gồm gầu ngoạm, bộ rải, thiết bị Ro-Ro hành khách, bơm bùn, kết cấu thép lớn, bảo trì thiết bị cảng, sửa chữa máy lưu động và dịch vụ thiết bị tiếp nhận dầu thô. Công ty đã chế tạo gầu trục vớt dưới nước 800 tấn đầu tiên trên thế giới; cầu dẫn Ro-Ro và thang lên tàu chạy ray giữ thị phần hàng đầu tại Trung Quốc.",
      ],
    },
  ],
  haiyang: [
    {
      title: "Đang xây dựng",
      image: images.qingdao,
      paragraphs: ["Đang xây dựng"],
    },
  ],
  huaihai: [
    {
      title: "Đang xây dựng",
      image: images.qingdao,
      paragraphs: ["Đang xây dựng"],
    },
  ],
};

const zh: AboutBaseProfiles = {
  qingdao: [
    {
      title: "山东陆海装备集团青岛有限公司",
      image: images.qingdao,
      paragraphs: [
        "成立于2020年，坐落于山东省青岛市市北区港寰路58号甲全幢层1号楼，注册资金1亿元。公司已通过ISO质量、环境、职业健康安全管理体系认证，具备集装箱、散杂货、件杂货等全系列港机产品A级制造许可与安装、维修资质。",
        "营业范围包括：集装箱装卸机械、港口门座式起重机、港口连续装卸工艺系统、海工及修造船起重机、钢结构制造安装、储罐及管道安装、港口机械维修保养等产品与服务。主要承担全系列港口设备制造、港口设备设施升级改造、港口全程物流链机械设备智能化整体解决方案等业务，打造港口装备制造产业链。",
        "截至目前，公司已有260余台门座式起重机、230余台集装箱起重机、40余台连续装卸机械等各类整机制造交付经验。2021年以来，成功研制交付了2台具有世界领先水平的集装箱无人驾驶水平运输车（AIGT）、自动化堆垛机和正面吊等新能源流动机械，并承制了世界领先的超大型8070型岸边集装箱起重机。",
      ],
    },
    {
      title: "上海霞东起重设备科技有限公司",
      image: images.shanghai,
      paragraphs: [
        "成立于2008年，坐落于全球港口起重机资源最大聚集地上海。公司由深耕港口和起重机领域多年的专业人才组成，致力于为港口、船厂及其他起重应用场景提供整体解决方案。产品覆盖岸边集装箱起重机、门座式港口起重机、轨道式龙门起重机、散货装卸船机、斗轮堆取料机、大型安装门机、龙门吊及盾构机等。目前为上海振华、三一重工、南京港机、华电重工、华澄重工等厂家设计的产品已远销欧美、东南亚、中东及俄罗斯等地区。",
      ],
    },
  ],
  rizhao: [
    {
      title: "山东陆海装备集团日照有限公司",
      image: images.rizhaoMarine,
      paragraphs: [
        "成立于2017年，坐落于山东省日照经济技术开发区，注册资金5亿元。",
        "公司是国家级高新技术企业、全国连续搬运机械标准化技术委员会委员、山东省智能控制与机器人工程研究中心。",
        "经营范围包括建设工程施工与设计、特种设备安装改造修理、船舶制造与修理、金属结构、海洋工程平台装备、海洋牧场装备、通用设备、集装箱、制冷设备及进出口业务。业务领域覆盖港口、采矿、电力、水泥、冶金、造纸、海工等行业，专业提供港口全程物流链机械设备智能化整体解决方案，并具备承接相关领域EPC项目的综合能力。",
        "公司优质承建了运力6000t/h的岚山矿石管带机和645mm管径的华能电厂管带机等项目。已制造施工皮带机200余公里，建设钢结构厂房20万平方米，制作加工钢结构件38万吨，“SPD”品牌托辊、滚筒、衬板等产品销往十余个国家。",
      ],
    },
    {
      title: "日照港达船舶重工有限公司",
      image: images.rizhaoShipbuilding,
      paragraphs: [
        "成立于2007年，坐落于山东日照上海路南、海滨五路东，注册资金7500万元，占地15万平方米，固定资产2.1亿元。拥有600米码头岸线、3万吨级干船坞、3万吨级船台、300T龙门起重机、200T液压平板车等专用设备设施。",
        "公司拥有壹级Ⅲ类钢质一般船舶和一级钢质渔船生产资质、乙级钢质渔业船舶设计资质及海洋渔业平台设计建造资质，具备年建造3万吨级及以下船舶30艘、年修理20万吨级及以下船舶30艘的能力，并通过质量、环境、职业健康安全及CCS、GL、BV、ABS认证。",
        "经营范围包括船舶建造、海工与大型渔业装备、高端船舶改装与维修、港口机械制造等。公司已建造和维修改造多类商用、科考、海警及海工船舶，并研发全国第一艘冷水团养殖工船、无人值守大型坐底式离岸智能网箱等高端渔业装备。",
      ],
    },
    {
      title: "山港（山东）海工装备有限公司",
      image: images.qingdao,
      paragraphs: [
        "2023年注册成立，位于山东省日照市岚山区，注册资本8000万元，占地面积1000余亩。具有年造5万吨级船舶10艘、80米及以下船舶6艘和3000吨级海工模块3座次的生产能力，规划年产值30亿元。",
        "公司采用设计、生产、管理一体化综合数字设计，实施壳、舾、涂一体化精度制造，形成高效、柔性制造流水线。将以高附加值海工模块、深远海养殖等高端海洋装备制造为主体，以智能、环保、新能源高附加值船舶造修为两翼，打造高端海洋装备产业园区。",
      ],
    },
  ],
  yantai: [
    {
      title: "山东陆海装备集团烟台有限公司",
      image: images.yantai,
      paragraphs: [
        "成立于2019年，坐落于山东省烟台市芝罘区海港路23号，注册资金6000万元。",
        "公司获评烟台市和山东省“专精特新”中小企业及国家高新技术企业，通过ISO质量管理体系和抓斗产品质量认证，拥有多类起重机特种设备制造、安装、维修、改造资质及钢结构、机电安装施工资质，获得发明专利和实用新型专利30余项。",
        "营业范围包括抓斗、吊具、客滚设备、渣浆泵及大型钢构制造，兼顾大型港口设备维修保养、流动机械修理、流程设备与原油接卸设备维保。公司制造完成世界首台800吨水下打捞抓斗，滚装船连接桥国内市场占有率居首。",
      ],
    },
  ],
  haiyang: [
    {
      title: "正在建设",
      image: images.qingdao,
      paragraphs: ["正在建设"],
    },
  ],
  huaihai: [
    {
      title: "正在建设",
      image: images.qingdao,
      paragraphs: ["正在建设"],
    },
  ],
};

const copy: Record<AppLocale, AboutBasePopupCopy> = {
  en: {
    closeLabel: "Close company profile",
    previousLabel: "Previous company",
    nextLabel: "Next company",
  },
  vi: {
    closeLabel: "Đóng hồ sơ công ty",
    previousLabel: "Công ty trước",
    nextLabel: "Công ty tiếp theo",
  },
  zh: {
    closeLabel: "关闭公司简介",
    previousLabel: "上一家公司",
    nextLabel: "下一家公司",
  },
};

const profiles: Record<AppLocale, AboutBaseProfiles> = { en, vi, zh };

export function getAboutBaseProfiles(locale: AppLocale) {
  return {
    profiles: profiles[locale],
    copy: copy[locale],
  };
}
