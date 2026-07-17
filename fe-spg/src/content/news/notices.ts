import type { AppLocale } from "@/i18n/routing";
import type {
  DetailedNewsDateListItem,
  NewsDateListItem,
} from "@/types/news";

const englishNotices: readonly NewsDateListItem[] = [
  {
    id: "en-notice-352",
    publishedAt: "2024-01-26",
    title: "Announcement on the 2023 annual summary evaluation and commendation objects",
    summary: "Announcement on the 2023 annual summary evaluation and commendation objects",
    href: "http://en.spe.cn/html/notices/352.html",
  },
  {
    id: "en-notice-351",
    publishedAt: "2023-12-05",
    title: 'In 2023, the "Most Beautiful Family in Shandong Port" will be announced',
    summary: 'In 2023, the "Most Beautiful Family in Shandong Port" will be announced',
    href: "http://en.spe.cn/html/notices/351.html",
  },
  {
    id: "en-notice-342",
    publishedAt: "2023-10-18",
    title:
      "Announcement on the selection of candidates recommended by advanced individuals in the national conscription work",
    summary:
      "Announcement on the selection of candidates recommended by advanced individuals in the national conscription work",
    href: "http://en.spe.cn/html/notices/342.html",
  },
];

const vietnameseNotices: readonly NewsDateListItem[] = [
  {
    ...englishNotices[0],
    id: "vi-notice-352",
    title: "Thông báo kết quả tổng kết, đánh giá và các đối tượng được khen thưởng năm 2023",
    summary: "Thông báo kết quả tổng kết, đánh giá và các đối tượng được khen thưởng năm 2023",
  },
  {
    ...englishNotices[1],
    id: "vi-notice-351",
    title: 'Công bố danh hiệu “Gia đình đẹp nhất Cảng Sơn Đông” năm 2023',
    summary: 'Công bố danh hiệu “Gia đình đẹp nhất Cảng Sơn Đông” năm 2023',
  },
  {
    ...englishNotices[2],
    id: "vi-notice-342",
    title:
      "Thông báo tuyển chọn các ứng viên do những cá nhân tiên tiến trong công tác tuyển quân đề cử",
    summary:
      "Thông báo tuyển chọn các ứng viên do những cá nhân tiên tiến trong công tác tuyển quân đề cử",
  },
];

const chineseNotices: readonly NewsDateListItem[] = [
  {
    ...englishNotices[0],
    id: "zh-notice-352",
    title: "关于2023年度总结评比表彰对象的公示",
    summary: "关于2023年度总结评比表彰对象的公示",
  },
  {
    ...englishNotices[1],
    id: "zh-notice-351",
    title: "2023年度“山东港口最美家庭”公示",
    summary: "2023年度“山东港口最美家庭”公示",
  },
  {
    ...englishNotices[2],
    id: "zh-notice-342",
    title: "全国征兵工作先进个人推荐候选人选公示",
    summary: "全国征兵工作先进个人推荐候选人选公示",
  },
];

const detailCopy: Record<
  AppLocale,
  {
    author: string;
    categoryName: string;
    instructions: string;
    purpose: (title: string) => string;
  }
> = {
  en: {
    author: "Shandong Port Equipment Group",
    categoryName: "Notices",
    purpose: (title) =>
      `This notice provides the official information concerning “${title}” so that relevant organizations and individuals can review it in a timely manner.`,
    instructions:
      "Readers are advised to check the published information carefully and follow the stated requirements or feedback process within the applicable period.",
  },
  vi: {
    author: "Tập đoàn Thiết bị Cảng Sơn Đông",
    categoryName: "Thông báo",
    purpose: (title) =>
      `Thông báo này cung cấp thông tin chính thức về “${title}” để các tổ chức, cá nhân liên quan kịp thời theo dõi và đối chiếu.`,
    instructions:
      "Bạn đọc vui lòng kiểm tra kỹ nội dung được công bố và thực hiện các yêu cầu hoặc quy trình phản hồi trong thời hạn áp dụng.",
  },
  zh: {
    author: "山东港口装备集团",
    categoryName: "通知公告",
    purpose: (title) =>
      `本公告就《${title}》发布正式信息，便于相关单位和人员及时查阅、核对。`,
    instructions:
      "请读者认真核实公示内容，并在规定时间内按照相关要求办理或反馈。",
  },
};

function addNoticeDetails(
  locale: AppLocale,
  notices: readonly NewsDateListItem[],
): readonly DetailedNewsDateListItem[] {
  const copy = detailCopy[locale];

  return notices.map((notice) => ({
    ...notice,
    author: copy.author,
    categoryName: copy.categoryName,
    content: [
      notice.summary,
      copy.purpose(notice.title),
      copy.instructions,
    ],
    sourceUrl: notice.href,
  }));
}

const noticesByLocale: Record<
  AppLocale,
  readonly DetailedNewsDateListItem[]
> = {
  en: addNoticeDetails("en", englishNotices),
  vi: addNoticeDetails("vi", vietnameseNotices),
  zh: addNoticeDetails("zh", chineseNotices),
};

export function getNotices(locale: AppLocale) {
  return noticesByLocale[locale].slice(0, 3);
}

export function getNotice(locale: AppLocale, articleId: string) {
  return noticesByLocale[locale].find((notice) => notice.id === articleId);
}
