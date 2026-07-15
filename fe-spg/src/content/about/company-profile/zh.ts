import type { CompanyProfileContent } from "./types";

export const companyProfileZh = {
  heading: "集团介绍",
  introduction: [
    "【临时内容】山东港口装备集团的正式企业介绍尚待审核。最终文案将简要说明组织概况、专业能力以及面向客户的发展方向。",
    "经批准的资料将介绍港口装备、工业物流解决方案和技术服务，不使用未经核实的数据或企业声明。",
  ],
  blocks: [
    {
      id: "port-handling",
      image: {
        alt: "港口岸桥旁的集装箱船",
        height: 425,
        position: "right",
        src: "/images/public/files/image/about_introduction_img10.jpg",
        width: 698,
      },
      paragraphs: [
        "【临时内容】本段将用于介绍港口装卸解决方案，以及面向不同运营场景的技术服务组织方式。",
        "相关信息得到确认后，正式文案可说明设备范围、项目协同方式，以及安全性、可靠性和可维护性要求。",
        "专业术语和产品分类将依据经批准的企业资料更新。",
      ],
    },
    {
      id: "coastal-facility",
      image: {
        alt: "沿海工业码头航拍景观",
        height: 425,
        position: "left",
        src: "/images/public/files/image/about_introduction_img11.jpg",
        width: 698,
      },
      paragraphs: [
        "【临时内容】本段预留用于介绍散料装卸设备、船舶相关系统和沿海工业解决方案。",
        "如相关业务得到企业确认，正式版本可说明专业团队在设计、制造、安装和运营支持中的参与方式。",
        "应用行业和客户覆盖范围仅会依据获准发布的资料进行说明。",
      ],
    },
    {
      id: "industrial-logistics",
      image: {
        alt: "带有储罐区的工业港口航拍景观",
        height: 734,
        position: "right",
        src: "/images/public/files/image/about_introduction_img12.jpg",
        width: 698,
      },
      paragraphs: [
        "【临时内容】这一较长的内容区将介绍工业结构、内部物流、仓储设施和物料运输系统等相关能力。",
        "最终文案可按运营场景组织解决方案，使读者清晰了解业务范围，并保留企业确认的专业术语。",
        "专用设备、控制系统或集成服务信息将在正式资料获批后补充。",
        "车间规模、生产能力、市场和代表项目目前尚未核实，因此不会写入临时文案。",
        "正式内容替换这些段落时，可以保留当前结构，以维持页面节奏和编辑式布局。",
      ],
    },
  ],
  advantages: [
    "【临时内容】此区域用于放置企业审核通过的核心优势说明。",
    "第一，正式文案将说明如何理解客户需求，并为不同应用场景形成对应方案。",
    "第二，在资料得到核实后，可介绍专业单位与项目支持团队之间的协同方式。",
    "第三，研发、设计和制造能力将使用经过审核的信息呈现，不采用推测数据。",
    "第四，经批准的资料可说明质量标准、控制流程和交付后的服务。",
    "第五，企业文化相关内容将使用企业提供的正式表述。",
    "第六，市场、客户和服务网络信息仅在获得发布授权后展示。",
    "最后，结尾段落将根据已批准资料概括发展方向和客户服务承诺。",
  ],
} as const satisfies CompanyProfileContent;
