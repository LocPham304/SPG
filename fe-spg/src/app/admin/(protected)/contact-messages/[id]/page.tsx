import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ContactDetail } from "@/components/admin/ContactDetail";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Chi tiết liên hệ",
};

export default async function AdminContactDetailPage({ params }: PageProps) {
  const { id } = await params;
  const contactId = Number(id);

  if (!Number.isSafeInteger(contactId) || contactId <= 0) notFound();

  return <ContactDetail contactId={contactId} />;
}
