import type { AppLocale } from "@/i18n/routing";

import type { ContainerHandlingGalleryItem } from "./container-handling";

type DryBulkSectionId =
  | "port-portal-crane"
  | "ship-loader-unloader"
  | "stacker-reclaimer"
  | "belt-conveyor"
  | "barge-platform";

type LocalizedText = Record<AppLocale, string>;

type GalleryAsset = {
  file: string;
  caption: LocalizedText;
};

export type DryBulkHandlingContent = {
  title: string;
  description: string;
  productsLabel: string;
  intro: string;
  previousLabel: string;
  nextLabel: string;
  galleryLabel: string;
  sections: readonly {
    id: DryBulkSectionId;
    title: string;
    paragraphs: readonly string[];
    images: readonly ContainerHandlingGalleryItem[];
  }[];
};

const assetRoot = "/images/Dry bulk handling systems";

function asset(file: string, en: string, vi: string, zh: string): GalleryAsset {
  return { file, caption: { en, vi, zh } };
}

const galleryAssets: Record<DryBulkSectionId, readonly GalleryAsset[]> = {
  "port-portal-crane": [
    asset("3342a75ed56be700aec700fff1351606.gif", "Automatic portal crane", "Cẩu chân đế tự động", "自动化门机"),
    asset("7944e491f330f09056626d8dcc7a61b9_lp.jpg", "Fujian Jiangyin Port - 40T43M portal crane", "Cẩu chân đế 40T43M tại Cảng Giang Âm, Phúc Kiến", "福建江阴港-40T43M门机"),
    asset("7ddbc3f321cf7d5a6abf27139d484492_lp.jpg", "Jiangxi Zhangshugang - 25T25M portal crane", "Cẩu chân đế 25T25M tại Cảng Chương Thụ, Giang Tây", "江西樟树港-25T25M门机"),
    asset("4e555637187070aa673240814bac12e7_lp.jpg", "Jiangsu Yangzhou Port - 40T40M portal crane", "Cẩu chân đế 40T40M tại Cảng Dương Châu, Giang Tô", "江苏扬州港-40T40M门机"),
    asset("63945706d6c79b2703eb303995cea398_lp.jpg", "Russia Vladivostok - 60T45M portal crane", "Cẩu chân đế 60T45M tại Vladivostok, Nga", "俄罗斯海参崴-60T45M门机"),
    asset("2168d86c21587ba4d950b98a84ac3b8b_lp.jpg", "Jiangsu Zhenjiang Port - 40T40M portal crane", "Cẩu chân đế 40T40M tại Cảng Trấn Giang, Giang Tô", "江苏镇江港-40T40M门机"),
    asset("08aa27ea475dcbbaf51687216dc1e48d_lp.jpg", "Qingdao Port Datang - 40T40M portal crane", "Cẩu chân đế 40T40M tại Đại Đường, Cảng Thanh Đảo", "青岛港大唐-40T40M门机"),
    asset("33761b62910b20238320256ca3098837_lp.jpg", "Qingdao Port Dongfen - 40T40M portal crane", "Cẩu chân đế 40T40M tại Dongfen, Cảng Thanh Đảo", "青岛港董分-40T40M门机"),
    asset("64bbdad5c0ab1eba2f9419732c40142d_lp.jpg", "Qingdao Port Dongjiakou Huaneng - 40T40M portal crane", "Cẩu chân đế 40T40M tại Huaneng Dongjiakou, Cảng Thanh Đảo", "青岛港董家口华能-40T40M门机"),
    asset("b22a26a2b3b55c9d3253aa3d7a268974_lp.jpg", "Qingdao Port Xilian - 40T43M portal crane", "Cẩu chân đế 40T43M tại Xilian, Cảng Thanh Đảo", "青岛港西联-40T43M门机"),
    asset("e61f19ee7bbdee5ca59c07a19334ca66_lp.jpg", "Qingdao Port Dagang - 45T40M portal crane", "Cẩu chân đế 45T40M tại Dagang, Cảng Thanh Đảo", "青岛港大港-45T40M门机"),
    asset("0fc117591f1df320b564b18807e31aad_lp.jpg", "Qingdao Port Xilian - 40T43M portal crane", "Cẩu chân đế 40T43M tại Xilian, Cảng Thanh Đảo", "青岛港西联-40T43M门机"),
    asset("8e39b6891662d820106816e77ee18d2f_lp.jpg", "Tianjin Yuanhang - 40T45M portal crane", "Cẩu chân đế 40T45M tại Yuanhang, Thiên Tân", "天津远航-40T45M门机"),
    asset("82637bb82632b997eec8a832ef8ba69a_lp.jpg", "Tianjin Coal Terminal - 40T45M portal crane", "Cẩu chân đế 40T45M tại Bến than Thiên Tân", "天津煤码头-40T45M门机"),
    asset("c6edad351aec31e5bdcc170b04d6a220_lp.jpg", "Tianjin Port - 25T35M portal crane", "Cẩu chân đế 25T35M tại Cảng Thiên Tân", "天津港-25T35M门机"),
  ],
  "ship-loader-unloader": [
    asset("d21ea94b2793ab2c2b8e96ea83ad548f_lp.jpg", "Qingdao Port Dong Mine 200,000-ton wharf - ship loader", "Máy xếp hàng lên tàu tại bến 200.000 tấn Dong Mine, Cảng Thanh Đảo", "青岛港董矿20万吨码头-装船机"),
    asset("61cd3199a9f5c392d1bd3a710e9a2875_lp.jpg", "Qingdao Port Dong Mine 400,000-ton wharf - bridge grab ship unloader", "Máy dỡ tàu gầu ngoạm kiểu cầu tại bến 400.000 tấn Dong Mine, Cảng Thanh Đảo", "青岛港董矿40万吨码头-桥式抓斗卸船机"),
  ],
  "stacker-reclaimer": [
    asset("26d59c1719e95a3687904be3a6bb7a2d.gif", "Stacker-reclaimer", "Máy đánh đống/lấy liệu", "堆取料机"),
    asset("a75400de2286cc8373d6385625343a3f_lp.jpg", "China's first environmental protection solution for converting coke bulk cargo to containers", "Giải pháp môi trường đầu tiên tại Trung Quốc chuyển than cốc rời sang container", "国内首创焦炭散货改集装箱（散改集）工艺系统环保解决方案"),
    asset("a5559ad7dc0d117d375ddca40894f16d_lp.jpg", "Rizhao Port", "Cảng Nhật Chiếu", "日照港"),
    asset("868659aaa1b77ba0b98ef481eba0c85a_lp.jpg", "Rizhao Port", "Cảng Nhật Chiếu", "日照港"),
    asset("89245a51f05d6ecf46e071266d99e5b0_lp.jpg", "Rizhao Port", "Cảng Nhật Chiếu", "日照港"),
    asset("afe7a15b8e9cb77883df0f1789e419b4_lp.jpg", "Rizhao Port Shijiu area - 12000t/h stacker-reclaimer intelligent O&M system", "Hệ thống vận hành và bảo trì cảm nhận thông minh máy đánh đống/lấy liệu 12.000 tấn/giờ tại khu Shijiu, Cảng Nhật Chiếu", "日照港石臼港区-12000t/h堆取料机智慧感知运维系统"),
  ],
  "belt-conveyor": [
    asset("08e9b86832ed43b56dc35d9234e89ed0_lp.jpg", "Huaneng Rizhao Power Plant - China's largest-diameter coal conveying pipe belt conveyor", "Băng tải ống vận chuyển than có đường kính lớn nhất Trung Quốc tại Nhà máy điện Huaneng Nhật Chiếu", "华能日照电厂-国内最大管径输煤通道管带机"),
    asset("c6702c427ceb74811ae1d674f54fa808_lp.jpg", "Hainan Jinhai Pulp & Paper - belt conveyor", "Băng tải tại Nhà máy Bột giấy & Giấy Jinhai Hải Nam", "海南金海浆纸-皮带机"),
    asset("4da545195b4bb4c35851dde57fbc68b2_lp.jpg", "Guinea State Power Investment - belt conveyor", "Băng tải tại dự án SPIC Guinea", "几内亚国电投-皮带机"),
    asset("5aa572fafa93182eac7f1dfc93bbc4a7_lp.jpg", "Guangxi Fangchenggang steel base - belt conveyor", "Băng tải tại khu liên hợp thép Phòng Thành Cảng, Quảng Tây", "广西防城港-钢铁基地皮带机"),
    asset("91bd899b6b33e3eafd6afdf1ac8d71f6_lp.jpg", "Hainan Jinhai Pulp & Paper - belt conveyor", "Băng tải tại Nhà máy Bột giấy & Giấy Jinhai Hải Nam", "海南金海浆纸-皮带机"),
    asset("dddae6df83fb7324ea3fcde4ba890d88_lp.jpg", "Rizhao Port - southern area process system", "Hệ thống quy trình khu phía Nam, Cảng Nhật Chiếu", "日照港-南区流程化"),
    asset("2ec602128ca491dfa4e13829b0463455_lp.jpg", "Guinea - belt conveyor", "Băng tải tại Guinea", "几内亚-皮带机"),
    asset("52254d4758684fede96eecc1d6baddbc_lp.jpg", "Lannan Berth 11 - belt conveyor", "Băng tải tại bến số 11 Lannan", "岚南11泊-皮带机"),
    asset("6834f638eb149ae0f9574b4a3e15139e_lp.jpg", "Rizhao Lanshan Port - China's largest-capacity ore pipe belt conveyor", "Băng tải ống quặng có công suất lớn nhất Trung Quốc tại Cảng Lanshan, Nhật Chiếu", "日照岚山港-国内最大运量矿石输送管带机"),
    asset("f76ca08f1c6603819a3d550f6361f70f_lp.jpg", "Rizhao Port - southern area process system", "Hệ thống quy trình khu phía Nam, Cảng Nhật Chiếu", "日照港-南区流程化"),
    asset("e0abd4fe95edeb4495910f3ead61dc33_lp.jpg", "Rizhao Lanshan Port - China's largest-capacity ore pipe belt conveyor", "Băng tải ống quặng có công suất lớn nhất Trung Quốc tại Cảng Lanshan, Nhật Chiếu", "日照岚山港-国内最大运量矿石输送管带机"),
    asset("529936f534583a96bc33092f9a5487ec_lp.jpg", "Rizhao Lanshan Port - China's largest-capacity ore pipe belt conveyor", "Băng tải ống quặng có công suất lớn nhất Trung Quốc tại Cảng Lanshan, Nhật Chiếu", "日照岚山港-国内最大运量矿石输送管带机"),
    asset("1afca5fcef3aa4d2f1408497e95ab8ed_lp.jpg", "Rizhao Port - southern area process system", "Hệ thống quy trình khu phía Nam, Cảng Nhật Chiếu", "日照港-南区流程化"),
    asset("1e2e18afc508f0e53293117118924281_lp.jpg", "Huaneng Rizhao Power Plant - China's largest-diameter coal conveying pipe belt conveyor", "Băng tải ống vận chuyển than có đường kính lớn nhất Trung Quốc tại Nhà máy điện Huaneng Nhật Chiếu", "华能日照电厂-国内最大管径输煤通道管带机"),
    asset("7cd1fb93c315e78c8f1c1ada876190f0_lp.jpg", "Indonesia Sugang - coal belt conveyor", "Băng tải than tại Sugang, Indonesia", "印尼苏钢-输煤皮带机"),
    asset("a4ceeeaf29fc6ff45594232ad5cdd8d6_lp.jpg", "Zhenjiang Golden Port - belt conveyor", "Băng tải tại Golden Port, Trấn Giang", "镇江金港-皮带机"),
    asset("1a9f762f2406f9be9cd376146fa53b71_lp.jpg", "Vietnam RDF pipe belt conveyor", "Băng tải ống RDF tại Việt Nam", "越南RDF管带机"),
  ],
  "barge-platform": [
    asset("ada86a3e82708ed50daca57074234d51_lp.jpg", "Guinea - offshore floating transshipment platform", "Sàn trung chuyển nổi ngoài khơi tại Guinea", "几内亚-海上浮式转运平台"),
  ],
};

const sectionText: Record<
  AppLocale,
  Record<DryBulkSectionId, { title: string; paragraphs: readonly string[] }>
> = {
  en: {
    "port-portal-crane": {
      title: "Port portal crane",
      paragraphs: [
        "With A-level production license, the business covers a full range of products of port general gantry crane and gantry crane with bucket, withstanding harsh working conditions and high utilization rate of equipment, with proprietary slewing ring upper and lower flange surface processing technology, automatic control technology and 5G remote operation can be used to realize the automation, lightweight and standardization of equipment, which can be customized according to demand.",
      ],
    },
    "ship-loader-unloader": {
      title: "Loading/unloading of ship machines",
      paragraphs: [
        "According to the user's bulk cargo loading and unloading ship operation design, in order to achieve efficient loading and unloading, it is mainly used for continuous machinery for bulk cargo loading and unloading operations, and is connected with the rear conveyor system.",
        "The main products are 4500t/h ship loader, 1200t/h spiral bucket ship unloader, 2500t/h ship unloader, which can be customized according to customer needs.",
      ],
    },
    "stacker-reclaimer": {
      title: "Stacker/reclaimer",
      paragraphs: [
        "It has intelligent perception, health diagnosis and detection, fully automatic unmanned operation function, remote manual and semi-automatic operation function.",
        "(1) Apply intelligent perception and operation and maintenance management and control platform.",
        "(2) The use of large-rotation and large-load structure design.",
        "(3) Use multi-cargo reclaiming working condition conversion technology.",
        "There are complete models of stacker and reclaimer, including 10500/6000t/h super large bucket wheel stacker and reclaimer, 6000/5400t/h bucket wheel stacker and reclaimer, etc., which can be customized according to customer needs.",
      ],
    },
    "belt-conveyor": {
      title: "Ordinary trough belt conveyor, round pipe belt conveyor",
      paragraphs: [
        "As a bulk material conveying system service provider integrating design, R&D, manufacturing, installation and operation and maintenance, Luhai Equipment Group has more than 40 years of experience in the operation and maintenance of bulk material conveying equipment, has a full range of bulk material conveying equipment production capacity, and has built nearly 300 kilometers of various belt conveyors such as belt conveyors and pipe belt conveyors. Among them, the ore conveyor belt machine in Lanshan Port Area of Rizhao Port and the pipe belt machine in the coal conveying channel of Rizhao Huaneng Power Plant won two \"Best Pipe Belt Machines\", and the process project in the southern area of Shijiu Port Area of Rizhao Port was listed by the State Council as a smart green demonstration project for bulk dry bulk cargo.",
      ],
    },
    "barge-platform": {
      title: "Bulk material transportation barge platform",
      paragraphs: [
        "The Land and Sea Equipment Group integrates the \"three-in-one\" technical assembly of various advantageous products, port machinery, ships and belt conveyors, and conducts in-depth research on the structure, materials, stability and bearing capacity of the transfer platform. The new high-efficiency offshore material handling platform will improve loading and unloading and transshipment efficiency, reduce costs and accident risks, and promote sustainable development, and has been applied in Guinea, Africa.",
      ],
    },
  },
  vi: {
    "port-portal-crane": {
      title: "Cẩu chân đế cảng",
      paragraphs: [
        "Với giấy phép sản xuất cấp A, doanh nghiệp cung cấp đầy đủ các dòng cẩu chân đế cảng thông dụng và cẩu chân đế gắn gầu ngoạm, đáp ứng điều kiện làm việc khắc nghiệt và tần suất khai thác cao. Thiết bị ứng dụng công nghệ gia công độc quyền cho bề mặt bích trên và dưới của vòng quay, đồng thời có thể tích hợp điều khiển tự động và vận hành từ xa 5G để đạt mức tự động hóa, nhẹ hóa và tiêu chuẩn hóa; có thể tùy chỉnh theo nhu cầu.",
      ],
    },
    "ship-loader-unloader": {
      title: "Máy xếp/dỡ hàng lên tàu",
      paragraphs: [
        "Thiết bị được thiết kế theo quy trình xếp dỡ hàng rời của người dùng nhằm đạt hiệu suất cao, chủ yếu phục vụ hoạt động xếp và dỡ hàng rời liên tục, kết nối đồng bộ với hệ thống băng tải phía sau.",
        "Các sản phẩm chính gồm máy xếp hàng lên tàu 4.500 tấn/giờ, máy dỡ tàu gầu xoắn 1.200 tấn/giờ và máy dỡ tàu 2.500 tấn/giờ; có thể tùy chỉnh theo nhu cầu khách hàng.",
      ],
    },
    "stacker-reclaimer": {
      title: "Máy đánh đống/lấy liệu",
      paragraphs: [
        "Thiết bị có khả năng cảm nhận thông minh, chẩn đoán và phát hiện tình trạng, vận hành hoàn toàn tự động không người lái, cùng chế độ điều khiển thủ công từ xa và bán tự động.",
        "(1) Ứng dụng nền tảng cảm nhận thông minh, quản lý và kiểm soát vận hành – bảo trì.",
        "(2) Sử dụng thiết kế kết cấu góc quay lớn và tải trọng lớn.",
        "(3) Ứng dụng công nghệ chuyển đổi chế độ lấy liệu cho nhiều loại hàng.",
        "Danh mục máy đánh đống/lấy liệu đầy đủ, gồm máy bánh gầu siêu lớn 10.500/6.000 tấn/giờ, máy bánh gầu 6.000/5.400 tấn/giờ và các cấu hình khác; có thể tùy chỉnh theo nhu cầu khách hàng.",
      ],
    },
    "belt-conveyor": {
      title: "Băng tải máng thông thường, băng tải ống tròn",
      paragraphs: [
        "Tập đoàn Thiết bị Lục Hải là nhà cung cấp hệ thống vận chuyển vật liệu rời tích hợp thiết kế, R&D, chế tạo, lắp đặt, vận hành và bảo trì; có hơn 40 năm kinh nghiệm và năng lực sản xuất đầy đủ các dòng thiết bị. Tập đoàn đã xây dựng gần 300 km băng tải và băng tải ống. Trong đó, băng tải ống vận chuyển quặng tại khu cảng Lanshan của Cảng Nhật Chiếu và băng tải ống trong tuyến vận chuyển than của Nhà máy điện Huaneng Nhật Chiếu đạt hai kỷ lục ngành; dự án quy trình khu phía Nam của khu cảng Shijiu được Quốc vụ viện Trung Quốc công nhận là dự án trình diễn thông minh, xanh cho hàng rời khô khối lượng lớn.",
      ],
    },
    "barge-platform": {
      title: "Sàn sà lan trung chuyển vật liệu rời",
      paragraphs: [
        "Tập đoàn Thiết bị Lục Hải tích hợp ba nhóm công nghệ gồm máy cảng, tàu và băng tải, đồng thời nghiên cứu chuyên sâu kết cấu, vật liệu, độ ổn định và khả năng chịu tải của sàn trung chuyển. Sàn xử lý vật liệu ngoài khơi hiệu suất cao thế hệ mới giúp tăng hiệu quả xếp dỡ và trung chuyển, giảm chi phí và rủi ro tai nạn, thúc đẩy phát triển bền vững; giải pháp đã được ứng dụng tại Guinea, châu Phi.",
      ],
    },
  },
  zh: {
    "port-portal-crane": {
      title: "港口门座式起重机",
      paragraphs: [
        "具备A级生产许可证，业务涵盖港口通用门机及带斗门机全系列产品，经受恶劣工况及设备高利用率考验，具有专有的回转支承上下法兰面加工工艺，可采用自动化控制技术和5G远程操作，实现设备的自动化、轻量化和标准化，可根据需求量身定制。",
      ],
    },
    "ship-loader-unloader": {
      title: "装/卸船机",
      paragraphs: [
        "根据用户散货装卸船作业设计，以实现高效装卸，主要用于大宗散货装卸船作业的连续式机械，与后方输送机系统相衔接。",
        "主要产品有4500t/h装船机、1200t/h螺旋带斗卸船机、2500t/h卸船机，可根据客户需求量身定制。",
      ],
    },
    "stacker-reclaimer": {
      title: "堆/取料机",
      paragraphs: [
        "具备智能感知、健康诊断检测、全自动无人化操作功能、远程手动和半自动操作功能。",
        "（1）应用智慧感知和运维管控平台。",
        "（2）使用大回转大载荷结构设计。",
        "（3）使用多货种取料工况转换技术。",
        "堆取料机型号齐全，目前有10500/6000t/h超大型斗轮堆取料机、6000/5400t/h斗轮堆取料机等，可根据客户需求量身定制。",
      ],
    },
    "belt-conveyor": {
      title: "普通槽型带式输送机、圆管带式输送机",
      paragraphs: [
        "陆海装备集团作为一家集设计研发、生产制造、安装运维于一体的散料输送系统服务商，拥有四十余年散料输送设备运维经验，具有全系列散料输送设备生产能力，累计建设皮带机、管带机等各类带式输送机600余公里。其中日照港岚山港区矿石输送管带机和日照华能电厂输煤通道管带机获得两个“管带机之最”、日照港石臼港区南区流程化工程被国务院列为大宗干散货智慧绿色示范工程。",
      ],
    },
    "barge-platform": {
      title: "散料运输过驳平台",
      paragraphs: [
        "陆海装备集团集各优势产品港机、船舶、皮带机“三合一”实现技术总成，在转运平台的结构、材料、稳定性、承载等方面进行了深度研究。新型海上高效物料转运平台将提高装卸和转运效率、减少成本和事故风险、促进可持续发展等，目前已应用于非洲几内亚。",
      ],
    },
  },
};

const localeCopy: Record<
  AppLocale,
  Omit<DryBulkHandlingContent, "sections">
> = {
  en: {
    title: "Dry bulk handling systems",
    description: "Integrated dry bulk loading, unloading and conveying solutions from Shandong Port Equipment Group.",
    productsLabel: "Products & Solutions",
    intro: "Provide a full range of customized products such as automatic bridge grab ship unloader, automatic continuous bulk cargo ship loader, automated port loading and unloading portal crane, automatic stacker/reclaimer, belt conveyor, round pipe belt conveyor, automatic loading building/transfer machine room and supporting equipment, and support digital material yard, automatic collision avoidance, one-key automatic anchoring, intelligent status management system, intelligent lubrication, automatic fire protection, intelligent lightning protection, unmanned inspection and intelligent lighting and other functions according to demand.",
    previousLabel: "Previous image",
    nextLabel: "Next image",
    galleryLabel: "Product gallery",
  },
  vi: {
    title: "Hệ thống xếp dỡ hàng rời khô",
    description: "Giải pháp tích hợp xếp dỡ và vận chuyển hàng rời khô của Tập đoàn Thiết bị Cảng Sơn Đông.",
    productsLabel: "Sản phẩm & Giải pháp",
    intro: "Cung cấp đầy đủ các sản phẩm tùy chỉnh gồm máy dỡ tàu gầu ngoạm kiểu cầu tự động, máy xếp hàng rời liên tục lên tàu, cẩu chân đế xếp dỡ cảng tự động, máy đánh đống/lấy liệu tự động, băng tải, băng tải ống tròn, nhà xếp hàng tự động, phòng máy trung chuyển và thiết bị phụ trợ; đồng thời tích hợp theo nhu cầu bãi vật liệu số, chống va chạm tự động, neo tự động một chạm, quản lý trạng thái thông minh, bôi trơn và chữa cháy tự động, chống sét thông minh, kiểm tra không người lái và chiếu sáng thông minh.",
    previousLabel: "Ảnh trước",
    nextLabel: "Ảnh tiếp theo",
    galleryLabel: "Thư viện sản phẩm",
  },
  zh: {
    title: "干散货装卸输送系统解决方案",
    description: "山东港口装备集团干散货装卸与输送一体化解决方案。",
    productsLabel: "产品与解决方案",
    intro: "提供自动化桥式抓斗卸船机、自动化连续散货装船机、自动化港口装卸门座起重机、自动化堆/取料机、皮带输送机、圆管带式输送机、自动化装车楼/转载机房及配套设备等全系列定制产品，并根据需求配套数字料场、自动防撞、一键自动锚定、智能状态管理系统、智能润滑、自动消防、智能防雷、无人巡检及智慧照明等功能。",
    previousLabel: "上一张图片",
    nextLabel: "下一张图片",
    galleryLabel: "产品图片",
  },
};

const sectionOrder: readonly DryBulkSectionId[] = [
  "port-portal-crane",
  "ship-loader-unloader",
  "stacker-reclaimer",
  "belt-conveyor",
  "barge-platform",
];

export function getDryBulkHandlingContent(
  locale: AppLocale,
): DryBulkHandlingContent {
  return {
    ...localeCopy[locale],
    sections: sectionOrder.map((id) => ({
      id,
      ...sectionText[locale][id],
      images: galleryAssets[id].map(({ file, caption }) => ({
        src: `${assetRoot}/${file}`,
        caption: caption[locale],
      })),
    })),
  };
}

export const dryBulkOverviewImage =
  `${assetRoot}/e39958bd2b5b894f442d90cb8a9417cd.jpg`;
