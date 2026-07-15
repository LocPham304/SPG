export type HomeBaseId =
  | "qingdao"
  | "rizhao"
  | "yantai"
  | "haiyang"
  | "huaihai";

export type HomeBaseDescriptionKey =
  | "items.qingdao.companyOne"
  | "items.qingdao.companyTwo"
  | "items.rizhao.companyOne"
  | "items.rizhao.companyTwo"
  | "items.rizhao.companyThree"
  | "items.yantai.companyOne"
  | "items.haiyang.status"
  | "items.huaihai.status";

export type HomeBaseItem = {
  id: HomeBaseId;
  descriptionKeys: readonly HomeBaseDescriptionKey[];
  status: "available" | "under-construction";
};

export const homeBaseItems = [
  {
    id: "qingdao",
    descriptionKeys: [
      "items.qingdao.companyOne",
      "items.qingdao.companyTwo",
    ],
    status: "available",
  },
  {
    id: "rizhao",
    descriptionKeys: [
      "items.rizhao.companyOne",
      "items.rizhao.companyTwo",
      "items.rizhao.companyThree",
    ],
    status: "available",
  },
  {
    id: "yantai",
    descriptionKeys: ["items.yantai.companyOne"],
    status: "available",
  },
  {
    id: "haiyang",
    descriptionKeys: ["items.haiyang.status"],
    status: "under-construction",
  },
  {
    id: "huaihai",
    descriptionKeys: ["items.huaihai.status"],
    status: "under-construction",
  },
] as const satisfies readonly HomeBaseItem[];
