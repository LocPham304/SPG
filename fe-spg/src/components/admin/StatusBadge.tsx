import type {
  AdminRole,
  AdminUserStatus,
  ArticleStatus,
  ContactStatus,
} from "@/types/admin";

type StatusBadgeProps =
  | { type: "article"; value: ArticleStatus }
  | { type: "contact"; value: ContactStatus }
  | { type: "role"; value: AdminRole }
  | { type: "user"; value: AdminUserStatus };

const labels = {
  draft: "Nháp",
  pending_review: "Chờ duyệt",
  published: "Đã đăng",
  hidden: "Đang ẩn",
  rejected: "Từ chối",
  new: "Mới",
  in_progress: "Đang xử lý",
  waiting_customer: "Chờ khách phản hồi",
  resolved: "Đã xử lý",
  archived: "Lưu trữ",
  spam: "Spam",
  admin: "Admin",
  employee: "Nhân viên",
  active: "Đang hoạt động",
  inactive: "Đã khóa",
} as const;

const badgeStyles: Record<keyof typeof labels, string> = {
  draft: "bg-slate-100 text-slate-700",
  pending_review: "bg-amber-50 text-amber-700",
  published: "bg-emerald-50 text-emerald-700",
  hidden: "bg-violet-50 text-violet-700",
  rejected: "bg-red-50 text-red-700",
  new: "bg-blue-50 text-blue-700",
  in_progress: "bg-amber-50 text-amber-700",
  waiting_customer: "bg-violet-50 text-violet-700",
  resolved: "bg-emerald-50 text-emerald-700",
  archived: "bg-slate-100 text-slate-700",
  spam: "bg-red-50 text-red-700",
  admin: "bg-blue-50 text-blue-700",
  employee: "bg-slate-100 text-slate-700",
  active: "bg-emerald-50 text-emerald-700",
  inactive: "bg-red-50 text-red-700",
};

export function StatusBadge({ value }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${badgeStyles[value]}`}
    >
      {labels[value]}
    </span>
  );
}
