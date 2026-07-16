import type { AppLocale } from "@/i18n/routing";

import type { ContainerHandlingGalleryItem } from "./container-handling";

type OtherServicesSectionId =
  | "grabs"
  | "container-spreaders"
  | "environmental-hoppers"
  | "industrial-pumps"
  | "boarding-ladders"
  | "passenger-ro-ro-bridges"
  | "idlers-and-rollers"
  | "dust-free-cleaners"
  | "electric-bulk-handler"
  | "technical-transformation-maintenance"
  | "smart-lighting";

type LocalizedText = Record<AppLocale, string>;

type GalleryAsset = {
  file: string;
  caption: LocalizedText;
};

export type OtherServicesContent = {
  title: string;
  description: string;
  productsLabel: string;
  intro: string;
  previousLabel: string;
  nextLabel: string;
  galleryLabel: string;
  sections: readonly {
    id: OtherServicesSectionId;
    title: string;
    paragraphs: readonly string[];
    images: readonly ContainerHandlingGalleryItem[];
  }[];
};

function asset(
  file: string,
  en: string,
  vi: string,
  zh: string,
  folder = "20240531",
): GalleryAsset {
  return {
    file: `/images/uploads/allimg/${folder}/${file}_lp.jpg`,
    caption: { en, vi, zh },
  };
}

const galleryAssets: Record<OtherServicesSectionId, readonly GalleryAsset[]> = {
  grabs: [
    asset("60d6b8d1eea3701cf44f6dfc2f0b9413", "40-ton ore grab", "Gầu ngoạm quặng 40 tấn", "40吨矿石抓斗"),
    asset("3af0d502a5d02b85cd2fb40ddc3c17b1", "World's first and largest 800T underwater salvage grab", "Gầu trục vớt dưới nước 800T đầu tiên và lớn nhất thế giới", "全球首创、世界最大的800T水下打捞抓斗"),
    asset("98b151c72906778a04467ce3dab327d1", "40-ton coal grab", "Gầu ngoạm than 40 tấn", "40吨煤炭抓斗"),
    asset("226758563f6fcedffff84c32eac4b18c", "Double-jaw grab", "Gầu ngoạm hai má", "双颚抓斗"),
    asset("b6ff6628798bdb25e2ce650953677615", "Multi-lobe grab", "Gầu ngoạm nhiều cánh", "多瓣抓斗"),
    asset("dcddadacba5070521cd3dcf29eb65bc6", "Section-steel grab", "Gầu kẹp thép hình", "型材抓斗"),
  ],
  "container-spreaders": [
    asset("d0395f2b5f11cce14b732cd784a37b4e", "Container spreader on the rack", "Khung nâng container trên giá", "集装箱吊具上架"),
    asset("5b121aca12526a0f4e0a387ad234d9de", "Container spreaders", "Khung nâng container", "集装箱吊具"),
    asset("b2dd0873563e6f827967da420812c671", "Twin-container hydraulic spreader", "Khung nâng thủy lực hai container", "双箱液压吊具"),
    asset("8408c1bf2668281e4032d625c0426e5a", "Simple spreader", "Khung nâng đơn giản", "简易吊具"),
  ],
  "environmental-hoppers": [
    asset("d1e3ed0ac4a969b739350ae63f977201", "Large hopper", "Phễu lớn", "大漏斗"),
    asset("1045e1f4a2e279500d883b14668fe0e8", "Dust-removal hopper", "Phễu khử bụi", "除尘料斗"),
    asset("f0ac9178404d26c2f7c9842958479aa3", "Bulk-cargo hopper", "Phễu hàng rời", "散货料斗"),
    asset("27643e2ad6f5476428035688ccbd4c8f", "Laizhou Port - intelligent dust-removal hopper", "Cảng Lai Châu - Phễu khử bụi thông minh", "莱州港-智能除尘料斗"),
    asset("ec340b043ab5ff47dc49695ac509036a", "Environmentally friendly intelligent dust-removal hopper", "Phễu khử bụi thông minh thân thiện môi trường", "环保智能除尘大漏斗"),
    asset("82b3646fc7aae84d3e572f909a73875e", "Rizhao Port - large mobile hopper", "Cảng Nhật Chiếu - Phễu di động cỡ lớn", "日照港-大型移动料斗"),
    asset("7ed42a1d233c8076fb8ab50db493c560", "Large bulk-cargo hopper", "Phễu lớn cho hàng rời", "散货大料斗"),
  ],
  "industrial-pumps": [
    asset("112a6e03f3f7af18a82414f5120a5b1b", "Slurry pumps", "Bơm bùn", "渣浆泵"),
    asset("aef7657998f7658aa13f3ad27bf7e307", "Industrial pumps", "Bơm công nghiệp", "工业泵"),
  ],
  "boarding-ladders": [
    asset("bd9713b028b9f8f48f24020b01ce7593", "Double-deck boarding ladder", "Cầu thang lên tàu hai tầng", "双层登船梯"),
    asset("d4121aaa7d7cb409bd359df8e06e9ec3", "Rail-mounted boarding ladder", "Cầu thang lên tàu chạy ray", "轨道式登船梯"),
    asset("3106ed6c696046fca7826c0475ff2c9c", "Weihai International Passenger Terminal - rail-mounted boarding ladder", "Trung tâm Hành khách Quốc tế Uy Hải - Cầu thang lên tàu chạy ray", "威海港国际客运中心-轨道式登船梯"),
  ],
  "passenger-ro-ro-bridges": [
    asset("757910dec3291f477bdfa9190f4aa4e6", "Yantai Penglai Port - 150-ton passenger Ro-Ro bridge", "Cảng Bồng Lai, Yên Đài - Cầu Ro-Ro hành khách 150 tấn", "烟台蓬莱港-150吨客滚桥"),
    asset("f39cb47e9e2e168e429edc8251420bdc", "Yantai Port - passenger Ro-Ro bridge", "Cảng Yên Đài - Cầu Ro-Ro hành khách", "烟台港-客滚桥"),
    asset("6c7b43de1c33a1a2bc553d3b599b00fb", "Weihai Port - dual-use automatic lifting passenger Ro-Ro bridge", "Cảng Uy Hải - Cầu Ro-Ro hành khách nâng tự động lưỡng dụng", "威海港-军民两用自动升降客滚桥"),
    asset("8a9ac503f6383fd67d03cce6eeded5bb", "Zhejiang - multi-purpose typhoon-resistant passenger Ro-Ro bridge", "Chiết Giang - Cầu Ro-Ro hành khách đa dụng chống bão", "浙江-多用途防台客滚桥"),
    asset("380c45375c29dfb9cb257cd057897528", "Zhoushan, Zhejiang - four-column hydraulic typhoon-resistant passenger Ro-Ro bridge", "Chu Sơn, Chiết Giang - Cầu Ro-Ro thủy lực bốn cột chống bão", "浙江舟山-四柱液压防台客滚桥"),
  ],
  "idlers-and-rollers": [
    asset("b3c836e8323f22ced2122b2ff6e96534", "Rollers exported to Germany", "Con lăn xuất khẩu sang Đức", "出口德国托辊"),
    asset("a549e8113b7d8e5d370a0933f661c6ef", "Idlers", "Con lăn đỡ", "托辊"),
    asset("17f9d04884a8975d7e258a84473796fe", "Caofeidian Port idlers", "Con lăn đỡ Cảng Caofeidian", "曹妃甸港托辊"),
    asset("a089143b7f6be5d6d1caf000dca58119", "Drum", "Tang băng tải", "滚筒"),
    asset("87a75871760392f9cb653a89ab82d48c", "Drum", "Tang băng tải", "滚筒"),
    asset("f798ecd9c669f3e12b8d576307319819", "Zhenjiang Port idlers", "Con lăn đỡ Cảng Trấn Giang", "镇江港托辊"),
    asset("a78de083da58597293daf821392c3851", "CPI Mengdong Energy idlers", "Con lăn đỡ CPI Mengdong Energy", "中电投蒙东能源托辊"),
    asset("6c9b0afe6e71eb6f6c9d0c08840d3a70", "Idlers", "Con lăn đỡ", "托辊"),
  ],
  "dust-free-cleaners": [
    asset("b9606383e83df7f273a3c1a42a2d7685", "Dust-free cleaner - yellow", "Máy quét không bụi - màu vàng", "无尘清扫器-黄", "20240603"),
    asset("ec723f7de3b2edfa221e6443b8e7edbb", "Dust-free cleaner - green", "Máy quét không bụi - màu xanh", "无尘清扫器-绿", "20240603"),
  ],
  "electric-bulk-handler": [
    asset("f03e639ac08748dc27c909a36c99b112", "Weifang Port - electric bulk-material stacker", "Cảng Duy Phường - Máy xếp vật liệu rời chạy điện", "潍坊港-电动散料堆高机", "20240603"),
  ],
  "technical-transformation-maintenance": [
    asset("2c7e2bdb34381ea3ee3afc25f277b025", "Mobile-equipment refurbishment", "Tân trang thiết bị di động", "流机翻新"),
    asset("c058110695c4fddaaa5f0b37671e961b", "Complete portal-crane relocation by modular transporter", "Di dời nguyên bộ cẩu chân đế bằng xe mô-đun", "轴线车陆运整机门机搬迁"),
    asset("df467e97f69058dc492de29b9e55100a", "Quay-crane relocation", "Di dời cẩu bờ", "岸桥迁移"),
    asset("4a2a0ffd674955ebb97147841ad8bc3e", "Inspection, scrapping, dismantling and disposal of large port machinery", "Kiểm định, loại bỏ, tháo dỡ và xử lý máy móc cảng cỡ lớn", "大型港口机械检测、报废、拆解、处置"),
    asset("d0a36217dd69a49c8fc1ceafd906b55a", "Electrical retrofit", "Cải tạo điện", "电气改造"),
    asset("58c4d92e99bcdaeabf6ec7ad53ce0667", "Spreader repair", "Sửa chữa khung nâng", "吊具维修"),
    asset("6645b2708ea03bf5319f799e2ad5fb52", "CST specialized repair", "Sửa chữa chuyên biệt CST", "CST特色维修"),
    asset("8f4e9b8b9ee9a5a5b0d1069c780bad9d", "Electrical retrofit", "Cải tạo điện", "电气改造"),
    asset("00c505a1f2444100f1fb4bb98b283f7d", "Electrical retrofit", "Cải tạo điện", "电气改造"),
    asset("b9e79ab14c86895ce6daacc0e149563b", "Rizhao Port - complete relocation of 11 portal cranes", "Cảng Nhật Chiếu - Di dời nguyên bộ 11 cẩu chân đế", "日照港-11台门机整体迁移"),
    asset("6432dbdd26cf673f5eafebe76b161dc9", "Complete gantry-crane coating", "Sơn phủ toàn bộ cẩu giàn", "龙门吊整机涂装"),
    asset("a79cf3d5c3622e4defe117d2300b5b85", "Qingdao Dagang Port - portal-crane spreader maintenance completed in 2.5 hours", "Cảng Đại Cảng Thanh Đảo - Bảo trì khung nâng cẩu chân đế trong 2,5 giờ", "青岛港大港-2.5小时完成门机吊具停机维修"),
    asset("2e1fc48adc074001645f988082624370", "Equipment maintenance", "Bảo trì thiết bị", "设备维保"),
    asset("adfb30009254a7d5ba85486236b6502c", "Emergency equipment repair", "Sửa chữa khẩn cấp thiết bị", "设备抢修"),
    asset("167c041652f1a66579ad3c39a72a33ea", "Equipment inspection", "Kiểm định thiết bị", "设备检测"),
    asset("d32508ee4b52a82f47db25e132aaedb3", "Weihai Port - 6 kV to 10 kV electrical retrofit and cable-reel replacement for two portal cranes in two days", "Cảng Uy Hải - Cải tạo điện 6 kV lên 10 kV và thay tang cáp cho hai cẩu chân đế trong hai ngày", "威海港-2天2台门机高压6kV改10kV电气改造及电缆卷盘拆除与安装"),
    asset("01c386a638d0cb0a8ba27d5a11d754e8", "Weihai Port - rail-crane automation retrofit", "Cảng Uy Hải - Cải tạo tự động hóa cẩu ray", "威海港-轨道吊自动化改造"),
    asset("bb8514a5de1964cc6cef7b3dce59aa46", "Weifang Port - anti-corrosion work on 31 portal cranes and two quay cranes", "Cảng Duy Phường - Chống ăn mòn cho 31 cẩu chân đế và hai cẩu bờ", "潍坊港-31台门机、2台岸桥防腐"),
    asset("d46821bc4b6426b65ce7b7c77d8d18eb", "Excavator repair", "Sửa chữa máy xúc", "挖掘机维修"),
    asset("d6c9e0c48bf8e0b4b8aa27b915a8927b", "Weihai Rushan Port - portal-crane maintenance", "Cảng Nhũ Sơn, Uy Hải - Bảo trì cẩu chân đế", "威海港乳山-门机维修"),
  ],
  "smart-lighting": [
    asset("5fc1ec058ff99bdfcfbf95456a779272", "Rizhao Port", "Cảng Nhật Chiếu", "日照港"),
    asset("bda1e562548b7e63263fd0dada3027c4", "Qingdao Port", "Cảng Thanh Đảo", "青岛港"),
    asset("6e7240785063850fd1a4912e93a0c6a0", "Yantai Port", "Cảng Yên Đài", "烟台港"),
  ],
};

const sectionText: Record<
  AppLocale,
  Record<OtherServicesSectionId, { title: string; paragraphs: readonly string[] }>
> = {
  en: {
    grabs: {
      title: "Grabs",
      paragraphs: ["Suitable for loading and unloading bulk cargo such as grain, coal and cement, as well as materials such as scrap steel and ore. The range includes double-jaw leak-proof grabs, multi-lobe grabs, large-tonnage special grabs, timber grabs, electro-hydraulic grabs, section-steel grippers and dredging grabs, plus the world's first 500-ton and 800-ton underwater salvage grabs."],
    },
    "container-spreaders": {
      title: "Container spreaders",
      paragraphs: ["In cooperation with BROMMA, the business covers complete spreader manufacturing, assembly, maintenance, spare-parts processing and sales, including automated rack-mounted spreaders, 20/40-foot semi-automatic simple spreaders, single and twin spreaders, and rotating spreaders."],
    },
    "environmental-hoppers": {
      title: "Dust-free and environmentally friendly hoppers",
      paragraphs: ["Intelligent, efficient, environmentally friendly, energy-saving, safe and durable. The range includes bagging, blending, belt-line and portal-crane common-rail hoppers. Capacity reaches 600 tons per hour with dust-removal efficiency up to 98%. Intelligent energy-saving control reduces consumption by more than 70%, saving approximately RMB 1.1 million per year."],
    },
    "industrial-pumps": {
      title: "Industrial pumps",
      paragraphs: ["LZ(Y) two-casing slurry pumps use advanced hydraulic design and wear-resistant flow components for high efficiency, low energy consumption, low noise, easy maintenance and long service life. Horizontal or vertical, single-stage, single-suction centrifugal configurations cover flows of 7–3,000 m³/h and heads of 10–125 m, conveying slurry up to 30% by volume or 60% by weight."],
    },
    "boarding-ladders": {
      title: "Boarding ladders",
      paragraphs: ["Single-deck, double-deck and enclosed-channel boarding ladders can be customized for different terminals, vessel types and climates. Intelligent linkage allows the floating ladder to follow vessel movement automatically, removing overlap hazards and providing a comfortable boarding experience at passenger Ro-Ro terminals."],
    },
    "passenger-ro-ro-bridges": {
      title: "Passenger Ro-Ro connecting bridges",
      paragraphs: ["These bridges connect terminals with large passenger Ro-Ro vessels for vehicle traffic, with capacities from 50 to 150 tons. The latest intelligent models provide a wide deck and long travel, run and lock automatically, and support rapid embarkation of oversized military equipment and vehicles at different tide levels."],
    },
    "idlers-and-rollers": {
      title: "Idlers and roller products",
      paragraphs: ["The SPD range includes more than 40 products across five series, including trough, comb, spiral and impact idlers. Fully automated production capacity exceeds 600,000 units per year, serving customers such as CCCC, Shanghai Zhenhua, Changshu Longteng, thyssenkrupp and TAKRAF, with exports to 23 countries and regions."],
    },
    "dust-free-cleaners": {
      title: "Dust-free cleaners",
      paragraphs: ["GWQ dust-free cleaners address bulk-cargo dust in port areas, uneven-site cleaning, reversing safety and mixed dry/wet conditions. They save more than 80% compared with traditional wet cleaning, fit a variety of port machinery, and are simple to maintain and durable."],
    },
    "electric-bulk-handler": {
      title: "Electric bulk conveyor handler",
      paragraphs: ["Designed for bulk terminals, warehousing and logistics, the system automates general dry-bulk handling, reducing labor costs and comprehensive energy consumption by more than 70%. Throughput ranges from 100 to 2,000 TPH, with high stacking, rapid on-site assembly, easy transport, automated operation and green electric control."],
    },
    "technical-transformation-maintenance": {
      title: "Technical transformation and maintenance",
      paragraphs: ["Services cover remote, semi-automatic and automated equipment retrofits; local repair, dismantling, complete relocation, lifting and coating of large port equipment and bulk-material conveying systems; and on-site or workshop overhaul of mobile machinery. Loader and excavator remanufacturing restores used equipment to like-new appearance and performance, saving around 50% in cost, 60% in energy and 70% in raw materials."],
    },
    "smart-lighting": {
      title: "Smart lighting system",
      paragraphs: ["The intelligent lighting-control system uses visual recognition, motion detection, IoT and cloud computing for remote control, automatic dimming, fault alarms and energy analysis. It can reduce electricity consumption by up to 60% while lowering manual operating costs through automatic intervention and management alerts."],
    },
  },
  vi: {
    grabs: {
      title: "Gầu ngoạm",
      paragraphs: ["Dùng để bốc dỡ hàng rời như ngũ cốc, than, xi măng và vật liệu như thép phế liệu, quặng. Danh mục gồm gầu hai má chống rò, gầu nhiều cánh, gầu chuyên dụng tải trọng lớn, gầu gỗ, gầu điện thủy lực, kẹp thép hình, gầu nạo vét cùng gầu trục vớt dưới nước 500 tấn và 800 tấn đầu tiên trên thế giới."],
    },
    "container-spreaders": {
      title: "Khung nâng container",
      paragraphs: ["Hợp tác với BROMMA, doanh nghiệp cung cấp dịch vụ chế tạo, lắp ráp, bảo trì, gia công phụ tùng và kinh doanh khung nâng hoàn chỉnh, gồm khung nâng tự động trên giá, khung nâng bán tự động 20/40 feet, khung nâng đơn, khung nâng đôi và khung nâng xoay."],
    },
    "environmental-hoppers": {
      title: "Phễu không bụi, thân thiện môi trường",
      paragraphs: ["Sản phẩm thông minh, hiệu quả, tiết kiệm năng lượng, an toàn và bền bỉ; gồm phễu đóng bao, phễu phối trộn, phễu cấp băng tải và phễu dùng chung ray với cẩu chân đế. Công suất đạt 600 tấn/giờ, hiệu suất khử bụi tới 98%; điều khiển tiết kiệm điện giúp giảm hơn 70% năng lượng, tương đương khoảng 1,1 triệu nhân dân tệ mỗi năm."],
    },
    "industrial-pumps": {
      title: "Bơm công nghiệp",
      paragraphs: ["Bơm bùn hai vỏ LZ(Y) sử dụng thiết kế thủy lực tiên tiến và vật liệu chịu mài mòn, mang lại hiệu suất cao, tiêu thụ năng lượng thấp, ít tiếng ồn, dễ bảo trì và tuổi thọ dài. Cấu hình ngang hoặc đứng, ly tâm một cấp một cửa hút có lưu lượng 7–3.000 m³/giờ, cột áp 10–125 m, vận chuyển bùn có nồng độ tối đa 30% theo thể tích hoặc 60% theo khối lượng."],
    },
    "boarding-ladders": {
      title: "Cầu thang lên tàu",
      paragraphs: ["Các dòng một tầng, hai tầng và hành lang kín được tùy chỉnh theo từng bến cảng, loại tàu và điều kiện khí hậu. Công nghệ liên kết thông minh giúp cầu nổi tự động theo chuyển động của tàu, loại bỏ rủi ro tại điểm tiếp giáp và mang lại trải nghiệm lên xuống tàu thoải mái."],
    },
    "passenger-ro-ro-bridges": {
      title: "Cầu kết nối Ro-Ro hành khách",
      paragraphs: ["Cầu kết nối bến cảng với tàu Ro-Ro hành khách cỡ lớn để phương tiện lưu thông, tải trọng từ 50 đến 150 tấn. Thế hệ thông minh có mặt cầu rộng, hành trình lớn, tự động vận hành và khóa, đáp ứng việc đưa thiết bị quân sự quá khổ và phương tiện lên xuống tàu nhanh chóng ở nhiều mực thủy triều."],
    },
    "idlers-and-rollers": {
      title: "Con lăn đỡ và tang băng tải",
      paragraphs: ["Dòng SPD gồm hơn 40 sản phẩm thuộc năm nhóm như con lăn lòng máng, con lăn lược, con lăn xoắn và con lăn giảm chấn. Dây chuyền tự động đạt trên 600.000 sản phẩm mỗi năm, cung cấp cho CCCC, Shanghai Zhenhua, Changshu Longteng, thyssenkrupp và TAKRAF, đồng thời xuất khẩu tới 23 quốc gia và vùng lãnh thổ."],
    },
    "dust-free-cleaners": {
      title: "Máy quét không bụi",
      paragraphs: ["Máy quét không bụi GWQ xử lý bụi hàng rời trong khu cảng, làm sạch mặt bằng không bằng phẳng, tăng an toàn khi lùi và phù hợp cả nền khô lẫn nền ướt. Sản phẩm tiết kiệm hơn 80% chi phí so với phương pháp rửa ướt truyền thống, tương thích nhiều loại máy cảng và dễ bảo trì."],
    },
    "electric-bulk-handler": {
      title: "Máy xếp và vận chuyển hàng rời chạy điện",
      paragraphs: ["Thiết bị dành cho bến hàng rời, kho bãi và logistics, tự động hóa toàn bộ quy trình hàng rời khô phổ thông, giảm hơn 70% chi phí nhân công và năng lượng. Năng suất 100–2.000 TPH, phù hợp xếp cao, lắp ráp nhanh tại hiện trường, dễ vận chuyển, vận hành tự động và điều khiển điện thân thiện môi trường."],
    },
    "technical-transformation-maintenance": {
      title: "Cải tạo kỹ thuật và bảo trì",
      paragraphs: ["Dịch vụ gồm cải tạo thiết bị từ xa, bán tự động và tự động; sửa chữa cục bộ, tháo dỡ, di dời nguyên bộ, nâng hạ và sơn phủ thiết bị cảng lớn cùng hệ thống vận chuyển hàng rời; sửa chữa tại hiện trường hoặc đại tu máy di động. Tái sản xuất máy xúc lật và máy đào giúp thiết bị cũ đạt ngoại hình và chất lượng như mới, tiết kiệm khoảng 50% chi phí, 60% năng lượng và 70% nguyên liệu."],
    },
    "smart-lighting": {
      title: "Hệ thống chiếu sáng thông minh",
      paragraphs: ["Hệ thống điều khiển chiếu sáng dùng nhận dạng hình ảnh, phát hiện chuyển động, IoT và điện toán đám mây để điều khiển từ xa, tự động giảm độ sáng, cảnh báo lỗi và phân tích năng lượng. Mức tiết kiệm điện đạt tới 60%, đồng thời giảm chi phí vận hành thủ công bằng cơ chế can thiệp và cảnh báo tự động."],
    },
  },
  zh: {
    grabs: { title: "抓斗", paragraphs: ["可用于装卸粮食、煤炭、水泥等散货及废钢、矿石等物料，适用于港口起重机、大型门机、桥式卸船机和抓斗行车等场景。产品包括双颚防漏抓斗、多瓣抓斗、大吨位专用抓斗、木材抓斗、电动液压抓斗、型钢抱抓具、疏浚抓斗，以及世界首创的500吨和800吨水下打捞抓斗。"] },
    "container-spreaders": { title: "集装箱吊具", paragraphs: ["与集装箱吊具行业巨头BROMMA合作发展吊具业务，涵盖吊具整机制造、组装、维修、备件加工及销售，包括自动化吊具上架、20尺和40尺半自动简易吊具、单双吊具及旋转吊具。"] },
    "environmental-hoppers": { title: "无尘环保料斗", paragraphs: ["产品智能、高效、环保、节能、安全、耐用，已形成灌包料斗、混配料斗、皮带线料斗、门机共轨料斗等系列。每小时可完成600吨卸船装车，除尘率可达98%；智能节电控制可使能耗下降70%以上，年节省成本约110万元。"] },
    "industrial-pumps": { title: "工业泵", paragraphs: ["LZ(Y)系列两箱流渣浆泵采用先进水力理论和特殊耐磨过流部件，具有效率高、耗能低、噪声小、维修安装方便和寿命长等特点。卧式或立式单级单吸离心配置流量为7–3000m³/h、扬程为10–125m，可输送最大体积浓度30%或最大重量浓度60%的浆体。"] },
    "boarding-ladders": { title: "登船梯", paragraphs: ["已形成单层、双层、封闭通道式系列产品，可针对不同码头、船型和气候条件定制。智能联动技术使浮动梯自动跟随船舶浮动，消除搭接安全隐患，为大型客滚船旅客提供舒适的上下船体验。"] },
    "passenger-ro-ro-bridges": { title: "客滚连接桥", paragraphs: ["客滚连接桥用于码头与大型客滚船舶连接，供车辆通行，载重量为50至150吨。最新智能连接桥宽阔、行程大，可自动运行锁定，满足超重军事装备和车辆在不同潮汐条件下快速登陆登舰。"] },
    "idlers-and-rollers": { title: "托辊、滚筒产品", paragraphs: ["陆海装备集团SPD品牌系列托辊包含槽型、梳型、螺旋和缓冲托辊等五大系列40余种类别。全自动生产线年产能力超过60万支，长期服务中交、上海振华、常熟龙腾、蒂森克虏伯、塔克拉夫等客户，产品远销23个国家和地区。"] },
    "dust-free-cleaners": { title: "无尘清扫器", paragraphs: ["GWQ无尘清扫器专门解决港区散货扬尘、场地不平整清扫难、倒车清扫不安全及干湿场地不兼容等问题。相比传统湿法清扫节约成本80%以上，可适配多种港口机械，维护简单耐用。"] },
    "electric-bulk-handler": { title: "电动散货输送堆高机", paragraphs: ["用于散货码头、仓储物流等领域，实现通用干散货码头全流程自动化，人工成本和综合能耗成本均降低70%以上。堆存率可达100至2000TPH，适用于高层堆垛，可现场快速组装、便捷运输、自动操作并采用绿色电动控制。"] },
    "technical-transformation-maintenance": { title: "技改维修", paragraphs: ["业务涵盖设备远程、半自动和自动化改造；大型港口设备及散料输送系统的局部修理、拆解、整体迁移、吊装、涂装，以及流动机械现场维修和进厂大修。装载机、挖掘机再制造可使旧设备外观、性能和质量达到或超过新品，实现节约成本50%、能源60%和原材料70%。"] },
    "smart-lighting": { title: "智慧照明系统", paragraphs: ["陆海装备集团研发的智能灯控系统通过视觉识别、移动侦测、物联网和云计算技术，实现远程管控、自动降低照度、故障报警和能耗分析。应用后节电率高达60%，并通过自动干预或提醒大幅减少人工操作成本。"] },
  },
};

const localeCopy: Record<AppLocale, Omit<OtherServicesContent, "sections">> = {
  en: {
    title: "Other products and services",
    description: "Specialized port accessories, industrial equipment, intelligent systems, technical retrofits and maintenance services.",
    productsLabel: "Products & Solutions",
    intro: "",
    previousLabel: "Previous image",
    nextLabel: "Next image",
    galleryLabel: "Product gallery",
  },
  vi: {
    title: "Sản phẩm và dịch vụ khác",
    description: "Phụ kiện cảng chuyên dụng, thiết bị công nghiệp, hệ thống thông minh cùng dịch vụ cải tạo kỹ thuật và bảo trì.",
    productsLabel: "Sản phẩm & Giải pháp",
    intro: "",
    previousLabel: "Ảnh trước",
    nextLabel: "Ảnh tiếp theo",
    galleryLabel: "Thư viện sản phẩm",
  },
  zh: {
    title: "其他产品及服务",
    description: "提供港口专用属具、工业设备、智能系统以及技术改造和维修服务。",
    productsLabel: "产品与解决方案",
    intro: "",
    previousLabel: "上一张图片",
    nextLabel: "下一张图片",
    galleryLabel: "产品图片",
  },
};

const sectionOrder: readonly OtherServicesSectionId[] = [
  "grabs",
  "container-spreaders",
  "environmental-hoppers",
  "industrial-pumps",
  "boarding-ladders",
  "passenger-ro-ro-bridges",
  "idlers-and-rollers",
  "dust-free-cleaners",
  "electric-bulk-handler",
  "technical-transformation-maintenance",
  "smart-lighting",
];

export function getOtherServicesContent(locale: AppLocale): OtherServicesContent {
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

export const otherServicesOverviewImage =
  "/images/uploads/allimg/20240731/f3fe8458aa28fa26c5f9263afe45946f.jpg";
