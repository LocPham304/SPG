import type { AppLocale } from "@/i18n/routing";

export type ContactDetails = {
  address: string;
  businessPhone?: string;
  company: string;
  fax?: string;
  mailbox?: string;
  phone?: string;
  postcode?: string;
};

export type ContactContent = {
  description: string;
  heroTitle: string;
  labels: {
    address: string;
    businessPhone: string;
    fax: string;
    mailbox: string;
    phone: string;
    postcode: string;
  };
  marketingDescription: string;
  marketingTitle: string;
  pageTitle: string;
  primary: ContactDetails;
  network: readonly ContactDetails[];
};

const content: Record<AppLocale, ContactContent> = {
  en: {
    heroTitle: "Contact us",
    pageTitle: "Contact",
    marketingTitle: "Marketing Network",
    description:
      "Contact Shandong Port Equipment Group and view its marketing network.",
    marketingDescription:
      "Contact details for the companies in Shandong Port Equipment Group's marketing network.",
    labels: {
      address: "Address",
      businessPhone: "Business Phones",
      fax: "Fax",
      mailbox: "Mailbox",
      phone: "Phone",
      postcode: "Postcode",
    },
    primary: {
      company: "Shandong Port Equipment Group Co., Ltd",
      address:
        "No. 877, Lijiang West Road, Huangdao District, Qingdao City",
      phone: "0532-82983063",
      mailbox: "zbjt@spe.cn",
      businessPhone: "0532-82985191",
    },
    network: [
      {
        company: "Rizhao Gangda Shipbuilding Heavy Industry Co., Ltd",
        address:
          "Rizhao City Shanghai Road South, Haibin 5th Road East (Rizhao Port Area)",
        fax: "",
        phone: "+86-0633-8387126",
        mailbox: "consult@rpic.cc",
        postcode: "",
      },
      {
        company: "Qingdao Port Equipment Manufacturing Co., Ltd",
        address:
          "No. 58A, Ganghuan Road, Shibei District, Qingdao City",
        fax: "86-532-82982509",
        phone: "+86-0532-82982557",
        mailbox: "shihcangbu.gi@qdport.com",
        postcode: "266011",
      },
      {
        company: "Rizhao Port Marine Machinery Industry Co., Ltd",
        address:
          "Block C, Rizhao Port International Trade Center, East of Shanghai Road, Donggang District, Rizhao City",
        fax: "",
        phone: "+86-0633-8360889",
        mailbox: "consult@rpic.cc",
        postcode: "276800",
      },
      {
        company: "Shandong Luhai Heavy Industry Co., Ltd",
        address: "No. 23, Haigang Road, Zhifu District, Yantai City",
        fax: "0535-6742563",
        phone: "+86-0535-6742566",
        mailbox: "jyk@ytpmc.com",
        postcode: "266400",
      },
    ],
  },
  vi: {
    heroTitle: "Liên hệ",
    pageTitle: "Liên hệ",
    marketingTitle: "Mạng lưới tiếp thị",
    description:
      "Thông tin liên hệ của Tập đoàn Thiết bị Cảng Sơn Đông và mạng lưới tiếp thị.",
    marketingDescription:
      "Thông tin liên hệ của các công ty trong mạng lưới tiếp thị thuộc Tập đoàn Thiết bị Cảng Sơn Đông.",
    labels: {
      address: "Địa chỉ",
      businessPhone: "Điện thoại kinh doanh",
      fax: "Fax",
      mailbox: "Hộp thư",
      phone: "Điện thoại",
      postcode: "Mã bưu chính",
    },
    primary: {
      company: "Tập đoàn Thiết bị Cảng Sơn Đông",
      address:
        "Số 877, đường Lijiang Tây, quận Huangdao, thành phố Thanh Đảo",
      phone: "0532-82983063",
      mailbox: "zbjt@spe.cn",
      businessPhone: "0532-82985191",
    },
    network: [
      {
        company:
          "Công ty TNHH Công nghiệp nặng Đóng tàu Gangda Nhật Chiếu",
        address:
          "Phía nam đường Shanghai, phía đông đường Haibin 5, thành phố Nhật Chiếu (khu vực Cảng Nhật Chiếu)",
        fax: "",
        phone: "+86-0633-8387126",
        mailbox: "consult@rpic.cc",
        postcode: "",
      },
      {
        company: "Công ty TNHH Sản xuất Thiết bị Cảng Thanh Đảo",
        address:
          "Số 58A, đường Ganghuan, quận Shibei, thành phố Thanh Đảo",
        fax: "86-532-82982509",
        phone: "+86-0532-82982557",
        mailbox: "shihcangbu.gi@qdport.com",
        postcode: "266011",
      },
      {
        company:
          "Công ty TNHH Công nghiệp Máy móc Hàng hải Cảng Nhật Chiếu",
        address:
          "Tòa C, Trung tâm Thương mại Quốc tế Cảng Nhật Chiếu, phía đông đường Shanghai, quận Donggang, thành phố Nhật Chiếu",
        fax: "",
        phone: "+86-0633-8360889",
        mailbox: "consult@rpic.cc",
        postcode: "276800",
      },
      {
        company: "Công ty TNHH Công nghiệp nặng Lục Hải Sơn Đông",
        address:
          "Số 23, đường Haigang, quận Zhifu, thành phố Yên Đài",
        fax: "0535-6742563",
        phone: "+86-0535-6742566",
        mailbox: "jyk@ytpmc.com",
        postcode: "266400",
      },
    ],
  },
  zh: {
    heroTitle: "联系我们",
    pageTitle: "联系我们",
    marketingTitle: "营销网络",
    description: "山东陆海装备集团联系信息与营销网络。",
    marketingDescription: "山东陆海装备集团营销网络各公司的联系信息。",
    labels: {
      address: "地址",
      businessPhone: "业务电话",
      fax: "传真",
      mailbox: "邮箱",
      phone: "电话",
      postcode: "邮编",
    },
    primary: {
      company: "山东陆海装备集团有限公司",
      address: "青岛市黄岛区漓江西路877号",
      phone: "0532-82983063",
      mailbox: "sealand@sd-port.com",
      businessPhone: "0532-82985606",
    },
    network: [
      {
        company: "日照港达船舶重工有限公司",
        address: "日照市上海路南、海滨五路东（日照港区内）",
        fax: "",
        phone: "0633-8387126",
        mailbox: "sghg@spe.cn",
        postcode: "",
      },
      {
        company: "山东陆海装备集团青岛有限公司",
        address: "青岛市市北区港寰路58号甲",
        fax: "0532-82982509",
        phone: "0532-82982557",
        mailbox: "qdzb@spe.cn",
        postcode: "266011",
      },
      {
        company: "山东陆海装备集团日照有限公司",
        address: "日照市东港区上海路东首日照港国贸中心C座",
        fax: "",
        phone: "0633-8360889",
        mailbox: "rzcj@spe.cn",
        postcode: "276800",
      },
      {
        company: "山东陆海装备集团烟台有限公司",
        address: "烟台市芝罘区海港路23号",
        fax: "0535-6742563",
        phone: "0535-6744219",
        mailbox: "lhzg@spe.cn",
        postcode: "266400",
      },
    ],
  },
};

export function getContactContent(locale: AppLocale) {
  return content[locale];
}
