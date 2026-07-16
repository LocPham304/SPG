import type { AppLocale } from "@/i18n/routing";
import type { NewsDateListItem } from "@/types/news";

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

const noticesByLocale: Record<AppLocale, readonly NewsDateListItem[]> = {
  en: englishNotices,
  vi: vietnameseNotices,
  zh: chineseNotices,
};

export function getNotices(locale: AppLocale) {
  return noticesByLocale[locale];
}
