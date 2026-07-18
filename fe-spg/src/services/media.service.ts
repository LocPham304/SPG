import { apiRequest } from "@/lib/api";
import type {
  GetMediaParams,
  MediaFile,
  MediaListResponse,
  UpdateMediaData,
} from "@/types/media";

function buildMediaQuery(params: GetMediaParams) {
  const query = new URLSearchParams();

  if (params.page !== undefined) {
    query.set("page", String(params.page));
  }
  if (params.limit !== undefined) {
    query.set("limit", String(params.limit));
  }
  if (params.search?.trim()) {
    query.set("search", params.search.trim());
  }
  if (params.mimeType) {
    query.set("mimeType", params.mimeType);
  }
  if (params.uploadedBy !== undefined) {
    query.set("uploadedBy", String(params.uploadedBy));
  }

  const queryString = query.toString();
  return queryString ? `?${queryString}` : "";
}

export function getMedia(params: GetMediaParams = {}) {
  return apiRequest<MediaListResponse>(
    `/admin/media${buildMediaQuery(params)}`,
  );
}

export function getMediaById(id: number) {
  return apiRequest<MediaFile>(`/admin/media/${id}`);
}

export function uploadMedia(file: File, altText?: string) {
  const formData = new FormData();
  formData.append("file", file);

  if (altText?.trim()) {
    formData.append("altText", altText.trim());
  }

  return apiRequest<MediaFile>("/admin/media", {
    body: formData,
    method: "POST",
  });
}

export function updateMedia(id: number, data: UpdateMediaData) {
  return apiRequest<MediaFile>(`/admin/media/${id}`, {
    body: JSON.stringify(data),
    method: "PATCH",
  });
}

export function deleteMedia(id: number) {
  return apiRequest<void>(`/admin/media/${id}`, {
    method: "DELETE",
  });
}
