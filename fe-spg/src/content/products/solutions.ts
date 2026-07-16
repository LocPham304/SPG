import type { AppLocale } from "@/i18n/routing";

export type ProductSolutionId =
  | "containerHandling"
  | "dryBulk"
  | "breakbulk"
  | "liquefiedOil"
  | "grainSilo"
  | "smartLogistics"
  | "shipbuildingRepair"
  | "otherServices";

export type ProductSolutionItem = {
  id: ProductSolutionId;
  title: string;
  image: string;
  href: string;
  external: boolean;
};

export type ProductMapHotspot = {
  id: string;
  x: number;
  y: number;
  align?: "start" | "end";
  sections: readonly {
    title: string;
    description?: string;
  }[];
};

export type ProductSolutionsContent = {
  navigationLabel: string;
  mapTitle: string;
  learnMoreLabel: string;
  items: readonly ProductSolutionItem[];
  hotspots: readonly ProductMapHotspot[];
};

const solutionIds: readonly ProductSolutionId[] = [
  "containerHandling",
  "dryBulk",
  "breakbulk",
  "liquefiedOil",
  "grainSilo",
  "smartLogistics",
  "shipbuildingRepair",
  "otherServices",
];

const solutionImages: Record<ProductSolutionId, string> = {
  containerHandling:
    "/images/public/files/image/solution_jizhuangxiang1.jpg",
  dryBulk: "/images/public/files/image/solution_gansanhuo1.jpg",
  breakbulk: "/images/public/files/image/solution_jianzahuo1.jpg",
  liquefiedOil: "/images/public/files/image/solution_yehuayou1.jpg",
  grainSilo: "/images/public/files/image/solution_liangshitong1.jpg",
  smartLogistics:
    "/images/public/files/image/solution_zhihuiwuliu1.jpg",
  shipbuildingRepair:
    "/images/public/files/image/solution_xiuzaochuan1.jpg",
  otherServices:
    "/images/public/files/image/120f7fd434ea34982fbd06f12b78d065.jpg",
};

const englishTitles: Record<ProductSolutionId, string> = {
  containerHandling: "Container handling systems",
  dryBulk: "Dry bulk handling systems",
  breakbulk: "Breakbulk handling systems",
  liquefiedOil: "Liquefied oil handling systems",
  grainSilo: "Grain silo loading and unloading system",
  smartLogistics: "Smart logistics park",
  shipbuildingRepair: "Shipbuilding and repairing",
  otherServices: "Other products and services",
};

const vietnameseTitles: Record<ProductSolutionId, string> = {
  containerHandling: "Hệ thống xếp dỡ container",
  dryBulk: "Hệ thống xếp dỡ và vận chuyển hàng rời khô",
  breakbulk: "Hệ thống xếp dỡ hàng bách hóa",
  liquefiedOil: "Hệ thống xếp dỡ dầu hóa lỏng",
  grainSilo: "Hệ thống xếp dỡ silo ngũ cốc",
  smartLogistics: "Khu logistics thông minh",
  shipbuildingRepair: "Đóng mới và sửa chữa tàu",
  otherServices: "Sản phẩm và dịch vụ khác",
};

const chineseTitles: Record<ProductSolutionId, string> = {
  containerHandling: "集装箱装卸系统解决方案",
  dryBulk: "干散货装卸输送系统解决方案",
  breakbulk: "件杂货装卸系统解决方案",
  liquefiedOil: "液化油品装卸系统解决方案",
  grainSilo: "粮食筒仓装卸系统解决方案",
  smartLogistics: "智慧物流园区解决方案",
  shipbuildingRepair: "修造船系统解决方案",
  otherServices: "其他产品及服务",
};

const englishRoutes: Record<ProductSolutionId, string> = {
  containerHandling: "http://en.spe.cn/html/container_handling_systems/",
  dryBulk: "http://en.spe.cn/html/dry_bulk_handling_systems/",
  breakbulk: "http://en.spe.cn/html/breakbulk_handling_systems/",
  liquefiedOil: "http://en.spe.cn/html/liquefied_oil_handling_systems/",
  grainSilo:
    "http://en.spe.cn/html/grain_silo_loading_and_unloading_system/",
  smartLogistics: "http://en.spe.cn/html/smart_logistics_park/",
  shipbuildingRepair: "http://en.spe.cn/html/Shipbuilding_and_repairing/",
  otherServices: "http://en.spe.cn/html/0ther_products_and_services/",
};

const chineseRoutes: Record<ProductSolutionId, string> = {
  containerHandling:
    "http://www.spe.cn/html/container_handling_system_solutions/",
  dryBulk: "http://www.spe.cn/html/dry_bulk_handling_system_solutions/",
  breakbulk:
    "http://www.spe.cn/html/breakbulk_handling_system_solutions/",
  liquefiedOil:
    "http://www.spe.cn/html/liquefied_oil_handling_system_solutions/",
  grainSilo:
    "http://www.spe.cn/html/grain_silo_loading_and_unloading_system_solutions/",
  smartLogistics:
    "http://www.spe.cn/html/smart_logistics_park_solutions/",
  shipbuildingRepair:
    "http://www.spe.cn/html/shipbuilding_system_solutions/",
  otherServices: "http://www.spe.cn/html/other_products_and_services/",
};

const internalRoutes: Partial<Record<ProductSolutionId, string>> = {
  containerHandling: "/products/container-handling-systems",
  dryBulk: "/products/dry-bulk-handling-systems",
  breakbulk: "/products/breakbulk-handling-systems",
  liquefiedOil: "/products/liquefied-oil-handling-systems",
  grainSilo: "/products/grain-silo-system",
};

function createItems(
  titles: Record<ProductSolutionId, string>,
  routes: Record<ProductSolutionId, string>,
) {
  return solutionIds.map((id) => ({
    id,
    title: titles[id],
    image: solutionImages[id],
    href: internalRoutes[id] ?? routes[id],
    external: internalRoutes[id] === undefined,
  }));
}

const englishHotspots: readonly ProductMapHotspot[] = [
  {
    id: "terminals",
    x: 14.5,
    y: 73.5,
    sections: [
      {
        title: "Ferry terminal",
        description: "Passenger ro-ro bridge, boarding ladder",
      },
      {
        title: "Bulk terminals",
        description:
          "Gantry cranes, ship loading and unloading machines, belt conveyors, grabs",
      },
    ],
  },
  {
    id: "container-terminal",
    x: 33,
    y: 47.5,
    sections: [
      {
        title: "Container terminals",
        description: "Shore container cranes, spreaders",
      },
    ],
  },
  {
    id: "container-yard",
    x: 52.5,
    y: 53.5,
    sections: [
      {
        title: "Container yards",
        description:
          "Rail cranes, tire cranes, AIGTs, electric stackers and reach stackers",
      },
    ],
  },
  {
    id: "equipment-support",
    x: 58.5,
    y: 59,
    sections: [
      {
        title: "Equipment guarantee",
        description: "Equipment automation transformation/O&M",
      },
    ],
  },
  {
    id: "bulk-yard",
    x: 64.8,
    y: 55.8,
    sections: [
      {
        title: "Bulk cargo yard",
        description: "Stacker/reclaimer, belt conveyor, dust suppression wall",
      },
    ],
  },
  {
    id: "port-services",
    x: 73.5,
    y: 57,
    sections: [
      {
        title: "Supporting services in the port area",
        description:
          "Facilities/equipment: steel structure, slurry pump, high pole light",
      },
    ],
  },
  {
    id: "grain-oil",
    x: 85,
    y: 60.5,
    align: "end",
    sections: [
      {
        title: "Grain and oil tank farms",
        description:
          "Grain silos, air cushion belt conveyors, crude oil tank farms, crude oil pipelines",
      },
    ],
  },
  {
    id: "shipbuilding",
    x: 96.5,
    y: 61.5,
    align: "end",
    sections: [{ title: "Ship building and repair" }],
  },
];

const vietnameseHotspots: readonly ProductMapHotspot[] = [
  {
    ...englishHotspots[0],
    sections: [
      {
        title: "Bến hành khách",
        description: "Cầu nối ro-ro hành khách, thang lên tàu",
      },
      {
        title: "Bến hàng rời",
        description:
          "Cần trục chân đế, máy bốc dỡ tàu, băng tải, gầu ngoạm",
      },
    ],
  },
  {
    ...englishHotspots[1],
    sections: [
      { title: "Bến container", description: "Cẩu giàn bờ, khung nâng" },
    ],
  },
  {
    ...englishHotspots[2],
    sections: [
      {
        title: "Bãi container",
        description:
          "Cẩu ray, cẩu lốp, AIGT, xe nâng điện và xe nâng container",
      },
    ],
  },
  {
    ...englishHotspots[3],
    sections: [
      {
        title: "Bảo đảm thiết bị",
        description: "Cải tạo tự động hóa thiết bị / vận hành và bảo trì",
      },
    ],
  },
  {
    ...englishHotspots[4],
    sections: [
      {
        title: "Bãi hàng rời",
        description: "Máy đánh đống/lấy liệu, băng tải, tường chắn bụi",
      },
    ],
  },
  {
    ...englishHotspots[5],
    sections: [
      {
        title: "Dịch vụ hỗ trợ trong khu cảng",
        description:
          "Kết cấu thép cho công trình và thiết bị, bơm bùn, đèn cột cao",
      },
    ],
  },
  {
    ...englishHotspots[6],
    sections: [
      {
        title: "Khu bồn chứa ngũ cốc và dầu",
        description:
          "Silo ngũ cốc, băng tải đệm khí, bồn dầu thô, đường ống dầu thô",
      },
    ],
  },
  {
    ...englishHotspots[7],
    sections: [{ title: "Đóng mới và sửa chữa tàu" }],
  },
];

const chineseHotspots: readonly ProductMapHotspot[] = [
  {
    ...englishHotspots[0],
    sections: [
      { title: "客运码头", description: "客滚连接桥、登船梯" },
      {
        title: "散货码头",
        description: "门座式起重机、装卸船机、皮带机、抓斗",
      },
    ],
  },
  {
    ...englishHotspots[1],
    sections: [
      { title: "集装箱码头", description: "岸边集装箱起重机、吊具" },
    ],
  },
  {
    ...englishHotspots[2],
    sections: [
      {
        title: "集装箱堆场",
        description: "轨道吊、轮胎吊、AIGT、电动堆高机和正面吊",
      },
    ],
  },
  {
    ...englishHotspots[3],
    sections: [
      { title: "设备保障", description: "设备自动化改造/运维" },
    ],
  },
  {
    ...englishHotspots[4],
    sections: [
      { title: "散货堆场", description: "堆/取料机、皮带机、抑尘墙" },
    ],
  },
  {
    ...englishHotspots[5],
    sections: [
      {
        title: "港区配套服务",
        description: "设施/设备钢结构、渣浆泵、高杆灯",
      },
    ],
  },
  {
    ...englishHotspots[6],
    sections: [
      {
        title: "粮油罐区",
        description: "粮食筒仓、气垫皮带机、原油罐区、原油管线",
      },
    ],
  },
  {
    ...englishHotspots[7],
    sections: [{ title: "船舶造修" }],
  },
];

const contentByLocale: Record<AppLocale, ProductSolutionsContent> = {
  en: {
    navigationLabel: "Products and solutions navigation",
    mapTitle:
      "The business field realizes full coverage of port application scenarios",
    learnMoreLabel: "Learn more",
    items: createItems(englishTitles, englishRoutes),
    hotspots: englishHotspots,
  },
  vi: {
    navigationLabel: "Điều hướng sản phẩm và giải pháp",
    mapTitle:
      "Lĩnh vực kinh doanh bao phủ toàn bộ các kịch bản ứng dụng tại cảng",
    learnMoreLabel: "Tìm hiểu thêm",
    items: createItems(vietnameseTitles, englishRoutes),
    hotspots: vietnameseHotspots,
  },
  zh: {
    navigationLabel: "产品与解决方案导航",
    mapTitle: "业务领域实现港口应用场景全覆盖",
    learnMoreLabel: "查看详情",
    items: createItems(chineseTitles, chineseRoutes),
    hotspots: chineseHotspots,
  },
};

export function getProductSolutionsContent(locale: AppLocale) {
  return contentByLocale[locale];
}
