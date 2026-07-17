import type { ReactNode } from "react";

type AdminPageHeaderProps = {
  actions?: ReactNode;
  description?: string;
  title: string;
};

export function AdminPageHeader({
  actions,
  description,
  title,
}: AdminPageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
      <div>
        <h2 className="m-0 text-2xl font-bold tracking-tight text-slate-900">
          {title}
        </h2>
        {description ? (
          <p className="mt-1.5 text-sm leading-6 text-slate-600">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </div>
  );
}
