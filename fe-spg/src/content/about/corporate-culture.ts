import type { AppLocale } from "@/i18n/routing";

export type CultureItem = {
  label?: string;
  paragraphs: readonly string[];
};

export type CultureSection = {
  title: string;
  items: readonly CultureItem[];
};

export type CultureGroup = {
  id: "port-group" | "equipment-group";
  label: string;
  sections: readonly CultureSection[];
};

const corporateCultureEn: readonly CultureGroup[] = [
  {
    id: "port-group",
    label: "Shandong Port Group",
    sections: [
      {
        title: "Core Values",
        items: [
          {
            paragraphs: [
              "One heart and one mind, loyalty and dedication, innovation and development, the pursuit of excellence.",
            ],
          },
        ],
      },
      {
        title: "Development strategy",
        items: [
          {
            label: "Development Mission",
            paragraphs: [
              "Serve the national development strategy, serve the high-quality development of Shandong, and serve customers and employees.",
            ],
          },
          {
            label: "Development Mission",
            paragraphs: [
              "To build an international shipping hub center in Northeast Asia with the world's leading smart green port, logistics hub port, financial and trade port, industry-city integration port, and cruise cultural tourism port as the carrier.",
            ],
          },
          {
            label: "Development goals",
            paragraphs: [
              "By 2025: A new breakthrough will be made in the construction of an international shipping hub in Northeast Asia. Transformation and development to achieve a new leap. The scale and strength have been newly improved. New growth in economic benefits. The investment ratio has been newly optimized.",
              "By 2035, the status of Northeast Asia as an international shipping hub will be more stable, and the construction of smart green port, logistics hub port, financial and trade port, industry-city integration port, and cruise cultural tourism port will fully achieve international leadership, and the group company will become a world-renowned integrated supply chain service provider.",
            ],
          },
          {
            label: "Development concept",
            paragraphs: ["Innovative, coordinated, green, open and shared."],
          },
          {
            label: "Development strategy",
            paragraphs: [
              "Closely follow the efficient development of the main business of the port, rely on the advantages of the port to amplify the development, and jump out of the port for innovative development.",
            ],
          },
          {
            label: "Principles of development",
            paragraphs: [
              "Focus on the main business, performance is king, efficiency first, safety first.",
            ],
          },
          {
            label: "Development ideas",
            paragraphs: [
              "Internal: overall development, coordinated development, and characteristic development. That is, to coordinate traditional business and emerging business, and form a good development situation of coordinated development, each with its own advantages and distinctive characteristics.",
              'Externally: "three more". That is, the relationship with local party committees and governments is closer, the degree of integration into local economic and social development is more in-depth, and the contribution to local economic growth is more prominent.',
            ],
          },
          {
            label: "Development path",
            paragraphs: [
              'East and west two-way mutual aid, land and sea linkage at home and abroad. "Five transformations" development.',
            ],
          },
          {
            label: "Development pattern",
            paragraphs: [
              "With Qingdao Port as the leader, Rizhao Port and Yantai Port as the two wings, Bohai Bay Port as the extension, various plate groups as the support, and many inland ports as the support, the integrated and coordinated development pattern is based on many inland ports.",
            ],
          },
          {
            label: "Development Vision",
            paragraphs: [
              "It is a world-class marine port with four seas and land connections, and a world-class marine port with a good reputation and a global reputation.",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "equipment-group",
    label: "Shandong Port Equipment Group",
    sections: [
      {
        title: "Equip the Iron Army Spirit",
        items: [
          {
            label: "Overall performance",
            paragraphs: ["Strict discipline, hard style, excellent performance"],
          },
          {
            label: "Spiritual level",
            paragraphs: [
              "He is particularly able to endure hardships, fight, and dedication",
            ],
          },
          {
            label: "Outward manifestation",
            paragraphs: [
              "When called, it can fight, and if it is called, it will win",
            ],
          },
          {
            label: "Individual employees",
            paragraphs: [
              "Belief is like iron, discipline is like iron, and execution is like iron",
            ],
          },
        ],
      },
      {
        title: "corporate culture",
        items: [
          {
            label: "Quality concept",
            paragraphs: [
              "Quality first, do it well at one time, process control, and keep improving",
            ],
          },
          {
            label: "Safety concept",
            paragraphs: [
              "Safety first, everyone is responsible, strict management is love, and sharing peace",
              "Prevention first, focus on the scene, solid foundation, long-term work",
            ],
          },
          {
            label: "Business philosophy",
            paragraphs: [
              "Good quality, excellent price, service in place, timely payment",
            ],
          },
          {
            label: "Performance concept",
            paragraphs: [
              "Sincerity, letter to the far-reaching, do not delay, promise never to break the word, implementation to win respect.",
            ],
          },
          {
            label: "Production management",
            paragraphs: [
              "Careful preparation, scientific co-ordination, optimization process, lean production",
            ],
          },
          {
            label: "Money management",
            paragraphs: ["Cash is king, risk controllable, and strong protection"],
          },
          {
            label: "Technical concept",
            paragraphs: [
              "Technology-led, integrated innovation, smart green, independent and controllable",
            ],
          },
          {
            label: "Norms of daily conduct",
            paragraphs: [
              "Self-disciplined, sunny and tasteful",
              "United, tense, serious, lively.",
              "Dedication, passion, perseverance, unity and cooperation, and courage to strive for first-class.",
              "Strict, true, detailed, solid and fast",
            ],
          },
        ],
      },
    ],
  },
];

const corporateCultureVi: readonly CultureGroup[] = [
  {
    id: "port-group",
    label: "Tập đoàn Cảng Sơn Đông",
    sections: [
      {
        title: "Giá trị cốt lõi",
        items: [
          {
            paragraphs: [
              "Đồng tâm đồng lòng, trung thành cống hiến, đổi mới khai phá, theo đuổi sự xuất sắc.",
            ],
          },
        ],
      },
      {
        title: "Chiến lược phát triển",
        items: [
          {
            label: "Sứ mệnh phát triển",
            paragraphs: [
              "Phục vụ chiến lược phát triển quốc gia, phục vụ sự phát triển chất lượng cao của Sơn Đông, phục vụ khách hàng và người lao động.",
            ],
          },
          {
            label: "Định vị phát triển",
            paragraphs: [
              "Xây dựng trung tâm đầu mối vận tải biển quốc tế Đông Bắc Á, lấy cảng xanh thông minh hàng đầu quốc tế, cảng đầu mối logistics, cảng tài chính thương mại, cảng tích hợp đô thị - công nghiệp và cảng du lịch văn hóa tàu biển làm nền tảng.",
            ],
          },
          {
            label: "Mục tiêu phát triển",
            paragraphs: [
              "Đến năm 2025: Tạo bước đột phá mới trong xây dựng trung tâm đầu mối vận tải biển quốc tế Đông Bắc Á. Chuyển đổi và phát triển đạt bước tiến mới. Quy mô và năng lực được nâng tầm. Hiệu quả kinh tế tăng trưởng mới. Cơ cấu đầu tư được tối ưu hơn.",
              "Đến năm 2035: Vị thế trung tâm đầu mối vận tải biển quốc tế Đông Bắc Á được củng cố vững chắc hơn; việc xây dựng cảng xanh thông minh, cảng đầu mối logistics, cảng tài chính thương mại, cảng tích hợp đô thị - công nghiệp và cảng du lịch văn hóa tàu biển đạt trình độ dẫn đầu quốc tế; tập đoàn trở thành nhà cung cấp dịch vụ chuỗi cung ứng tổng hợp nổi tiếng thế giới.",
            ],
          },
          {
            label: "Triết lý phát triển",
            paragraphs: ["Đổi mới, phối hợp, xanh, mở và chia sẻ."],
          },
          {
            label: "Chiến lược phát triển",
            paragraphs: [
              "Bám sát hoạt động kinh doanh cốt lõi của cảng để phát triển hiệu quả, dựa vào lợi thế cảng để mở rộng phát triển và vượt khỏi khuôn khổ cảng để đổi mới phát triển.",
            ],
          },
          {
            label: "Nguyên tắc phát triển",
            paragraphs: [
              "Tập trung vào ngành nghề cốt lõi, lấy hiệu quả làm thước đo, ưu tiên năng suất và đặt an toàn lên hàng đầu.",
            ],
          },
          {
            label: "Tư duy phát triển",
            paragraphs: [
              "Đối nội: Phát triển tổng thể, phát triển phối hợp và phát triển có bản sắc. Tức là phối hợp giữa hoạt động truyền thống và hoạt động mới nổi, tạo nên cục diện phát triển đồng bộ, mỗi lĩnh vực có lợi thế riêng và bản sắc rõ nét.",
              "Đối ngoại: “Ba hơn nữa”. Tức là quan hệ với cấp ủy và chính quyền địa phương chặt chẽ hơn, mức độ hòa nhập vào phát triển kinh tế - xã hội địa phương sâu rộng hơn và đóng góp cho tăng trưởng kinh tế địa phương nổi bật hơn.",
            ],
          },
          {
            label: "Lộ trình phát triển",
            paragraphs: [
              "Tương trợ hai chiều Đông - Tây, liên kết đất liền và biển trong nước lẫn quốc tế. Phát triển theo “năm chuyển đổi”.",
            ],
          },
          {
            label: "Cục diện phát triển",
            paragraphs: [
              "Lấy Cảng Thanh Đảo làm đầu tàu, Cảng Nhật Chiếu và Cảng Yên Đài làm hai cánh, Cảng Vịnh Bột Hải làm phần mở rộng, các tập đoàn ngành làm trụ đỡ và nhiều cảng nội địa làm nền tảng để hình thành cục diện phát triển tích hợp, phối hợp.",
            ],
          },
          {
            label: "Tầm nhìn phát triển",
            paragraphs: [
              "Trở thành cảng biển đẳng cấp thế giới kết nối bốn biển, liên thông tám hướng trên đất liền, có danh tiếng rộng khắp và tỏa sáng toàn cầu.",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "equipment-group",
    label: "Tập đoàn Thiết bị Lục Hải Sơn Đông",
    sections: [
      {
        title: "Tinh thần đội quân thép ngành thiết bị",
        items: [
          {
            label: "Biểu hiện tổng thể",
            paragraphs: ["Kỷ luật nghiêm, tác phong vững, thành tích xuất sắc"],
          },
          {
            label: "Phương diện tinh thần",
            paragraphs: [
              "Đặc biệt chịu được gian khổ, đặc biệt giỏi chiến đấu, đặc biệt tận tâm cống hiến",
            ],
          },
          {
            label: "Biểu hiện bên ngoài",
            paragraphs: ["Triệu là đến, đến là chiến đấu, chiến là thắng"],
          },
          {
            label: "Mỗi người lao động",
            paragraphs: [
              "Niềm tin như sắt, kỷ luật như sắt, thực thi như sắt",
            ],
          },
        ],
      },
      {
        title: "Văn hóa doanh nghiệp",
        items: [
          {
            label: "Triết lý chất lượng",
            paragraphs: [
              "Chất lượng là trên hết, làm đúng ngay từ đầu, kiểm soát quá trình và không ngừng hoàn thiện",
            ],
          },
          {
            label: "Triết lý an toàn",
            paragraphs: [
              "An toàn là trên hết, mọi người đều có trách nhiệm, quản lý nghiêm là yêu thương, cùng chia sẻ bình an",
              "Phòng ngừa là chính, chú trọng hiện trường, nền tảng vững chắc, kiên trì lâu dài",
            ],
          },
          {
            label: "Triết lý kinh doanh",
            paragraphs: [
              "Chất lượng tốt, giá cả tối ưu, dịch vụ chu đáo, thanh toán đúng hạn",
            ],
          },
          {
            label: "Triết lý thực hiện cam kết",
            paragraphs: [
              "Lấy chân thành dựng nghiệp, lấy chữ tín vươn xa; không trì hoãn tiến độ, tuyệt đối giữ lời hứa và dùng năng lực thực thi để giành được sự tôn trọng",
            ],
          },
          {
            label: "Quản lý sản xuất",
            paragraphs: [
              "Chuẩn bị chu đáo, điều phối khoa học, tối ưu quy trình, sản xuất tinh gọn",
            ],
          },
          {
            label: "Quản lý vốn",
            paragraphs: [
              "Tiền mặt là vua, rủi ro trong tầm kiểm soát, bảo đảm vững chắc",
            ],
          },
          {
            label: "Triết lý công nghệ",
            paragraphs: [
              "Công nghệ dẫn dắt, đổi mới tích hợp, thông minh xanh, tự chủ và kiểm soát được",
            ],
          },
          {
            label: "Chuẩn mực hành vi hằng ngày",
            paragraphs: [
              "Tự giác, tích cực, có phẩm chất",
              "Đoàn kết, khẩn trương, nghiêm túc, sinh động.",
              "Yêu nghề tận tâm, tràn đầy nhiệt huyết, kiên trì vượt khó, đoàn kết hợp tác, dũng cảm vươn lên hàng đầu.",
              "Nghiêm, thật, kỹ, chắc, nhanh",
            ],
          },
        ],
      },
    ],
  },
];

const corporateCultureZh: readonly CultureGroup[] = [
  {
    id: "port-group",
    label: "山东港口集团",
    sections: [
      {
        title: "核心价值观",
        items: [
          {
            paragraphs: ["同心同德、忠诚奉献、创新开拓、追求卓越。"],
          },
        ],
      },
      {
        title: "发展战略",
        items: [
          {
            label: "发展使命",
            paragraphs: [
              "服务国家发展战略，服务山东高质量发展，服务客户和员工。",
            ],
          },
          {
            label: "发展定位",
            paragraphs: [
              "建设以国际领先的智慧绿色港、物流枢纽港、金融贸易港、产城融合港、邮轮文旅港为载体的东北亚国际航运枢纽中心。",
            ],
          },
          {
            label: "发展目标",
            paragraphs: [
              "到2025年：东北亚国际航运枢纽中心建设实现新突破。转型发展实现新跨越。规模实力实现新提升。经济效益实现新增长。投资比例实现新优化。",
              "到2035年：东北亚国际航运枢纽中心地位更加稳固，智慧绿色港、物流枢纽港、金融贸易港、产城融合港、邮轮文旅港建设全面实现国际领先，集团公司成为世界知名的供应链综合服务商。",
            ],
          },
          {
            label: "发展理念",
            paragraphs: ["创新、协调、绿色、开放、共享。"],
          },
          {
            label: "发展策略",
            paragraphs: [
              "紧扣港口主业高效发展，依托港口优势放大发展，跳出港口窠臼创新发展。",
            ],
          },
          {
            label: "发展原则",
            paragraphs: ["聚焦主业、业绩为王、效率为先、安全第一。"],
          },
          {
            label: "发展思路",
            paragraphs: [
              "对内：统筹发展、协同发展、特色发展。即统筹传统业务和新兴业务，形成协同发展、各有优势、特色鲜明的良好发展局面。",
              "对外：“三个更加”。即与地方党委政府的关系更加密切，融入地方经济社会发展的程度更加深入，助力地方经济增长的贡献更加突出。",
            ],
          },
          {
            label: "发展路径",
            paragraphs: ["东西双向互济，陆海内外联动。“五个转型”发展。"],
          },
          {
            label: "发展格局",
            paragraphs: [
              "以青岛港为龙头，日照港、烟台港为两翼，渤海湾港为延展，各板块集团为支撑，众多内陆港为依托的一体化协同发展格局。",
            ],
          },
          {
            label: "发展愿景",
            paragraphs: [
              "港通四海、陆联八方、口碑天下、辉映全球的世界一流的海洋港口。",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "equipment-group",
    label: "山东陆海装备集团",
    sections: [
      {
        title: "装备铁军精神",
        items: [
          {
            label: "总体表现",
            paragraphs: ["纪律严、作风硬、业绩优"],
          },
          {
            label: "精神层面",
            paragraphs: ["特别能吃苦、特别能战斗、特别能奉献"],
          },
          {
            label: "外在表现",
            paragraphs: ["召之即来、来之能战、战则必胜"],
          },
          {
            label: "员工个体",
            paragraphs: ["信念如铁、纪律如铁、执行如铁"],
          },
        ],
      },
      {
        title: "企业文化",
        items: [
          {
            label: "质量理念",
            paragraphs: ["质量至上、一次做好、过程控制、精益求精"],
          },
          {
            label: "安全理念",
            paragraphs: [
              "安全第一、人人尽责、严管是爱、共享平安",
              "预防为主、重在现场、基础扎实、久久为功",
            ],
          },
          {
            label: "经营理念",
            paragraphs: ["质量好、价格优、服务到位、支付及时"],
          },
          {
            label: "履约理念",
            paragraphs: [
              "诚立业、信致远、不拖期承诺绝不食言，执行赢得尊重",
            ],
          },
          {
            label: "生产管理",
            paragraphs: ["周密准备、科学统筹、优化流程、精益生产"],
          },
          {
            label: "资金管理",
            paragraphs: ["现金为王、风险可控、保障有力"],
          },
          {
            label: "技术理念",
            paragraphs: ["科技引领、集成创新、智慧绿色、自主可控"],
          },
          {
            label: "日常行为规范",
            paragraphs: [
              "自律、阳光、有品位",
              "团结、紧张、严肃、活泼。",
              "爱岗敬业、充满激情、百折不挠，团结协作、勇争一流。",
              "严、真、细、实、快",
            ],
          },
        ],
      },
    ],
  },
];

const corporateCultureByLocale: Record<
  AppLocale,
  readonly CultureGroup[]
> = {
  en: corporateCultureEn,
  vi: corporateCultureVi,
  zh: corporateCultureZh,
};

export function getCorporateCultureGroups(locale: AppLocale) {
  return corporateCultureByLocale[locale];
}
