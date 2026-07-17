"use client";

import type { FormEvent } from "react";

import type { ContactContent } from "@/content/contact/contact";

import styles from "./ContactSection.module.scss";

type ContactInquiryFormProps = {
  content: ContactContent["form"];
  recipient: string;
};

export function ContactInquiryForm({
  content,
  recipient,
}: ContactInquiryFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("customerName") ?? "");
    const email = String(formData.get("email") ?? "");
    const phone = String(formData.get("phone") ?? "");
    const message = String(formData.get("message") ?? "");
    const body = [
      `${content.customerName}: ${name}`,
      `${content.email}: ${email}`,
      `${content.phone}: ${phone}`,
      "",
      `${content.message}:`,
      message,
    ].join("\n");

    window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(
      `${content.title} - ${name}`,
    )}&body=${encodeURIComponent(body)}`;
  }

  return (
    <form className={styles.inquiryForm} onSubmit={handleSubmit}>
      <div className={styles.formGrid}>
        <label className={styles.formField}>
          <span>{content.customerName}</span>
          <input
            autoComplete="name"
            name="customerName"
            placeholder={content.customerNamePlaceholder}
            required
            type="text"
          />
        </label>

        <label className={styles.formField}>
          <span>{content.email}</span>
          <input
            autoComplete="email"
            name="email"
            placeholder={content.emailPlaceholder}
            required
            type="email"
          />
        </label>

        <label className={styles.formField}>
          <span>{content.phone}</span>
          <input
            autoComplete="tel"
            inputMode="tel"
            name="phone"
            placeholder={content.phonePlaceholder}
            required
            type="tel"
          />
        </label>

        <label className={`${styles.formField} ${styles.messageField}`}>
          <span>{content.message}</span>
          <textarea
            name="message"
            placeholder={content.messagePlaceholder}
            required
            rows={6}
          />
        </label>
      </div>

      <button className={styles.submitButton} type="submit">
        <span>{content.submit}</span>
        <span aria-hidden="true">→</span>
      </button>
    </form>
  );
}
