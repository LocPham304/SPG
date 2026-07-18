"use client";

import { AlertTriangle } from "lucide-react";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

type AdminConfirmTone = "danger" | "primary";

export type AdminConfirmOptions = {
  cancelLabel?: string;
  confirmLabel?: string;
  description: string;
  title: string;
  tone?: AdminConfirmTone;
};

type AdminConfirmDialogProps = AdminConfirmOptions & {
  onCancel: () => void;
  onConfirm: () => void;
};

const toneClassNames: Record<
  AdminConfirmTone,
  { button: string; icon: string }
> = {
  danger: {
    button:
      "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600/25",
    icon: "bg-red-50 text-red-600",
  },
  primary: {
    button:
      "bg-[#1d2088] text-white hover:bg-[#171a70] focus-visible:ring-[#1d2088]/25",
    icon: "bg-indigo-50 text-[#1d2088]",
  },
};

function AdminConfirmDialog({
  cancelLabel = "Hủy",
  confirmLabel = "Xác nhận",
  description,
  onCancel,
  onConfirm,
  title,
  tone = "danger",
}: AdminConfirmDialogProps) {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const descriptionId = useId();
  const titleId = useId();

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    cancelButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onCancel();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onCancel]);

  if (typeof document === "undefined") return null;

  const toneClasses = toneClassNames[tone];

  return createPortal(
    <div
      className="fixed inset-0 z-[1100] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      <section
        aria-describedby={descriptionId}
        aria-labelledby={titleId}
        aria-modal="true"
        className="w-full max-w-[440px] rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.28)] sm:p-7"
        role="dialog"
      >
        <div className="flex items-start gap-4">
          <span
            aria-hidden="true"
            className={`flex size-11 shrink-0 items-center justify-center rounded-full ${toneClasses.icon}`}
          >
            <AlertTriangle size={21} strokeWidth={2.2} />
          </span>
          <div className="min-w-0 pt-0.5">
            <h2
              className="text-lg font-bold leading-7 text-slate-900"
              id={titleId}
            >
              {title}
            </h2>
            <p
              className="mt-2 text-sm leading-6 text-slate-600"
              id={descriptionId}
            >
              {description}
            </p>
          </div>
        </div>

        <div className="mt-7 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
          <button
            className="h-10 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-300/30"
            onClick={onCancel}
            ref={cancelButtonRef}
            type="button"
          >
            {cancelLabel}
          </button>
          <button
            className={`h-10 rounded-lg px-4 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-4 ${toneClasses.button}`}
            onClick={onConfirm}
            type="button"
          >
            {confirmLabel}
          </button>
        </div>
      </section>
    </div>,
    document.body,
  );
}

export function useAdminConfirm() {
  const [options, setOptions] = useState<AdminConfirmOptions | null>(null);
  const resolverRef = useRef<((confirmed: boolean) => void) | null>(null);

  const confirmAction = useCallback(
    (nextOptions: AdminConfirmOptions) =>
      new Promise<boolean>((resolve) => {
        resolverRef.current?.(false);
        resolverRef.current = resolve;
        setOptions(nextOptions);
      }),
    [],
  );

  const closeDialog = useCallback((confirmed: boolean) => {
    const resolve = resolverRef.current;
    resolverRef.current = null;
    setOptions(null);
    resolve?.(confirmed);
  }, []);
  const cancelDialog = useCallback(() => closeDialog(false), [closeDialog]);
  const acceptDialog = useCallback(() => closeDialog(true), [closeDialog]);

  useEffect(
    () => () => {
      resolverRef.current?.(false);
      resolverRef.current = null;
    },
    [],
  );

  return {
    confirmAction,
    confirmDialog: options ? (
      <AdminConfirmDialog
        {...options}
        onCancel={cancelDialog}
        onConfirm={acceptDialog}
      />
    ) : null,
  };
}
