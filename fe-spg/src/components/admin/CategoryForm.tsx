"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  type FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";

import { ApiError } from "@/lib/api";
import {
  getAdminCategoryById,
  updateCategory,
} from "@/services/categories.service";
import type {
  CategoryTranslationInput,
  LocaleCode,
} from "@/types/categories";

import { AccessDenied } from "./AccessDenied";
import { AdminPageHeader } from "./AdminPageHeader";
import { useAdminUser } from "./AdminAuthContext";

const inputClassName =
  "h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm outline-none focus:border-[#1d2088] focus:ring-2 focus:ring-[#1d2088]/15 disabled:bg-slate-100 disabled:text-slate-500";
const textareaClassName =
  "min-h-28 w-full resize-y rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-sm outline-none focus:border-[#1d2088] focus:ring-2 focus:ring-[#1d2088]/15";
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const localeDefinitions: readonly {
  label: string;
  locale: LocaleCode;
  required: boolean;
}[] = [
  { label: "Tiếng Việt", locale: "vi", required: true },
  { label: "Tiếng Anh", locale: "en", required: false },
  { label: "Tiếng Trung", locale: "zh", required: false },
];

type TranslationDraft = {
  description: string;
  name: string;
};

type TranslationsDraft = Record<LocaleCode, TranslationDraft>;

const emptyTranslations: TranslationsDraft = {
  vi: { description: "", name: "" },
  en: { description: "", name: "" },
  zh: { description: "", name: "" },
};

type CategoryFormProps = {
  categoryId: number;
};

export function CategoryForm({ categoryId }: CategoryFormProps) {
  const router = useRouter();
  const currentUser = useAdminUser();
  const [code, setCode] = useState("");
  const [slug, setSlug] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [isActive, setIsActive] = useState(true);
  const [showOnHome, setShowOnHome] = useState(false);
  const [translations, setTranslations] =
    useState<TranslationsDraft>(emptyTranslations);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isForbidden, setIsForbidden] = useState(false);

  const loadCategory = useCallback(async () => {
    setIsLoading(true);
    setLoadError(false);

    try {
      const category = await getAdminCategoryById(categoryId);
      const nextTranslations: TranslationsDraft = {
        vi: { description: "", name: "" },
        en: { description: "", name: "" },
        zh: { description: "", name: "" },
      };

      category.translations.forEach((translation) => {
        nextTranslations[translation.locale] = {
          description: translation.description ?? "",
          name: translation.name,
        };
      });

      setCode(category.code);
      setSlug(category.slug);
      setSortOrder(String(category.sortOrder));
      setIsActive(category.isActive);
      setShowOnHome(category.showOnHome);
      setTranslations(nextTranslations);
    } catch (error: unknown) {
      if (error instanceof ApiError && error.status === 403) {
        setIsForbidden(true);
      } else {
        setLoadError(true);
      }
    } finally {
      setIsLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    if (currentUser.role === "admin") {
      void loadCategory();
    }
  }, [currentUser.role, loadCategory]);

  if (currentUser.role !== "admin" || isForbidden) {
    return <AccessDenied />;
  }

  function updateTranslation(
    locale: LocaleCode,
    field: keyof TranslationDraft,
    value: string,
  ) {
    setTranslations((current) => ({
      ...current,
      [locale]: {
        ...current[locale],
        [field]: value,
      },
    }));

    if (errors[`${locale}.${field}`] || errors.form) {
      setErrors({});
    }
  }

  function validateForm() {
    const nextErrors: Record<string, string> = {};
    const parsedSortOrder = Number(sortOrder);

    if (!slug.trim()) {
      nextErrors.slug = "Vui lòng nhập slug";
    } else if (!slugPattern.test(slug.trim())) {
      nextErrors.slug =
        "Slug chỉ được gồm chữ thường, số và dấu gạch ngang";
    }

    if (
      sortOrder.trim() === "" ||
      !Number.isInteger(parsedSortOrder) ||
      parsedSortOrder < 0
    ) {
      nextErrors.sortOrder =
        "Thứ tự hiển thị phải là số nguyên không âm";
    }

    if (!translations.vi.name.trim()) {
      nextErrors["vi.name"] = "Tên tiếng Việt là bắt buộc";
    }

    (["en", "zh"] as const).forEach((locale) => {
      if (
        translations[locale].description.trim() &&
        !translations[locale].name.trim()
      ) {
        nextErrors[`${locale}.name`] =
          "Vui lòng nhập tên khi có mô tả";
      }
    });

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function buildTranslations(): CategoryTranslationInput[] {
    return localeDefinitions
      .filter(
        ({ locale }) =>
          locale === "vi" || translations[locale].name.trim(),
      )
      .map(({ locale }) => ({
        description: translations[locale].description.trim() || null,
        locale,
        name: translations[locale].name.trim(),
      }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const commonData = {
        isActive,
        showOnHome,
        slug: slug.trim(),
        sortOrder: Number(sortOrder),
        translations: buildTranslations(),
      };

      await updateCategory(categoryId, commonData);
      router.replace("/admin/categories?updated=1");
    } catch (error: unknown) {
      if (error instanceof ApiError && error.status === 403) {
        setIsForbidden(true);
      } else if (error instanceof ApiError && error.status === 409) {
        setErrors({ form: "Code hoặc slug đã tồn tại" });
      } else {
        setErrors({
          form: "Đã có lỗi xảy ra. Vui lòng thử lại.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div
        className="rounded-xl border border-slate-200 bg-white p-8 text-sm text-slate-500 shadow-sm"
        role="status"
      >
        Đang tải thông tin danh mục...
      </div>
    );
  }

  if (loadError) {
    return (
      <section
        className="rounded-xl border border-red-200 bg-white p-8 text-center shadow-sm"
        role="alert"
      >
        <p className="font-semibold text-slate-800">
          Không thể tải thông tin danh mục. Vui lòng thử lại.
        </p>
        <button
          className="mt-4 h-10 rounded-lg bg-[#1d2088] px-4 text-sm font-semibold text-white"
          onClick={() => void loadCategory()}
          type="button"
        >
          Thử lại
        </button>
      </section>
    );
  }

  return (
    <>
      <AdminPageHeader
        actions={
          <Link
            className="inline-flex h-10 items-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            href="/admin/categories"
          >
            Quay lại danh sách
          </Link>
        }
        description="Cập nhật thông tin và bản dịch của danh mục."
        title="Chỉnh sửa danh mục"
      />

      <form
        className="max-w-4xl rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
        noValidate
        onSubmit={handleSubmit}
      >
        {errors.form ? (
          <p
            className="mb-5 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            {errors.form}
          </p>
        ) : null}

        <section>
          <h3 className="text-base font-bold text-slate-900">
            Thông tin chung
          </h3>
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            <FormField label="Code">
              <input
                className={inputClassName}
                disabled
                readOnly
                value={code}
              />
            </FormField>

            <FormField error={errors.slug} label="Slug" required>
              <input
                className={inputClassName}
                onChange={(event) => {
                  setSlug(event.target.value.toLowerCase());
                  if (errors.slug || errors.form) setErrors({});
                }}
                value={slug}
              />
            </FormField>

            <FormField
              error={errors.sortOrder}
              label="Thứ tự hiển thị"
              required
            >
              <input
                className={inputClassName}
                min={0}
                onChange={(event) => {
                  setSortOrder(event.target.value);
                  if (errors.sortOrder || errors.form) setErrors({});
                }}
                type="number"
                value={sortOrder}
              />
            </FormField>
          </div>

          <div className="mt-5 grid gap-3 rounded-lg bg-slate-50 p-4">
            <label className="flex cursor-pointer items-start gap-3 text-sm text-slate-700">
              <input
                checked={isActive}
                className="mt-0.5 size-4 accent-[#1d2088]"
                onChange={(event) => setIsActive(event.target.checked)}
                type="checkbox"
              />
              Danh mục đang hoạt động
            </label>
            <label className="flex cursor-pointer items-start gap-3 text-sm text-slate-700">
              <input
                checked={showOnHome}
                className="mt-0.5 size-4 accent-[#1d2088]"
                onChange={(event) => setShowOnHome(event.target.checked)}
                type="checkbox"
              />
              Hiển thị trên trang chủ
            </label>
          </div>
        </section>

        <section className="mt-8 border-t border-slate-200 pt-6">
          <h3 className="text-base font-bold text-slate-900">
            Nội dung đa ngôn ngữ
          </h3>
          <div className="mt-4 grid gap-5">
            {localeDefinitions.map(({ label, locale, required }) => (
              <fieldset
                className="rounded-xl border border-slate-200 p-4"
                key={locale}
              >
                <legend className="px-2 text-sm font-bold text-slate-800">
                  {label}
                  {required ? (
                    <span className="ml-1 text-red-600">*</span>
                  ) : null}
                </legend>
                <div className="grid gap-4">
                  <FormField
                    error={errors[`${locale}.name`]}
                    label={`Tên ${label.toLowerCase()}`}
                    required={required}
                  >
                    <input
                      className={inputClassName}
                      onChange={(event) =>
                        updateTranslation(
                          locale,
                          "name",
                          event.target.value,
                        )
                      }
                      value={translations[locale].name}
                    />
                  </FormField>
                  <FormField label={`Mô tả ${label.toLowerCase()}`}>
                    <textarea
                      className={textareaClassName}
                      onChange={(event) =>
                        updateTranslation(
                          locale,
                          "description",
                          event.target.value,
                        )
                      }
                      value={translations[locale].description}
                    />
                  </FormField>
                </div>
              </fieldset>
            ))}
          </div>
        </section>

        <div className="mt-7 flex justify-end border-t border-slate-200 pt-5">
          <button
            className="h-10 rounded-lg border-0 bg-[#1d2088] px-5 text-sm font-semibold text-white hover:bg-[#171a70] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </form>
    </>
  );
}

type FormFieldProps = {
  children: React.ReactNode;
  error?: string;
  label: string;
  required?: boolean;
};

function FormField({
  children,
  error,
  label,
  required = false,
}: FormFieldProps) {
  return (
    <label>
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
        {required ? <span className="ml-1 text-red-600">*</span> : null}
      </span>
      {children}
      {error ? (
        <span className="mt-1.5 block text-sm text-red-600">{error}</span>
      ) : null}
    </label>
  );
}
