import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ContactDetail } from "@/components/admin/ContactDetail";
import { adminContacts } from "@/data/admin";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const contact = adminContacts.find((item) => item.id === id);

  return {
    title: contact ? `Liên hệ: ${contact.name}` : "Không tìm thấy liên hệ",
  };
}

export default async function AdminContactDetailPage({ params }: PageProps) {
  const { id } = await params;
  const contact = adminContacts.find((item) => item.id === id);

  if (!contact) notFound();

  return <ContactDetail contact={contact} />;
}
