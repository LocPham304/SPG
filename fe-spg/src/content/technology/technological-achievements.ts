import type { AppLocale } from "@/i18n/routing";

export type TechnologyAchievement = {
  description: string;
  image: string;
  title: string;
};

export type TechnologyAchievementGroup = {
  id: string;
  items: readonly TechnologyAchievement[];
  title: string;
  tone?: "muted";
};

export type TechnologyAchievementsContent = {
  description: string;
  groups: readonly TechnologyAchievementGroup[];
  pageTitle: string;
  title: string;
};

const associationImages = [
  "/images/uploads/allimg/20240327/cdd4bd29d65b5be230817c1311516927.png",
  "/images/uploads/allimg/20240327/86801049822580df33ab17a4aadc8688.png",
  "/images/uploads/allimg/20240327/c2886bb3c38865eb3b7939172ae5d285.png",
  "/images/uploads/allimg/20240124/477ea246398f9907bd733b7a13666376.jpg",
  "/images/uploads/allimg/20240124/fe39921415568a9ba2bacb8ebf346b59.jpg",
  "/images/uploads/allimg/20240124/d025e29f797c63f7e5cc133c24e4246e.jpg",
  "/images/uploads/allimg/20240124/7577b8bc08be3b81017b7d58d868f36e.jpg",
  "/images/uploads/allimg/20240124/6c19d274db84930ce91a21487052adc1.jpg",
] as const;

const governmentImages = [
  "/images/uploads/allimg/20240124/5ab87a4d9489b2161e77ff6960895c0a.jpg",
  "/images/uploads/allimg/20240124/6bc3124d4d57bbd3afb765d392d79678.jpg",
  "/images/uploads/allimg/20240124/a3178ef9536690b2997bc621a93bc603.jpg",
  "/images/uploads/allimg/20240124/e89c7c06a31649ac3e2282ba87cc9937.JPG",
  "/images/uploads/allimg/20240124/abdda4c26246ecf842fe6e3c0791c7f4.jpg",
  "/images/uploads/allimg/20240124/6a99c3e177927264038ce26e12a637e2.jpg",
] as const;

function createItems(
  images: readonly string[],
  copy: readonly { description: string; title: string }[],
) {
  return copy.map((item, index) => ({ ...item, image: images[index] }));
}

const content: Record<AppLocale, TechnologyAchievementsContent> = {
  en: {
    title: "Technical Innovation",
    pageTitle: "Technological achievements",
    description:
      "Science and technology awards and recognized innovation achievements of Shandong Port Equipment Group.",
    groups: [
      {
        id: "association-awards",
        title:
          "Science and Technology Progress Award of China Port Association and Institute of Navigation",
        tone: "muted",
        items: createItems(associationImages, [
          {
            title:
              "Third Prize of Science and Technology Award of China Port Association in 2023",
            description:
              "Optimized design of high-efficiency and energy-saving 40t-40m gantry crane",
          },
          {
            title:
              "Second Prize of Science and Technology Award of China Port Association in 2023",
            description:
              "Development and application of super-large DQ120006000tph stacker-reclaimer",
          },
          {
            title:
              "Third Prize of Science and Technology Award of China Port Association in 2023",
            description:
              "R&D of green intelligent conveying system with large pipe diameter",
          },
          {
            title:
              "Second Prize of Science and Technology Award of China Port Association in 2022",
            description:
              "Marine environmental protection electric propulsion large backhoe dredger",
          },
          {
            title:
              "Second Prize of Science and Technology Award of China Port Association in 2022",
            description:
              "Development and application of unmanned intelligent horizontal transport vehicle",
          },
          {
            title:
              "Second Prize of Science and Technology Progress Award of China Institute of Navigation in 2022",
            description:
              "Development and application of ultra-large scissor rack digital quay crane",
          },
          {
            title:
              "Second Prize of Science and Technology Award of China Port Association in 2021",
            description:
              "Development and application of large-scale single-hoisting double-spreader automated quay crane based on intelligent parametric model",
          },
          {
            title:
              "Third Prize of Science and Technology Award of China Port Association in 2020",
            description:
              "LGM08 four-wheel drive inverter remote automatic electric tire crane",
          },
        ]),
      },
      {
        id: "government-awards",
        title: "Government Science and Technology Awards",
        items: createItems(governmentImages, [
          {
            title:
              "Third Prize of Qingdao Science and Technology Progress Award in 2021",
            description:
              "Research and application of fully automated intelligent pure electric tire crane on the wharf of Qingdao Port",
          },
          {
            title:
              "Third Prize of Shandong Science and Technology Progress Award in 2021",
            description:
              "Research and application of heavy-duty ultra-high self-lifting quay crane hoisting system",
          },
          {
            title:
              "2020 Excellent Product Award of Equipment Manufacturing Industry in Shandong Province",
            description:
              "Research and application of fully automated intelligent pure electric tire crane on the wharf of Qingdao Port",
          },
          {
            title:
              'Excellence Award of the 2nd "Qingjiaoke Cup" Jiaodong Five Cities Transportation Science and Technology Innovation and Application Competition',
            description:
              "Development and application of unmanned intelligent horizontal transport vehicle",
          },
          {
            title: "First Prize of Rizhao Science and Technology Award",
            description:
              "Key technologies and applications of offshore multifunctional oil spill recovery vessels",
          },
          {
            title: "Mayor's Cup Certificate",
            description: "Recognized achievement in industrial design innovation",
          },
        ]),
      },
    ],
  },
  vi: {
    title: "Đổi mới công nghệ",
    pageTitle: "Thành tựu công nghệ",
    description:
      "Các giải thưởng khoa học công nghệ và thành tựu đổi mới được công nhận của Tập đoàn Thiết bị Cảng Sơn Đông.",
    groups: [
      {
        id: "association-awards",
        title:
          "Giải thưởng Tiến bộ Khoa học và Công nghệ của Hiệp hội Cảng và Viện Hàng hải Trung Quốc",
        tone: "muted",
        items: createItems(associationImages, [
          {
            title:
              "Giải Ba Khoa học và Công nghệ của Hiệp hội Cảng Trung Quốc năm 2023",
            description:
              "Thiết kế tối ưu cần trục chân đế 40t-40m hiệu suất cao, tiết kiệm năng lượng",
          },
          {
            title:
              "Giải Nhì Khoa học và Công nghệ của Hiệp hội Cảng Trung Quốc năm 2023",
            description:
              "Nghiên cứu, phát triển và ứng dụng máy đánh đống - thu hồi siêu lớn DQ120006000tph",
          },
          {
            title:
              "Giải Ba Khoa học và Công nghệ của Hiệp hội Cảng Trung Quốc năm 2023",
            description:
              "Nghiên cứu và phát triển hệ thống vận chuyển thông minh xanh đường kính lớn",
          },
          {
            title:
              "Giải Nhì Khoa học và Công nghệ của Hiệp hội Cảng Trung Quốc năm 2022",
            description:
              "Tàu nạo vét gầu nghịch cỡ lớn dùng động lực điện, thân thiện với môi trường biển",
          },
          {
            title:
              "Giải Nhì Khoa học và Công nghệ của Hiệp hội Cảng Trung Quốc năm 2022",
            description:
              "Nghiên cứu và ứng dụng phương tiện vận chuyển ngang thông minh không người lái",
          },
          {
            title:
              "Giải Nhì Tiến bộ Khoa học và Công nghệ của Viện Hàng hải Trung Quốc năm 2022",
            description:
              "Nghiên cứu và ứng dụng cầu bờ số hóa kiểu giá cắt siêu lớn",
          },
          {
            title:
              "Giải Nhì Khoa học và Công nghệ của Hiệp hội Cảng Trung Quốc năm 2021",
            description:
              "Nghiên cứu cầu bờ tự động một cơ cấu nâng, hai bộ nâng dựa trên mô hình tham số thông minh",
          },
          {
            title:
              "Giải Ba Khoa học và Công nghệ của Hiệp hội Cảng Trung Quốc năm 2020",
            description:
              "Cần trục bánh lốp điện LGM08 dẫn động bốn bánh, biến tần và điều khiển từ xa",
          },
        ]),
      },
      {
        id: "government-awards",
        title: "Giải thưởng Khoa học và Công nghệ của Chính phủ",
        items: createItems(governmentImages, [
          {
            title:
              "Giải Ba Tiến bộ Khoa học và Công nghệ Thanh Đảo năm 2021",
            description:
              "Nghiên cứu và ứng dụng cần trục bánh lốp thuần điện thông minh, tự động hoàn toàn tại Cảng Thanh Đảo",
          },
          {
            title:
              "Giải Ba Tiến bộ Khoa học và Công nghệ Sơn Đông năm 2021",
            description:
              "Nghiên cứu và ứng dụng hệ thống nâng cầu bờ siêu cao, tải trọng lớn, tự nâng",
          },
          {
            title:
              "Giải Sản phẩm Xuất sắc ngành Chế tạo Thiết bị tỉnh Sơn Đông năm 2020",
            description:
              "Nghiên cứu và ứng dụng cần trục bánh lốp thuần điện thông minh, tự động hoàn toàn tại Cảng Thanh Đảo",
          },
          {
            title:
              "Giải Xuất sắc Cuộc thi Đổi mới và Ứng dụng Khoa học Công nghệ Giao thông năm thành phố Giao Đông lần thứ hai",
            description:
              "Nghiên cứu và ứng dụng phương tiện vận chuyển ngang thông minh không người lái",
          },
          {
            title: "Giải Nhất Khoa học và Công nghệ thành phố Nhật Chiếu",
            description:
              "Công nghệ then chốt và ứng dụng tàu thu gom dầu tràn đa chức năng ngoài khơi",
          },
          {
            title: "Chứng nhận Cúp Thị trưởng",
            description: "Thành tựu được công nhận về đổi mới thiết kế công nghiệp",
          },
        ]),
      },
    ],
  },
  zh: {
    title: "科技创新",
    pageTitle: "科技成果",
    description: "山东陆海装备集团获得的科技奖项和创新成果。",
    groups: [
      {
        id: "association-awards",
        title: "中国港口协会、航海学会科技进步奖",
        tone: "muted",
        items: createItems(associationImages, [
          {
            title: "2023年中国港口协会科学技术奖三等奖",
            description: "高效节能型40t-40m门座式起重机的优化设计",
          },
          {
            title: "2023年中国港口协会科学技术奖二等奖",
            description: "超大型 DQ120006000tph 堆取料机的研制与应用",
          },
          {
            title: "2023年中国港口协会科学技术奖三等奖",
            description: "大管径绿色智能输送系统研发",
          },
          {
            title: "2022年中国港口协会科学技术奖二等奖",
            description: "海洋环保型电力推进大型反铲挖泥船",
          },
          {
            title: "2022年中国港口协会科学技术奖二等奖",
            description: "无人驾驶智能水平运输车的研制与应用",
          },
          {
            title: "2022年中国航海学会科学技术进步奖二等奖",
            description: "超大型剪式上架数字化岸桥研制与应用",
          },
          {
            title: "2021年中国港口协会科学技术奖二等奖",
            description:
              "依托智能参数化模型设计的大型单起升双吊具自动化岸桥研制与应用",
          },
          {
            title: "2020年中国港口协会科学技术奖三等奖",
            description: "LGM08型四驱变频远程自动化电动轮胎吊",
          },
        ]),
      },
      {
        id: "government-awards",
        title: "政府科技奖项",
        items: createItems(governmentImages, [
          {
            title: "2021年青岛市科技进步三等奖",
            description: "全自动化智能型纯电动轮胎吊在青岛港码头上的研究与应用",
          },
          {
            title: "2021年山东省科技进步三等奖",
            description: "重载超高自提升式岸桥吊装系统研究与应用",
          },
          {
            title: "2020年山东省装备制造业优秀产品奖",
            description: "全自动化智能型纯电动轮胎吊在青岛港码头上的研究与应用",
          },
          {
            title: "第二届“青交科杯”胶东五市交通运输科技创新应用大赛优秀奖",
            description: "无人驾驶智能水平运输车的研制与应用",
          },
          {
            title: "日照市科学技术一等奖",
            description: "海上多功能溢油回收船关键技术与应用",
          },
          {
            title: "市长杯证书",
            description: "工业设计创新成果",
          },
        ]),
      },
    ],
  },
};

export function getTechnologyAchievementsContent(locale: AppLocale) {
  return content[locale];
}
