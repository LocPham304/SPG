import type { LucideIcon } from "lucide-react";

type AdminStatCardProps = {
  icon: LucideIcon;
  label: string;
  value: number;
};

export function AdminStatCard({
  icon: Icon,
  label,
  value,
}: AdminStatCardProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="m-0 text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
        </div>
        <span className="flex size-10 items-center justify-center rounded-lg bg-blue-50 text-[#1d2088]">
          <Icon aria-hidden="true" size={20} />
        </span>
      </div>
    </article>
  );
}
