import type { CompanyProfileContent } from "./types";

export const companyProfileEn = {
  heading: "Group introduction",
  introduction: [
    "[Temporary content] The approved corporate introduction for Shandong Port Equipment Group is still pending review. The final copy will provide a concise overview of the organisation, its professional capabilities and its customer-focused direction.",
    "Approved material will describe the company’s port equipment, industrial logistics solutions and technical services without relying on unverified figures or unsupported corporate claims.",
  ],
  blocks: [
    {
      id: "port-handling",
      image: {
        alt: "Container vessel alongside quay cranes at a port",
        height: 425,
        position: "right",
        src: "/images/public/files/image/about_introduction_img10.jpg",
        width: 698,
      },
      paragraphs: [
        "[Temporary content] This block is reserved for an introduction to port-handling solutions and the way technical services are organised for different operating scenarios.",
        "Approved copy may explain the relevant equipment scope, project coordination model and requirements for safety, reliability and maintainability once those details have been confirmed.",
        "Technical terminology and product categories will be updated from approved corporate material.",
      ],
    },
    {
      id: "coastal-facility",
      image: {
        alt: "Aerial view of a coastal industrial terminal",
        height: 425,
        position: "left",
        src: "/images/public/files/image/about_introduction_img11.jpg",
        width: 698,
      },
      paragraphs: [
        "[Temporary content] This block is intended for information about bulk-handling equipment, ship-related systems and coastal industrial solutions.",
        "The approved version can explain how specialist teams participate in design, manufacturing, installation and operational support where these activities are confirmed by the company.",
        "Application sectors and customer coverage will only be published from authorised source material.",
      ],
    },
    {
      id: "industrial-logistics",
      image: {
        alt: "Aerial industrial port and oil-storage facility",
        height: 734,
        position: "right",
        src: "/images/public/files/image/about_introduction_img12.jpg",
        width: 698,
      },
      paragraphs: [
        "[Temporary content] This longer block will cover capabilities related to industrial structures, internal logistics, storage facilities and material-transport systems.",
        "The final description may organise solutions by operating scenario so that readers can follow the portfolio while preserving terminology approved by the company.",
        "Information about specialist equipment, control systems or integrated services will be added when approved documentation becomes available.",
        "Workshop scale, production capacity, markets and representative projects are not currently verified and are therefore omitted from this temporary copy.",
        "When approved content replaces these paragraphs, the same structure can be retained to preserve the page rhythm and editorial layout.",
      ],
    },
  ],
  advantages: [
    "[Temporary content] This area is reserved for the company’s approved statement of core advantages.",
    "First, the final copy will explain how customer requirements are assessed and translated into solutions for different application scenarios.",
    "Second, it may describe coordination between specialist units and project-support functions, subject to verified source material.",
    "Third, research, design and manufacturing capabilities will be presented with reviewed information rather than estimated figures.",
    "Fourth, approved material may outline quality standards, control processes and post-delivery services.",
    "Fifth, corporate-culture statements will use the official wording supplied by the company.",
    "Sixth, market, customer and service-network information will only appear where publication has been authorised.",
    "Finally, the closing paragraph will summarise the approved development direction and customer-service commitment.",
  ],
} as const satisfies CompanyProfileContent;
