export type CompanyProfileBlock = {
  id: string;
  image: {
    alt: string;
    height: number;
    position: "left" | "right";
    src: string;
    width: number;
  };
  paragraphs: readonly string[];
};

export type CompanyProfileContent = {
  heading: string;
  introduction: readonly string[];
  blocks: readonly CompanyProfileBlock[];
  serviceAudienceHighlights: readonly string[];
  advantages: readonly string[];
};
