import type { AppLocale } from "@/i18n/routing";

export type CompanyHistoryEvent = {
  year: string;
  description: string;
  side: "left" | "right";
};

export type CompanyHistoryContent = {
  title: string;
  scrollLabel: string;
  events: readonly CompanyHistoryEvent[];
};

const historyContent = {
  en: {
    title: "History",
    scrollLabel: "Scroll through company history",
    events: [
      {
        year: "2023",
        description:
          "Shangang (Shandong) Offshore Equipment Co., Ltd. was established, and Shanghai Xiadong Lifting Equipment Technology Co., Ltd. was acquired.",
        side: "right",
      },
      {
        year: "2020",
        description:
          "Shandong Port Equipment Group Co., Ltd. was established together with three subsidiaries: Qingdao Port Equipment Manufacturing Co., Ltd., Rizhao Marine Machinery Industry Co., Ltd. and Shandong Luhai Heavy Industry Co., Ltd.",
        side: "left",
      },
      {
        year: "2017",
        description:
          "Rizhao Marine Machinery Industry Co., Ltd. was established. Rizhao Gangda Shipbuilding Heavy Industry Co., Ltd. and Rizhao Port Machinery Engineering Co., Ltd. became secondary subsidiaries.",
        side: "right",
      },
      {
        year: "2007",
        description:
          "Rizhao Gangda Shipbuilding Heavy Industry Co., Ltd. was established.",
        side: "left",
      },
      {
        year: "1985",
        description:
          "Rizhao Port Machinery Repair Factory was established and later renamed Rizhao Port Machinery Engineering Co., Ltd.",
        side: "right",
      },
      {
        year: "1960",
        description:
          "Qingdao Port Authority Machinery Repair Plant was established and later became the Port Machinery Branch of Qingdao Port International Co., Ltd.",
        side: "left",
      },
      {
        year: "1957",
        description:
          "Yantai Port Authority Machine Repair Plant was established and later restructured.",
        side: "right",
      },
    ],
  },
  vi: {
    title: "Lịch sử",
    scrollLabel: "Cuộn để xem lịch sử công ty",
    events: [
      {
        year: "2023",
        description:
          "Thành lập Công ty TNHH Thiết bị Ngoài khơi Shangang (Sơn Đông) và mua lại Công ty TNHH Công nghệ Thiết bị Nâng hạ Shanghai Xiadong.",
        side: "right",
      },
      {
        year: "2020",
        description:
          "Thành lập Shandong Port Equipment Group Co., Ltd. cùng ba công ty thành viên: Qingdao Port Equipment Manufacturing Co., Ltd., Rizhao Marine Machinery Industry Co., Ltd. và Shandong Luhai Heavy Industry Co., Ltd.",
        side: "left",
      },
      {
        year: "2017",
        description:
          "Thành lập Rizhao Marine Machinery Industry Co., Ltd.; Rizhao Gangda Shipbuilding Heavy Industry Co., Ltd. và Rizhao Port Machinery Engineering Co., Ltd. trở thành các công ty cấp hai.",
        side: "right",
      },
      {
        year: "2007",
        description:
          "Thành lập Rizhao Gangda Shipbuilding Heavy Industry Co., Ltd.",
        side: "left",
      },
      {
        year: "1985",
        description:
          "Thành lập Nhà máy Sửa chữa Máy móc Cảng Nhật Chiếu, sau đó đổi tên thành Rizhao Port Machinery Engineering Co., Ltd.",
        side: "right",
      },
      {
        year: "1960",
        description:
          "Thành lập Nhà máy Sửa chữa Máy móc Cảng Thanh Đảo, sau đó trở thành Chi nhánh Máy móc Cảng của Qingdao Port International Co., Ltd.",
        side: "left",
      },
      {
        year: "1957",
        description:
          "Thành lập Nhà máy Sửa chữa Máy móc Cảng Yên Đài và sau đó được tổ chức lại.",
        side: "right",
      },
    ],
  },
  zh: {
    title: "发展历程",
    scrollLabel: "滚动查看公司发展历程",
    events: [
      {
        year: "2023",
        description:
          "山港（山东）海工装备有限公司成立，并收购上海夏东起重设备科技有限公司。",
        side: "right",
      },
      {
        year: "2020",
        description:
          "山东港口装备集团有限公司成立，并设立青岛港口装备制造有限公司、日照港机工程有限公司和山东陆海重工有限公司三家所属企业。",
        side: "left",
      },
      {
        year: "2017",
        description:
          "日照港船机工业有限公司成立，日照港达船舶重工有限公司和日照港机工程有限公司成为二级企业。",
        side: "right",
      },
      {
        year: "2007",
        description: "日照港达船舶重工有限公司成立。",
        side: "left",
      },
      {
        year: "1985",
        description:
          "日照港机械修理厂成立，后更名为日照港机工程有限公司。",
        side: "right",
      },
      {
        year: "1960",
        description:
          "青岛港务局机械修理厂成立，后发展为青岛港国际股份有限公司港机分公司。",
        side: "left",
      },
      {
        year: "1957",
        description: "烟台港务局机械修理厂成立，后完成改制。",
        side: "right",
      },
    ],
  },
} as const satisfies Record<AppLocale, CompanyHistoryContent>;

export function getCompanyHistoryContent(locale: AppLocale) {
  return historyContent[locale];
}
