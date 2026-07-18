"use client";

import {
  useEffect,
  useState,
  type FormEvent,
} from "react";
import { createPortal } from "react-dom";

import type { ContactContent } from "@/content/contact/contact";
import type { AppLocale } from "@/i18n/routing";
import { ApiError } from "@/lib/api";
import { createContactMessage } from "@/services/contacts.service";

import styles from "./ContactSection.module.scss";

type ContactInquiryFormProps = {
  content: ContactContent["form"];
  locale: AppLocale;
};

type FieldName = "customerName" | "email" | "message" | "phone";
type FieldErrors = Partial<Record<FieldName, string>>;
type ToastState = {
  message: string;
  tone: "error" | "success";
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[0-9+().\s-]+$/;

function validateForm(values: Record<FieldName, string>): FieldErrors {
  const errors: FieldErrors = {};

  if (!values.customerName) {
    errors.customerName = "Vui lòng nhập tên khách hàng.";
  }

  if (!values.email) {
    errors.email = "Vui lòng nhập email.";
  } else if (!emailPattern.test(values.email)) {
    errors.email = "Email không đúng định dạng.";
  }

  if (!values.phone) {
    errors.phone = "Vui lòng nhập số điện thoại.";
  } else if (values.phone.length < 6 || !phonePattern.test(values.phone)) {
    errors.phone = "Số điện thoại không hợp lệ.";
  }

  if (!values.message) {
    errors.message = "Vui lòng nhập nội dung.";
  } else if (values.message.length < 10) {
    errors.message = "Nội dung phải có ít nhất 10 ký tự.";
  }

  return errors;
}

export function ContactInquiryForm({
  content,
  locale,
}: ContactInquiryFormProps) {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    if (!toast) return;

    const timeoutId = window.setTimeout(() => setToast(null), 4500);
    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  function clearFieldError(field: FieldName) {
    setErrors((current) => {
      if (!current[field]) return current;
      const nextErrors = { ...current };
      delete nextErrors[field];
      return nextErrors;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const values: Record<FieldName, string> = {
      customerName: String(formData.get("customerName") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      message: String(formData.get("message") ?? "").trim(),
    };
    const nextErrors = validateForm(values);

    setErrors(nextErrors);
    setToast(null);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);

    try {
      await createContactMessage({
        ...values,
        locale,
        sourcePage: window.location.pathname,
      });
      form.reset();
      setErrors({});
      setToast({
        message:
          "Gửi liên hệ thành công. Chúng tôi sẽ phản hồi sớm nhất có thể.",
        tone: "success",
      });
    } catch (error: unknown) {
      setToast({
        message:
          error instanceof ApiError && error.status === 429
            ? "Bạn gửi quá nhanh. Vui lòng thử lại sau."
            : "Không thể gửi liên hệ. Vui lòng thử lại.",
        tone: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {toast
        ? createPortal(
            <div
              className={`${styles.contactToast} ${
                toast.tone === "success"
                  ? styles.contactToastSuccess
                  : styles.contactToastError
              }`}
              role={toast.tone === "error" ? "alert" : "status"}
            >
              {toast.message}
            </div>,
            document.body,
          )
        : null}

      <form
        className={styles.inquiryForm}
        noValidate
        onSubmit={handleSubmit}
      >
        <div className={styles.formGrid}>
          <label className={styles.formField}>
            <span>{content.customerName}</span>
            <input
              aria-describedby={
                errors.customerName ? "customerName-error" : undefined
              }
              aria-invalid={Boolean(errors.customerName)}
              autoComplete="name"
              maxLength={255}
              name="customerName"
              onChange={() => clearFieldError("customerName")}
              placeholder={content.customerNamePlaceholder}
              type="text"
            />
            {errors.customerName ? (
              <span
                className={styles.fieldError}
                id="customerName-error"
              >
                {errors.customerName}
              </span>
            ) : null}
          </label>

          <label className={styles.formField}>
            <span>{content.email}</span>
            <input
              aria-describedby={errors.email ? "email-error" : undefined}
              aria-invalid={Boolean(errors.email)}
              autoComplete="email"
              maxLength={255}
              name="email"
              onChange={() => clearFieldError("email")}
              placeholder={content.emailPlaceholder}
              type="email"
            />
            {errors.email ? (
              <span className={styles.fieldError} id="email-error">
                {errors.email}
              </span>
            ) : null}
          </label>

          <label className={styles.formField}>
            <span>{content.phone}</span>
            <input
              aria-describedby={errors.phone ? "phone-error" : undefined}
              aria-invalid={Boolean(errors.phone)}
              autoComplete="tel"
              inputMode="tel"
              maxLength={50}
              name="phone"
              onChange={() => clearFieldError("phone")}
              placeholder={content.phonePlaceholder}
              type="tel"
            />
            {errors.phone ? (
              <span className={styles.fieldError} id="phone-error">
                {errors.phone}
              </span>
            ) : null}
          </label>

          <label className={`${styles.formField} ${styles.messageField}`}>
            <span>{content.message}</span>
            <textarea
              aria-describedby={
                errors.message ? "contact-message-error" : undefined
              }
              aria-invalid={Boolean(errors.message)}
              maxLength={5000}
              name="message"
              onChange={() => clearFieldError("message")}
              placeholder={content.messagePlaceholder}
              rows={6}
            />
            {errors.message ? (
              <span
                className={styles.fieldError}
                id="contact-message-error"
              >
                {errors.message}
              </span>
            ) : null}
          </label>
        </div>

        <button
          className={styles.submitButton}
          disabled={isSubmitting}
          type="submit"
        >
          <span>{isSubmitting ? "Đang gửi..." : content.submit}</span>
          <span aria-hidden="true">→</span>
        </button>
      </form>
    </>
  );
}
