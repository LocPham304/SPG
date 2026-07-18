import { ApiError, apiRequest } from "@/lib/api";
import type {
  ContactListParams,
  ContactListResponse,
  ContactMessage,
  ContactStatus,
  CreateContactMessageData,
} from "@/types/contacts";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1"
).replace(/\/+$/, "");

const ignoredQueryValues = new Set(["", "all", "undefined", "null"]);

type QueryValue = number | string | null | undefined;

function hasQueryValue(value: QueryValue) {
  if (value === undefined || value === null) return false;
  if (typeof value !== "string") return true;
  return !ignoredQueryValues.has(value.trim().toLowerCase());
}

function buildQuery(params: Record<string, QueryValue>) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (!hasQueryValue(value)) return;
    query.set(key, String(value).trim());
  });

  return query.toString();
}

async function parsePublicResponse(response: Response) {
  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    return (await response.json()) as unknown;
  }

  const text = await response.text();
  return text ? { message: text } : null;
}

export async function createContactMessage(
  data: CreateContactMessageData,
): Promise<ContactMessage> {
  const response = await fetch(`${API_URL}/contact-messages`, {
    body: JSON.stringify(data),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
  });
  const responseData = await parsePublicResponse(response);

  if (!response.ok) {
    throw new ApiError(
      response.status,
      responseData as { message?: string | string[] } | null,
    );
  }

  return responseData as ContactMessage;
}

export function getContactMessages(
  params: ContactListParams = {},
): Promise<ContactListResponse> {
  const query = buildQuery({
    page:
      Number.isSafeInteger(params.page) && Number(params.page) > 0
        ? Number(params.page)
        : 1,
    limit:
      Number.isSafeInteger(params.limit) && Number(params.limit) > 0
        ? Number(params.limit)
        : 10,
    search: params.search,
    status: params.status,
    assignedTo: params.assignedTo,
    locale: params.locale,
    dateFrom: params.dateFrom,
    dateTo: params.dateTo,
  });

  return apiRequest<ContactListResponse>(
    `/admin/contact-messages?${query}`,
  );
}

export function getContactMessageById(id: number): Promise<ContactMessage> {
  return apiRequest<ContactMessage>(`/admin/contact-messages/${id}`);
}

export function claimContactMessage(id: number): Promise<ContactMessage> {
  return apiRequest<ContactMessage>(
    `/admin/contact-messages/${id}/claim`,
    { method: "POST" },
  );
}

export function assignContactMessage(
  id: number,
  assignedTo: number | null,
): Promise<ContactMessage> {
  return apiRequest<ContactMessage>(
    `/admin/contact-messages/${id}/assignee`,
    {
      body: JSON.stringify({ assignedTo }),
      method: "PATCH",
    },
  );
}

export function updateContactStatus(
  id: number,
  status: ContactStatus,
): Promise<ContactMessage> {
  return apiRequest<ContactMessage>(
    `/admin/contact-messages/${id}/status`,
    {
      body: JSON.stringify({ status }),
      method: "PATCH",
    },
  );
}

export function updateContactNote(
  id: number,
  internalNote: string,
): Promise<ContactMessage> {
  return apiRequest<ContactMessage>(
    `/admin/contact-messages/${id}/note`,
    {
      body: JSON.stringify({ internalNote }),
      method: "PATCH",
    },
  );
}

export function deleteContactMessage(id: number): Promise<void> {
  return apiRequest<void>(`/admin/contact-messages/${id}`, {
    method: "DELETE",
  });
}

export function restoreContactMessage(id: number): Promise<ContactMessage> {
  return apiRequest<ContactMessage>(
    `/admin/contact-messages/${id}/restore`,
    { method: "POST" },
  );
}
