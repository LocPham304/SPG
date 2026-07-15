export type HomeTechnologyCategoryId =
  | "rdLayout"
  | "achievements"
  | "majorProject";

export type HomeTechnologyStatId =
  | "highTech"
  | "specialized"
  | "platforms"
  | "majorEquipment"
  | "progressAwards"
  | "governmentAwards"
  | "standards"
  | "patents";

export type HomeTechnologyIcon = "atom" | "achievement" | "project";

export type HomeTechnologyProjectId =
  | "scatterSet"
  | "deepSeaCages"
  | "railCrane"
  | "provincialPlan"
  | "transportProject";

export type HomeTechnologyStat = {
  id: HomeTechnologyStatId;
  value: number;
  secondaryValue?: number;
};

export type HomeTechnologyCategory = {
  id: HomeTechnologyCategoryId;
  image: string;
  icon: HomeTechnologyIcon;
  stats?: readonly HomeTechnologyStat[];
  projectItemIds?: readonly HomeTechnologyProjectId[];
};

export const homeTechnologyCategories: readonly HomeTechnologyCategory[] = [
  {
    id: "rdLayout",
    image: "/images/public/files/image/index_img12.jpg",
    icon: "atom",
    stats: [
      { id: "highTech", value: 4 },
      { id: "specialized", value: 3 },
      { id: "platforms", value: 5 },
    ],
  },
  {
    id: "achievements",
    image: "/images/public/files/image/index_img13.jpg",
    icon: "achievement",
    stats: [
      { id: "majorEquipment", value: 2 },
      { id: "progressAwards", value: 5, secondaryValue: 4 },
      { id: "governmentAwards", value: 4 },
      { id: "standards", value: 3 },
      { id: "patents", value: 121 },
    ],
  },
  {
    id: "majorProject",
    image: "/images/public/files/image/index_img14.jpg",
    icon: "project",
    projectItemIds: [
      "scatterSet",
      "deepSeaCages",
      "railCrane",
      "provincialPlan",
      "transportProject",
    ],
  },
];
