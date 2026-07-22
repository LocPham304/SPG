import type { AppLocale } from "@/i18n/routing";
import type { NewsArticleDetail } from "@/types/news";

type ProductDeliverySourceArticle = {
  date: string;
  title: string;
  description: string;
  href: string;
  image: string;
};

export type ProductDeliveryArticle = ProductDeliverySourceArticle &
  NewsArticleDetail & {
    id: string;
  };

export type ProductDeliveryContent = {
  articles: readonly ProductDeliveryArticle[];
  pageCount: number;
  sourcePageUrl: (page: number) => string;
};

const englishArticles: readonly ProductDeliverySourceArticle[] = [
  {
    date: "2024-03-25",
    title:
      'For the fifth time! 10 door machines and 12 funnels smoothly "moved"~',
    description:
      "A few days ago, with the last gantry crane going ashore steadily, the 10 gantry cranes and 12 funnel relocation projects of Shandong Port Equipment Group Luhai Heavy Industry Company were successfully completed. This is the establishment of Shandong Port, the company successfully implemented the fifth large-scale relocation project, the first time to carry out 10 sets of 700 tons of self-weight portal crane MC type 50t relocation operations, the use of sea barges to successfully complete the sea operations from Shandong Port Rizhao Port Shijiu Port to Lanshan Port Area across the county sea, this way is not only safer and more stable, but also greatly improved the relocation efficiency.",
    href: "https://mp.weixin.qq.com/s/Ox3oZUtGvNt4W8z83QEPmA",
    image:
      "/images/uploads/allimg/20240327/cc691e712ba690dd550dc8dcc9334c60.jpg",
  },
  {
    date: "2024-03-10",
    title: '"Green" equipment! Help build a near-"zero-carbon" terminal~',
    description:
      'Recently, Shandong Port Equipment Group Qingdao Equipment Co., Ltd. successfully completed the "oil to electricity" conversion of two reach stackers of Shandong Port Logistics Group and Qingdao Port two months ahead of schedule. So far, the company has successfully implemented the "oil to electricity" of 6 forklifts, 2 loaders and 2 reach stackers, marking that the company has the ability to upgrade and transform the fuel flow machine into an electric flow machine to help build a comprehensive service guarantee capability for nearly "zero-carbon" terminals and stations.',
    href: "https://mp.weixin.qq.com/s/MQyMt7jHwEVfh_nlpxFJBA",
    image:
      "/images/uploads/allimg/20240327/adc1413cb3de8255336e5533227cad3b.png",
  },
  {
    date: "2024-03-02",
    title:
      "The first in China! Offshore seawater salmon culture cages were successfully delivered~",
    description:
      'The smooth delivery of the first offshore seawater salmon aquaculture cage in China is an important symbol of Shandong Port\'s full implementation of the strategic deployment requirements of the Shandong Provincial Party Committee and the Provincial Government of "Marine Strong Province", and an important symbol of the business development of the marine aquaculture equipment market and a strong support for the high-quality development of marine fishery aquaculture, which has a positive role in promoting the development level of marine economy, enhancing the comprehensive strength of the ocean, and promoting the construction of ecological civilization.',
    href: "https://mp.weixin.qq.com/s/hYsz8MKaVfe7PSnskGc8IA",
    image:
      "/images/uploads/allimg/20240327/2b0533d8116f36ef5b7b020d65323593.jpg",
  },
  {
    date: "2024-02-29",
    title: "The journey of the rebirth of an old excavator~",
    description:
      'In the factory building of the engineering machinery factory of Shandong Port Equipment Group Luhai Heavy Industry Company, an old Case excavator is fully armed, waiting for technicians to tailor a new look for it. This is one of the representative projects of Yantai Port Group and General Motors to repair the old and reuse the waste, save money and increase efficiency, after only three months, the original rusty, scarred excavator, after remanufacturing, it escaped the fate of being abandoned, and obtained a "new life"......',
    href: "https://mp.weixin.qq.com/s/BjM-LkEWVPFrS7PlYi_rrQ",
    image:
      "/images/uploads/allimg/20240327/3f14744149f3d454a074c448562ad2e8.jpg",
  },
  {
    date: "2024-02-24",
    title:
      "10 sets of 25-ton flatbed trucks were delivered in a centralized manner!",
    description:
      "Recently, 10 sets of 25-ton easy-to-board automatic tilting hydraulic lifting pallet flatbed truck project developed by Shandong Port Equipment Group Luhai Heavy Industry Company Engineering Machinery Factory was successfully completed and delivered to users",
    href: "https://mp.weixin.qq.com/s/tQ4IFZiR-Em6o15AbNZGqg",
    image:
      "/images/uploads/allimg/20240327/7ec58a03c78d84025ddc3065d86aad39.jpg",
  },
  {
    date: "2024-01-13",
    title:
      "Forge ahead on a new journey and make contributions to a new era|Shandong Port Equipment Group has another new bridge crane ashore!",
    description:
      "On January 11, the first bridge crane of Qingdao Port in Shandong Port this year, No. 91 remotely controlled bridge crane, was successfully landed at the QQCTU-U1 berth, creating new highlights, setting new benchmarks and achieving new breakthroughs for Shandong Port Qingdao Port in the process of \"accelerating the construction of a world-class port group, 'double first-class' construction, and building core competitive advantages\".",
    href: "https://mp.weixin.qq.com/s/2rcO4b0c_ZOptKNPBQu3uQ",
    image:
      "/images/uploads/allimg/20240327/ecd644ac829253fe85d27cb4e86a04ff.jpg",
  },
  {
    date: "2023-12-24",
    title:
      "67 units! Shangang equipment overseas market to achieve a new breakthrough~",
    description:
      "Recently, Shandong Port Equipment Group Luhai Heavy Industry Co., Ltd. won the bid for 67 slurry pumps of a mining company in the Middle East in the first half of 2023. This is the largest order business in the history of the equipment group's slurry pump products, and it is also another breakthrough in the equipment group's transformation of overseas market development with technological innovation.",
    href: "https://mp.weixin.qq.com/s/KtgbpJKN7XLPTLw9Q19Y_w",
    image: "/images/public/files/image/indexnew7.jpg",
  },
  {
    date: "2023-12-24",
    title:
      "Shandong Port Equipment Group launched new energy flow machine products",
    description:
      'On October 27, Shandong Port Equipment Group and Logistics Group held the "Delivery Ceremony of the First Batch of Three Electric Stackers", and the business integration bore fruit. The batch of equipment developed by Qingdao Equipment Co., Ltd. was delivered to users in only three months, and was highly recognized by users, and the follow-up two sides will carry out in-depth cooperation around electric reach stacker products.',
    href: "https://mp.weixin.qq.com/s/-_uoJAwEPlKky6lbuq7Zcg",
    image: "/images/public/files/image/indexnew8.jpg",
  },
  {
    date: "2023-12-24",
    title:
      'Superburning, China\'s "core" | The portal crane developed by Shangang Equipment goes overseas!',
    description:
      "On October 16, the first two of the four DBM6045 portal cranes developed by Qingdao Equipment Company of Shandong Port Equipment Group for Russia were successfully loaded and set sail.",
    href: "https://mp.weixin.qq.com/s/uQFSyxAHm8z2_nFcq2f3WA",
    image: "/images/public/files/image/indexnew9.jpg",
  },
];

const vietnameseArticles: readonly ProductDeliverySourceArticle[] = [
  {
    ...englishArticles[0],
    title: "Lần thứ năm! 10 cần trục cổng và 12 phễu đã “chuyển nhà” thuận lợi",
    description:
      "Với việc cần trục cổng cuối cùng được đưa lên bờ an toàn, dự án di dời 10 cần trục cổng và 12 phễu của Công ty Công nghiệp nặng Lục Hải đã hoàn thành. Đây là dự án di dời quy mô lớn thứ năm của công ty và là lần đầu tiên thực hiện di dời 10 cần trục cổng MC 50 tấn, tự trọng 700 tấn. Sà lan biển đã vận chuyển thiết bị từ khu cảng Thạch Cữu thuộc Cảng Nhật Chiếu đến khu cảng Lam Sơn, giúp hoạt động an toàn, ổn định và hiệu quả hơn đáng kể.",
  },
  {
    ...englishArticles[1],
    title: "Thiết bị “xanh” góp phần xây dựng bến cảng gần như “không carbon”",
    description:
      "Công ty Thiết bị Thanh Đảo đã hoàn thành trước hai tháng việc chuyển đổi hai xe nâng container của Tập đoàn Logistics Cảng Sơn Đông và Cảng Thanh Đảo từ nhiên liệu sang điện. Đến nay công ty đã chuyển đổi thành công sáu xe nâng, hai máy xúc và hai xe nâng container, hình thành năng lực nâng cấp thiết bị xếp dỡ chạy nhiên liệu thành thiết bị điện, hỗ trợ xây dựng bến cảng và ga gần như không phát thải carbon.",
  },
  {
    ...englishArticles[2],
    title:
      "Lần đầu tiên tại Trung Quốc: bàn giao thành công lồng nuôi cá hồi nước biển ngoài khơi",
    description:
      "Việc bàn giao thuận lợi lồng nuôi cá hồi nước biển ngoài khơi đầu tiên tại Trung Quốc là dấu mốc quan trọng trong quá trình Cảng Sơn Đông thực hiện chiến lược xây dựng tỉnh mạnh về biển. Dự án đánh dấu bước phát triển của thị trường thiết bị nuôi trồng thủy sản biển, hỗ trợ mạnh mẽ ngành nuôi biển chất lượng cao, nâng cao năng lực kinh tế biển và thúc đẩy xây dựng văn minh sinh thái.",
  },
  {
    ...englishArticles[3],
    title: "Hành trình hồi sinh một chiếc máy xúc cũ",
    description:
      "Tại nhà máy máy công trình của Công ty Công nghiệp nặng Lục Hải, một chiếc máy xúc Case cũ được các kỹ thuật viên thiết kế phương án phục hồi riêng. Đây là dự án tiêu biểu về sửa chữa, tái sử dụng thiết bị cũ, tiết kiệm chi phí và tăng hiệu quả. Chỉ sau ba tháng tái sản xuất, chiếc máy hoen gỉ, hư hỏng đã tránh được việc bị loại bỏ và có một diện mạo hoàn toàn mới.",
  },
  {
    ...englishArticles[4],
    title: "Bàn giao tập trung 10 xe sàn phẳng tải trọng 25 tấn",
    description:
      "Mười xe sàn phẳng nâng thủy lực tự động, tải trọng 25 tấn do Nhà máy Máy công trình thuộc Công ty Công nghiệp nặng Lục Hải phát triển đã được hoàn thiện và bàn giao thành công cho khách hàng.",
  },
  {
    ...englishArticles[5],
    title:
      "Tiến bước trên hành trình mới, đóng góp cho thời đại mới: thêm một cần trục giàn của Tập đoàn Thiết bị Cảng Sealand Sơn Đông cập bờ",
    description:
      "Ngày 11 tháng 1, cần trục giàn điều khiển từ xa số 91, cần trục đầu tiên trong năm của Cảng Thanh Đảo, đã cập bến QQCTU-U1 thành công. Thiết bị tạo thêm điểm nhấn, chuẩn mực và bước đột phá mới trong quá trình đẩy nhanh xây dựng cụm cảng đẳng cấp thế giới, phát triển “hai đẳng cấp hàng đầu” và hình thành lợi thế cạnh tranh cốt lõi.",
  },
  {
    ...englishArticles[6],
    title:
      "67 thiết bị: thị trường nước ngoài của thiết bị Sơn Cảng đạt đột phá mới",
    description:
      "Công ty Công nghiệp nặng Lục Hải trúng thầu 67 máy bơm bùn cho một doanh nghiệp khai khoáng tại Trung Đông. Đây là đơn hàng máy bơm bùn lớn nhất trong lịch sử tập đoàn và là bước đột phá mới tại thị trường nước ngoài nhờ đổi mới công nghệ.",
  },
  {
    ...englishArticles[7],
    title:
      "Tập đoàn Thiết bị Cảng Sealand Sơn Đông ra mắt dòng máy xếp dỡ năng lượng mới",
    description:
      "Ngày 27 tháng 10, Tập đoàn Thiết bị Cảng Sealand Sơn Đông và Tập đoàn Logistics tổ chức lễ bàn giao lô ba xe nâng container chạy điện đầu tiên. Thiết bị do Công ty Thiết bị Thanh Đảo phát triển và bàn giao chỉ trong ba tháng, nhận được sự đánh giá cao từ khách hàng. Hai bên sẽ tiếp tục hợp tác sâu rộng về các dòng xe nâng container chạy điện.",
  },
  {
    ...englishArticles[8],
    title:
      "Bùng cháy với “lõi” Trung Quốc: cần trục cổng do Thiết bị Sơn Cảng phát triển vươn ra nước ngoài",
    description:
      "Ngày 16 tháng 10, hai chiếc đầu tiên trong số bốn cần trục cổng DBM6045 do Công ty Thiết bị Thanh Đảo phát triển cho khách hàng Nga đã được xếp lên tàu và khởi hành thành công.",
  },
];

const chineseArticles: readonly ProductDeliverySourceArticle[] = [
  {
    date: "2026-06-12",
    title: "25→15→14，一场改造攻坚战里的“极限挑战”",
    description: "",
    href: "https://mp.weixin.qq.com/s/4N97VhsOknn551USTakwMA",
    image:
      "http://www.spe.cn/uploads/allimg/20260615/061b66ca1ea9b64c1a774c58be28a098.jpeg",
  },
  {
    date: "2026-06-04",
    title: "提质创一流 | 装备集团承制的连云港带斗门机顺利发运！",
    description: "",
    href: "https://mp.weixin.qq.com/s/jRb8LTc3lKp4de7bSOF3Wg",
    image:
      "http://www.spe.cn/uploads/allimg/20260615/3b69044a6b074c2a8c58d5ec7bdb7841.jpeg",
  },
  {
    date: "2026-04-27",
    title: "续签欧洲多用途船订单！装备集团用实力迎来“回头客”",
    description: "",
    href: "https://mp.weixin.qq.com/s/ZMKbVOZJZ-q6fdv3uDeqvg",
    image:
      "http://www.spe.cn/uploads/allimg/20260430/60ebfb2dca350325e778e351491a603d.png",
  },
  {
    date: "2026-04-13",
    title: "质领卓越 | 装备集团“超预期服务”迎来回头客",
    description: "",
    href: "https://mp.weixin.qq.com/s/FQuoZA9W7C5tT3iRJ7EDgA",
    image:
      "http://www.spe.cn/uploads/allimg/20260430/9669fd59813091c0a5fb2413bc7728fb.png",
  },
  {
    date: "2026-04-13",
    title: "超预期服务 | 装备集团承制唐山港6台门机发运河北！",
    description: "",
    href: "https://mp.weixin.qq.com/s/RM3ZE1sQ6r8DJoUkfnX7OA",
    image:
      "http://www.spe.cn/uploads/allimg/20260430/78162b74cd5f4ad9c465bff50b31950e.jpg",
  },
  {
    date: "2026-03-23",
    title: "精益增效 | 陆海装备集团两大项目装船发运抢出“加速度”！",
    description: "",
    href: "https://mp.weixin.qq.com/s/r229VZOLX-IG8lnMKPZaYg",
    image:
      "http://www.spe.cn/uploads/allimg/20260430/10745df22013253d1b82d87d67b196cd.jpg",
  },
  {
    date: "2026-03-05",
    title: "超预期服务 | “回头客”+1，装备集团再获海外客户钢结构订单",
    description: "",
    href: "https://mp.weixin.qq.com/s/MbvBhFQV_3ouW0Dn7Bd69w",
    image:
      "http://www.spe.cn/uploads/allimg/20260430/8518d213ec439c34231fc34d566696ef.jpg",
  },
  {
    date: "2026-02-20",
    title: "超预期服务 | “钢铁骨架”启航！装备集团西非几内亚项目履约再提速",
    description: "",
    href: "https://mp.weixin.qq.com/s/Z368lKM4Uo-Y3raoFVMx3w",
    image:
      "http://www.spe.cn/uploads/allimg/20260228/e53e51341df094ebdf256d41730b2c59.jpg",
  },
  {
    date: "2026-01-19",
    title: "超预期服务 | 这艘船提前9天完成坞修，获业主来信感谢~",
    description: "",
    href: "https://mp.weixin.qq.com/s/ZXU5EiKzpV3zGump1C7-gQ",
    image:
      "http://www.spe.cn/uploads/allimg/20260121/79084de8c08c59b48cd034a26ae52389.jpg",
  },
];

const detailCopy: Record<
  AppLocale,
  {
    author: string;
    categoryName: string;
    introduction: (title: string) => string;
    impact: (title: string) => string;
    conclusion: string;
  }
> = {
  en: {
    author: "Shandong Port Equipment Group",
    categoryName: "Product delivery",
    introduction: (title) =>
      `The project featured in “${title}” has reached an important delivery milestone following coordinated production, inspection, and preparation work.`,
    impact: (title) =>
      `The delivery described in “${title}” reflects the project team's focus on technical quality, schedule control, and safe execution throughout the implementation process.`,
    conclusion:
      "The completed work strengthens practical operating capacity and creates a solid basis for continued cooperation with customers and partners.",
  },
  vi: {
    author: "Tập đoàn Thiết bị Cảng Sealand Sơn Đông",
    categoryName: "Bàn giao sản phẩm",
    introduction: (title) =>
      `Dự án được giới thiệu trong bài “${title}” đã đạt cột mốc bàn giao quan trọng sau quá trình phối hợp sản xuất, kiểm tra và chuẩn bị.`,
    impact: (title) =>
      `Hoạt động bàn giao trong bài “${title}” thể hiện sự chú trọng của đội ngũ dự án đối với chất lượng kỹ thuật, tiến độ và an toàn trong suốt quá trình triển khai.`,
    conclusion:
      "Kết quả hoàn thành góp phần nâng cao năng lực vận hành thực tế và tạo nền tảng vững chắc để tiếp tục hợp tác với khách hàng, đối tác.",
  },
  zh: {
    author: "山东港口装备集团",
    categoryName: "产品交付",
    introduction: (title) =>
      `《${title}》所介绍的项目，在生产、检验和交付准备等环节协同推进后，顺利完成重要交付节点。`,
    impact: (title) =>
      `《${title}》所介绍的交付工作，体现了项目团队对技术质量、进度管控和安全实施的高度重视。`,
    conclusion:
      "项目顺利完成进一步提升了实际运营保障能力，也为与客户和合作伙伴持续深化合作打下了坚实基础。",
  },
};

function addArticleDetails(
  locale: AppLocale,
  articles: readonly ProductDeliverySourceArticle[],
): readonly ProductDeliveryArticle[] {
  const copy = detailCopy[locale];

  return articles.map((article, index) => ({
    ...article,
    id: `${locale}-product-delivery-${article.date}-${index + 1}`,
    author: copy.author,
    categoryName: copy.categoryName,
    content: [
      article.description || copy.introduction(article.title),
      copy.impact(article.title),
      copy.conclusion,
    ],
    coverImage: article.image,
    sourceUrl: article.href,
  }));
}

const contentByLocale: Record<AppLocale, ProductDeliveryContent> = {
  en: {
    articles: addArticleDetails("en", englishArticles),
    pageCount: 2,
    sourcePageUrl: (page) =>
      `http://en.spe.cn/html/news_pro/list_19_${page}.html#md`,
  },
  vi: {
    articles: addArticleDetails("vi", vietnameseArticles),
    pageCount: 2,
    sourcePageUrl: (page) =>
      `http://en.spe.cn/html/news_pro/list_19_${page}.html#md`,
  },
  zh: {
    articles: addArticleDetails("zh", chineseArticles),
    pageCount: 5,
    sourcePageUrl: (page) =>
      `http://www.spe.cn/html/news_pro/list_19_${page}.html#md`,
  },
};

export function getProductDeliveryContent(locale: AppLocale) {
  const content = contentByLocale[locale];

  return {
    ...content,
    articles: content.articles.slice(0, 3),
    pageCount: 1,
  };
}

export function getProductDeliveryArticle(
  locale: AppLocale,
  articleId: string,
) {
  return contentByLocale[locale].articles.find(
    (article) => article.id === articleId,
  );
}
