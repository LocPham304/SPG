import type { AppLocale } from "@/i18n/routing";
import type { NewsArticleDetail } from "@/types/news";

type GroupNewsSourceArticle = {
  date: string;
  title: string;
  description: string;
  href: string;
  image: string;
};

export type GroupNewsArticle = GroupNewsSourceArticle &
  NewsArticleDetail & {
    id: string;
  };

const englishArticles: readonly GroupNewsSourceArticle[] = [
  {
    date: "2024-03-27",
    title:
      "Shandong Port Equipment Group held the third meeting of the first member congress of the trade union and the third meeting of the first staff congress",
    description:
      "On March 12, Shandong Port Equipment Group Co., Ltd. held the third meeting of the first member representatives of the trade union and the third meeting of the first staff congress. A total of 46 official representatives and 4 non-voting representatives from the four delegations of the group headquarters and various units shouldered the mission, attended the conference, and conscientiously performed the sacred duties of the representatives.",
    href: "https://mp.weixin.qq.com/s/ztUroMt_W9juzUTGXZBu5g",
    image:
      "/images/uploads/allimg/20240327/fa5dac667886c1444f255fab25674193.jpg",
  },
  {
    date: "2024-02-18",
    title:
      'Shandong Port Equipment Group will carry out the "first lesson" activity of resumption of work and safety production after the Spring Festival in 2024',
    description:
      'In order to ensure the continued stability of the safety production situation after the Spring Festival, in accordance with the requirements of the Provincial Government Safety Committee Office and the deployment arrangement of the Party Committee of Shandong Port Group, on the morning of February 18, Chen Jikang, Deputy Secretary of the Party Committee and General Manager of Shandong Port Equipment Group, gave a lecture on the "first lesson of starting work" for resumption of work and production after the Spring Festival in 2024, strengthening the safety precautions for resumption of work and production, further strengthening safety awareness, implementing safety measures, and ensuring the safety and stability of the production of the Equipment Group.',
    href: "https://mp.weixin.qq.com/s/h2I-ehQhejDk7UB1NjrDcA",
    image:
      "/images/uploads/allimg/20240327/d544e92d9fa1cc3a78482a29d4327452.jpg",
  },
  {
    date: "2024-02-07",
    title:
      "Shandong Port Equipment Group held the 2023 Annual Summary and Commendation Conference",
    description:
      "On February 7, Shandong Port Equipment Group held the 2023 Annual Summary and Commendation Conference to comprehensively summarize the work of the past year, commend the advanced collectives and individuals who have made outstanding contributions to the development of equipment in the past year, encourage the majority of cadres and workers to strengthen their confidence, take responsibility, work hard to tackle tough problems, and comprehensively accelerate the new process of transformation and development.",
    href: "https://mp.weixin.qq.com/s/XOIp-2TNeTvesCCkgJfqKw",
    image:
      "/images/uploads/allimg/20240327/c413f4dbed9a2541d70fdab2ec0b64fe.jpg",
  },
  {
    date: "2023-12-28",
    title: "Shandong Port Equipment Group held a meeting of leading cadres",
    description:
      "On December 27, Shandong Port Equipment Group held a meeting of leading cadres. Gao Ya, member of the Standing Committee of the Party Committee and deputy general manager of Shandong Port Group, attended the meeting and delivered a speech. The meeting announced the decision on the adjustment of the leadership of Shandong Port Equipment Group.",
    href: "https://mp.weixin.qq.com/s/0ZeXHCHV27zh_fsURNiBNQ",
    image: "/images/public/files/image/indexnew1.jpg",
  },
  {
    date: "2023-12-28",
    title:
      "The construction of a world-class port cluster in Shandong Province has borne fruit again! The country's first fully autonomous automated terminal was put into operation",
    description:
      "On December 27, the three-year action promotion meeting for the construction of a world-class port group in Shandong Province and the operation of the national fully autonomous automated terminal were held at the Qingdao Port Automation Terminal of Shandong Port.",
    href: "https://mp.weixin.qq.com/s/lt45ULydVI2UGYjlj8sQmg",
    image: "/images/public/files/image/indexnew2.jpg",
  },
  {
    date: "2023-12-27",
    title:
      "Discussion and admonition | The seminar on the construction and development of world-class port clusters in Shandong Province was held in Shandong Port",
    description:
      'On December 26, the seminar on the construction and development of world-class port clusters in Shandong Province was held in Shandong Port. Experts and scholars gathered in the beautiful island city to "check the pulse" and "prescribe support" for the construction of a world-class port cluster in Shandong Province.',
    href: "https://mp.weixin.qq.com/s/1Z9MtLR_kFZruhy0Ohvetw",
    image: "/images/public/files/image/indexnew3.jpg",
  },
  {
    date: "2023-12-26",
    title:
      "The delegation of Shandong Port to New Zealand and Australia successfully completed various missions",
    description:
      "From December 17th to 23rd, the delegation of Shandong Provincial Government successfully visited New Zealand and Australia. The Shandong Port delegation visited embassies and consulates, friendly ports and important partners, and held a customer exchange meeting on Shandong Port Supply Chain Comprehensive Service in Australia.",
    href: "https://mp.weixin.qq.com/s/xwmHTUVzUxtjDQIRKC9XBw",
    image: "/images/public/files/image/indexnew4.jpg",
  },
  {
    date: "2023-12-24",
    title: 'Port "Iron Giant" "Moves to a New Home"',
    description:
      "Shandong Port Equipment Group Luhai Heavy Industry Co., Ltd. and Shandong Port Yantai Port Longkou Port Co., Ltd. jointly completed the relocation of three portal cranes in only 10 days, providing first-class equipment service support and helping the port improve berth loading and unloading capacity.",
    href: "https://mp.weixin.qq.com/s/nodyD6ISqVn3Eco44m20uQ",
    image: "/images/public/files/image/indexnew5.jpg",
  },
];

const vietnameseArticles: readonly GroupNewsSourceArticle[] = [
  {
    ...englishArticles[0],
    title:
      "Tập đoàn Thiết bị Cảng Sơn Đông tổ chức kỳ họp thứ ba của Đại hội đại biểu Công đoàn khóa I và Hội nghị người lao động lần thứ ba",
    description:
      "Ngày 12 tháng 3, Tập đoàn Thiết bị Cảng Sơn Đông tổ chức kỳ họp thứ ba của Đại hội đại biểu Công đoàn khóa I và Hội nghị người lao động lần thứ ba. Tổng cộng 46 đại biểu chính thức và 4 đại biểu dự thính từ bốn đoàn đại biểu của trụ sở tập đoàn và các đơn vị trực thuộc đã tham dự, thực hiện nghiêm túc trách nhiệm của mình.",
  },
  {
    ...englishArticles[1],
    title:
      'Tập đoàn Thiết bị Cảng Sơn Đông triển khai hoạt động “Bài học đầu tiên” về trở lại làm việc và sản xuất an toàn sau Tết Nguyên đán 2024',
    description:
      'Nhằm duy trì ổn định công tác an toàn sản xuất sau Tết Nguyên đán, sáng ngày 18 tháng 2, ông Chen Jikang, Phó Bí thư Đảng ủy kiêm Tổng Giám đốc Tập đoàn Thiết bị Cảng Sơn Đông, đã giảng “Bài học đầu tiên khi bắt đầu làm việc”, tăng cường nhận thức, triển khai các biện pháp an toàn và bảo đảm hoạt động sản xuất ổn định.',
  },
  {
    ...englishArticles[2],
    title:
      "Tập đoàn Thiết bị Cảng Sơn Đông tổ chức Hội nghị tổng kết và tuyên dương năm 2023",
    description:
      "Ngày 7 tháng 2, Tập đoàn Thiết bị Cảng Sơn Đông tổ chức Hội nghị tổng kết và tuyên dương năm 2023 nhằm tổng kết toàn diện công việc trong năm qua, biểu dương các tập thể, cá nhân có đóng góp nổi bật và khích lệ cán bộ, người lao động đẩy nhanh quá trình chuyển đổi, phát triển chất lượng cao.",
  },
  {
    ...englishArticles[3],
    title:
      "Tập đoàn Thiết bị Cảng Sơn Đông tổ chức hội nghị cán bộ lãnh đạo",
    description:
      "Ngày 27 tháng 12, Tập đoàn Thiết bị Cảng Sơn Đông tổ chức hội nghị cán bộ lãnh đạo. Ông Gao Ya, Ủy viên Ban Thường vụ Đảng ủy kiêm Phó Tổng Giám đốc Tập đoàn Cảng Sơn Đông, tham dự và phát biểu. Hội nghị công bố quyết định điều chỉnh bộ máy lãnh đạo của tập đoàn.",
  },
  {
    ...englishArticles[4],
    title:
      "Cụm cảng đẳng cấp thế giới của tỉnh Sơn Đông tiếp tục đạt thành quả: bến cảng tự động hoàn toàn tự chủ đầu tiên của Trung Quốc đi vào vận hành",
    description:
      "Ngày 27 tháng 12, hội nghị thúc đẩy chương trình hành động ba năm xây dựng cụm cảng đẳng cấp thế giới tại tỉnh Sơn Đông và lễ vận hành bến cảng tự động hoàn toàn tự chủ đầu tiên của Trung Quốc được tổ chức tại Bến cảng tự động Cảng Thanh Đảo.",
  },
  {
    ...englishArticles[5],
    title:
      "Trao đổi và góp ý | Hội thảo xây dựng, phát triển cụm cảng đẳng cấp thế giới tỉnh Sơn Đông được tổ chức tại Cảng Sơn Đông",
    description:
      "Ngày 26 tháng 12, hội thảo về xây dựng và phát triển cụm cảng đẳng cấp thế giới tỉnh Sơn Đông được tổ chức tại Cảng Sơn Đông. Các chuyên gia, học giả cùng trao đổi giải pháp nhằm nâng tầm quá trình xây dựng cụm cảng đẳng cấp thế giới của tỉnh.",
  },
  {
    ...englishArticles[6],
    title:
      "Đoàn đại biểu Cảng Sơn Đông hoàn thành tốt các nhiệm vụ tại New Zealand và Australia",
    description:
      "Từ ngày 17 đến 23 tháng 12, đoàn đại biểu tỉnh Sơn Đông đã thăm New Zealand và Australia. Đoàn Cảng Sơn Đông làm việc với các đại sứ quán, lãnh sự quán, cảng hữu nghị và đối tác quan trọng, đồng thời tổ chức hội nghị khách hàng về dịch vụ chuỗi cung ứng tổng hợp tại Australia.",
  },
  {
    ...englishArticles[7],
    title: '“Người khổng lồ sắt” của cảng “chuyển đến ngôi nhà mới”',
    description:
      "Công ty Công nghiệp nặng Lục Hải và Cảng Long Khẩu thuộc Cảng Yên Đài đã phối hợp hoàn thành việc di dời ba cần trục cổng chỉ trong 10 ngày, cung cấp dịch vụ thiết bị chất lượng cao và nâng cao năng lực xếp dỡ tại các cầu cảng.",
  },
];

const chineseArticles: readonly GroupNewsSourceArticle[] = [
  {
    date: "2025-07-25",
    title: "山东陆海装备集团召开2025年半年工作会议",
    description: "",
    href: "https://mp.weixin.qq.com/s/sWn66DnSf7b2pjeL_H8KJA",
    image:
      "http://www.spe.cn/uploads/allimg/20250812/6a9924dfe44d719f3884161dfb98e128.jpg",
  },
  {
    date: "2025-06-14",
    title:
      "山港智先锋 | 这里入选“工赋百景”制造业数字化转型揭榜挂帅项目暨数字化供应链试点",
    description: "",
    href: "https://mp.weixin.qq.com/s/DEI5ySnH04wAAb9wZXwKGg",
    image:
      "http://www.spe.cn/uploads/allimg/20250812/06e58bff85b0915885e763b2f512fc75.jpg",
  },
  {
    date: "2025-06-03",
    title: "山东陆海装备集团召开警示教育会",
    description: "",
    href: "https://mp.weixin.qq.com/s/YxBimS_IZaVfbc6S81N8VQ",
    image:
      "http://www.spe.cn/uploads/allimg/20250812/c19606510d923e3fd545aae48cd3a19f.jpg",
  },
  {
    date: "2025-04-12",
    title: "山东陆海装备集团召开2025年第一季度质量提升阶段工作总结会",
    description: "",
    href: "https://mp.weixin.qq.com/s/EpIT9DgCaJcvbT77S6-cww",
    image:
      "http://www.spe.cn/uploads/allimg/20250812/f2258c7595517d510f092ca64569e97c.jpg",
  },
  {
    date: "2025-04-12",
    title:
      "“三基六化”一把手谈 | 陆海装备集团：聚焦“做壮 做优 做强” 加快构建装备特色“三基六化”建设模式",
    description: "",
    href: "https://mp.weixin.qq.com/s/tqq7hYyLZeQIPFF5S38XGA",
    image:
      "http://www.spe.cn/uploads/allimg/20250812/0e7a1637b18da27ac58a84634481e2f7.jpg",
  },
  {
    date: "2025-03-27",
    title: "五载智造陆海 匠心筑梦未来 | 山东陆海装备集团五年改革发展",
    description: "",
    href: "https://mp.weixin.qq.com/s/BBCifltXcokpuFLOJTPJVQ",
    image:
      "http://www.spe.cn/uploads/allimg/20250403/aaa0e74938148fb141796b7da9274825.jpg",
  },
  {
    date: "2025-03-26",
    title: "山东陆海装备集团召开2025年度科技创新大会",
    description: "",
    href: "https://mp.weixin.qq.com/s/U7UG99moenQouDC2zR29Fg",
    image:
      "http://www.spe.cn/uploads/allimg/20250403/aea476ca560e1789b5d9856fad3127f3.jpg",
  },
  {
    date: "2025-03-26",
    title: "山东陆海装备集团召开党风廉政建设和反腐败工作会议暨警示教育会",
    description: "",
    href: "https://mp.weixin.qq.com/s/xBc-2xgJGkBo98z-SnBN9A",
    image:
      "http://www.spe.cn/uploads/allimg/20250403/9782f22168d962f9b7c604f8342a067e.jpg",
  },
  {
    date: "2025-03-22",
    title:
      "山东陆海装备集团召开2025年安全生产委员会第二次全体（扩大）会议暨二季度环境保护委员会会议",
    description: "",
    href: "https://mp.weixin.qq.com/s/8if9alLvCKih39GDrRSw9g",
    image:
      "http://www.spe.cn/uploads/allimg/20250403/3948785ff8c2f11c477b99e98ebaf34b.jpg",
  },
];

const detailCopy: Record<
  AppLocale,
  {
    author: string;
    categoryName: string;
    introduction: (title: string) => string;
    development: (title: string) => string;
    conclusion: string;
  }
> = {
  en: {
    author: "Shandong Port Equipment Group",
    categoryName: "Group news",
    introduction: (title) =>
      `Shandong Port Equipment Group has shared the latest information about “${title}”, an activity connected with the Group's current priorities and operating plans.`,
    development: (title) =>
      `Through the activities described in “${title}”, the Group continues to strengthen coordination, professional management, and the effective delivery of its key work.`,
    conclusion:
      "The results provide a practical foundation for the next stage and support the Group's steady, high-quality development.",
  },
  vi: {
    author: "Tập đoàn Thiết bị Cảng Sơn Đông",
    categoryName: "Tin tập đoàn",
    introduction: (title) =>
      `Tập đoàn Thiết bị Cảng Sơn Đông cập nhật thông tin mới nhất về “${title}”, hoạt động gắn với các nhiệm vụ trọng tâm và kế hoạch vận hành của Tập đoàn.`,
    development: (title) =>
      `Thông qua các hoạt động được nêu trong bài “${title}”, Tập đoàn tiếp tục tăng cường phối hợp, quản trị chuyên nghiệp và triển khai hiệu quả các nhiệm vụ trọng tâm.`,
    conclusion:
      "Kết quả đạt được tạo nền tảng thiết thực cho giai đoạn tiếp theo, góp phần thúc đẩy Tập đoàn phát triển ổn định và chất lượng cao.",
  },
  zh: {
    author: "山东陆海装备集团",
    categoryName: "集团新闻",
    introduction: (title) =>
      `山东陆海装备集团发布《${title}》相关最新动态，内容与集团当前重点任务和经营安排密切相关。`,
    development: (title) =>
      `通过《${title}》所介绍的相关工作，集团进一步加强协同联动、专业管理和重点任务落实。`,
    conclusion:
      "相关成果为下一阶段工作奠定了坚实基础，也为集团稳健、高质量发展提供了有力支撑。",
  },
};

function addArticleDetails(
  locale: AppLocale,
  articles: readonly GroupNewsSourceArticle[],
): readonly GroupNewsArticle[] {
  const copy = detailCopy[locale];

  return articles.map((article, index) => ({
    ...article,
    id: `${locale}-group-news-${article.date}-${index + 1}`,
    author: copy.author,
    categoryName: copy.categoryName,
    content: [
      article.description || copy.introduction(article.title),
      copy.development(article.title),
      copy.conclusion,
    ],
    coverImage: article.image,
    sourceUrl: article.href,
  }));
}

const articlesByLocale: Record<AppLocale, readonly GroupNewsArticle[]> = {
  en: addArticleDetails("en", englishArticles),
  vi: addArticleDetails("vi", vietnameseArticles),
  zh: addArticleDetails("zh", chineseArticles),
};

export function getGroupNewsArticles(locale: AppLocale) {
  return articlesByLocale[locale].slice(0, 3);
}

export function getGroupNewsArticle(locale: AppLocale, articleId: string) {
  return articlesByLocale[locale].find((article) => article.id === articleId);
}
