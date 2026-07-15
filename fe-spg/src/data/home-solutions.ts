export type HomeSolutionId =
  | "containerHandling"
  | "dryBulk"
  | "breakbulk"
  | "liquefiedOil"
  | "grainSilo"
  | "smartLogistics"
  | "shipbuildingRepair"
  | "otherServices";

export type HomeSolutionItem = {
  id: HomeSolutionId;
  image: string;
  href: "/products";
  objectPosition?: string;
};

export const homeSolutionItems = [
  {
    id: "containerHandling",
    image: "/images/public/files/image/index_img9.jpg",
    href: "/products",
  },
  {
    id: "dryBulk",
    image: "/images/public/files/image/index_img10.jpg",
    href: "/products",
  },
  {
    id: "breakbulk",
    image: "/images/public/files/image/index_img11.jpg",
    href: "/products",
  },
  {
    id: "liquefiedOil",
    image: "/images/public/files/image/index_img_yh.jpg",
    href: "/products",
  },
  {
    id: "grainSilo",
    image: "/images/public/files/image/index_img_ls.jpg",
    href: "/products",
  },
  {
    id: "smartLogistics",
    image: "/images/public/files/image/index_wly.jpg",
    href: "/products",
  },
  {
    id: "shipbuildingRepair",
    image: "/images/public/files/image/index_xc.jpg",
    href: "/products",
  },
  {
    id: "otherServices",
    image: "/images/public/files/image/indexnew7.jpg",
    href: "/products",
    objectPosition: "36% center",
  },
] as const satisfies readonly HomeSolutionItem[];
