import type { AppLocale } from "@/i18n/routing";
import type { NewsDateListItem } from "@/types/news";

const englishArticles: readonly NewsDateListItem[] = [
  {
    id: "en-current-affairs-2024-01-19",
    publishedAt: "2024-01-19",
    title:
      "We will unswervingly follow the path of financial development with Chinese characteristics and promote the high-quality development of China's finance",
    summary:
      "The path of financial development with Chinese characteristics not only follows the objective laws of modern financial development, but also has distinctive characteristics suitable for China's national conditions, which is fundamentally different from the Western financial model. We must be firm in our self-confidence, continue to explore and improve in practice, and make this road broader and broader",
    href: "http://paper.people.com.cn/rmrb/html/2024-01/17/nw.D110000renmrb_20240117_1-01.htm",
  },
  {
    id: "en-current-affairs-2024-01-12",
    publishedAt: "2024-01-12",
    title:
      "Communiqué of the Third Plenary Session of the 20th Central Commission for Discipline Inspection of the Communist Party of China",
    summary:
      "The Third Plenary Session of the 20th Central Commission for Discipline Inspection of the Communist Party of China (CPC) was held in Beijing from January 8 to 10, 2024. Present at the plenary session were 132 members of the Central Commission for Discipline Inspection and 238 nonvoting delegates. Xi Jinping, General Secretary of the CPC Central Committee, President of the People's Republic of China, and Chairman of the Central Military Commission, attended the plenary session and delivered an important speech. Li Qiang, Zhao Leji, Wang Huning, Cai Qi, Ding Xuexiang, Li Xi and other party and state leaders attended the meeting.",
    href: "http://paper.people.com.cn/rmrb/html/2024-01/11/nw.D110000renmrb_20240111_5-01.htm",
  },
  {
    id: "en-current-affairs-2024-01-10",
    publishedAt: "2024-01-10",
    title:
      "We will further promote the party's self-revolution and resolutely win the anti-corruption struggle, tackling tough problems and fighting a protracted war",
    summary:
      "After 10 years of unremitting and vigorous anti-corruption in the new era, the anti-corruption struggle has won an overwhelming victory and has been consolidated in an all-round way, but the situation is still grim and complex. We must have a sober understanding of the new situation and new trends in the anti-corruption struggle, and we must have a sober understanding of the soil and conditions for the emergence of the problem of corruption, and with tenacity and perseverance that are always on the road, we must exert precise and sustained efforts to resolutely win the tough and protracted battle in the anti-corruption struggle",
    href: "http://paper.people.com.cn/rmrb/html/2024-01/09/nw.D110000renmrb_20240109_1-01.htm",
  },
];

const vietnameseArticles: readonly NewsDateListItem[] = [
  {
    ...englishArticles[0],
    title:
      "Kiên định đi theo con đường phát triển tài chính mang đặc sắc Trung Quốc và thúc đẩy tài chính Trung Quốc phát triển chất lượng cao",
    id: "vi-current-affairs-2024-01-19",
    summary:
      "Con đường phát triển tài chính mang đặc sắc Trung Quốc vừa tuân theo các quy luật khách quan của tài chính hiện đại, vừa có những đặc trưng phù hợp với điều kiện đất nước Trung Quốc, về căn bản khác với mô hình tài chính phương Tây. Cần củng cố sự tự tin, tiếp tục tìm tòi và hoàn thiện trong thực tiễn để con đường này ngày càng rộng mở.",
  },
  {
    ...englishArticles[1],
    title:
      "Thông cáo Hội nghị toàn thể lần thứ ba của Ủy ban Kiểm tra Kỷ luật Trung ương khóa XX Đảng Cộng sản Trung Quốc",
    id: "vi-current-affairs-2024-01-12",
    summary:
      "Hội nghị toàn thể lần thứ ba của Ủy ban Kiểm tra Kỷ luật Trung ương khóa XX Đảng Cộng sản Trung Quốc được tổ chức tại Bắc Kinh từ ngày 8 đến ngày 10 tháng 1 năm 2024. Tham dự hội nghị có 132 ủy viên Ủy ban Kiểm tra Kỷ luật Trung ương và 238 đại biểu dự thính. Tổng Bí thư Tập Cận Bình tham dự và có bài phát biểu quan trọng. Các lãnh đạo Đảng và Nhà nước gồm Lý Cường, Triệu Lạc Tế, Vương Hỗ Ninh, Thái Kỳ, Đinh Tiết Tường, Lý Hy và những người khác cũng tham dự hội nghị.",
  },
  {
    ...englishArticles[2],
    title:
      "Tiếp tục thúc đẩy cuộc tự cách mạng của Đảng, kiên quyết giành thắng lợi trong cuộc đấu tranh chống tham nhũng, giải quyết khó khăn và kiên trì cuộc chiến lâu dài",
    id: "vi-current-affairs-2024-01-10",
    summary:
      "Sau 10 năm kiên trì và quyết liệt chống tham nhũng trong thời đại mới, cuộc đấu tranh chống tham nhũng đã giành thắng lợi áp đảo và được củng cố toàn diện, song tình hình vẫn nghiêm trọng, phức tạp. Cần nhận thức tỉnh táo về tình hình, xu hướng mới cũng như môi trường và điều kiện làm nảy sinh tham nhũng; với tinh thần bền bỉ không ngừng nghỉ, phải triển khai các biện pháp chính xác, liên tục để kiên quyết giành thắng lợi trong cuộc chiến cam go và lâu dài chống tham nhũng.",
  },
];

const chineseArticles: readonly NewsDateListItem[] = [
  {
    id: "zh-current-affairs-2026-07-06-1",
    publishedAt: "2026-07-06",
    title: "传达学习习近平总书记在庆祝中国共产党成立105周年大会上的重要讲话精神",
    summary:
      "省委常委会召开会议，传达学习习近平总书记在庆祝中国共产党成立105周年大会上的重要讲话和在中央政治局会议上的重要讲话精神。",
    href: "https://paper.dzwww.com/dzrb/content/20260703/Articel01003MT.htm",
  },
  {
    id: "zh-current-affairs-2026-07-06-2",
    publishedAt: "2026-07-06",
    title: "庆祝中国共产党成立105周年大会在京隆重举行",
    summary:
      "7月1日上午，庆祝中国共产党成立105周年大会在北京人民大会堂隆重举行。中共中央总书记、国家主席、中央军委主席习近平发表重要讲话。",
    href: "https://paper.people.com.cn/rmrb/pc/content/202607/02/content_30165946.html",
  },
  {
    id: "zh-current-affairs-2026-07-06-3",
    publishedAt: "2026-07-06",
    title: "庆祝中国共产党成立105周年音乐会《人民至上》在京举行",
    summary:
      "6月29日晚，庆祝中国共产党成立105周年音乐会《人民至上》在北京举行。习近平、李强、赵乐际、王沪宁、蔡奇、丁薛祥、李希、韩正等党和国家领导人，同约3000名观众一起观看演出。",
    href: "https://paper.people.com.cn/rmrb/pc/content/202606/30/content_30165660.html",
  },
  {
    id: "zh-current-affairs-2026-07-06-4",
    publishedAt: "2026-07-06",
    title: "从一艘小船到一个大党",
    summary: "1921—2026，中国共产党走过105年光辉历程。",
    href: "https://mp.weixin.qq.com/s/l0zM5PNB5wV04RGoFCSryg",
  },
  {
    id: "zh-current-affairs-2026-05-19-1",
    publishedAt: "2026-05-19",
    title:
      "习近平在加强基础研究座谈会上强调 以更大力度更实举措加强基础研究 进一步打牢科技强国建设根基",
    summary:
      "基础研究是整个科学体系的源头，是所有技术问题的总机关。要以更大力度、更实举措加强基础研究，提升我国原始创新能力，进一步打牢科技强国建设根基。",
    href: "https://paper.people.com.cn/rmrb/pc/content/202605/01/content_30154502.html",
  },
  {
    id: "zh-current-affairs-2026-05-19-2",
    publishedAt: "2026-05-19",
    title:
      "中共中央政治局召开会议 分析研究当前经济形势和经济工作 中共中央总书记习近平主持会议",
    summary:
      "今年以来，以习近平同志为核心的党中央加强对经济工作的全面领导，着眼全局、前瞻布局，各地区各部门靠前发力、综合施策，我国经济起步有力，主要指标好于预期，彰显强大韧性和活力。",
    href: "https://paper.people.com.cn/rmrb/pc/content/202604/29/content_30153791.html",
  },
];

const articlesByLocale: Record<AppLocale, readonly NewsDateListItem[]> = {
  en: englishArticles,
  vi: vietnameseArticles,
  zh: chineseArticles,
};

export function getCurrentAffairsArticles(locale: AppLocale) {
  return articlesByLocale[locale];
}
