export const MEDIA_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export type MediaMimeType = (typeof MEDIA_MIME_TYPES)[number];

export type MediaFile = {
  altText: string | null;
  createdAt: string;
  height: number;
  id: number;
  mimeType: MediaMimeType;
  originalName: string;
  publicUrl: string;
  sizeBytes: number;
  storagePath: string;
  updatedAt: string;
  uploadedBy: number;
  width: number;
};

export type MediaListResponse = {
  data: MediaFile[];
  meta: {
    limit: number;
    page: number;
    total: number;
    totalPages: number;
  };
};

export type GetMediaParams = {
  limit?: number;
  mimeType?: MediaMimeType;
  page?: number;
  search?: string;
  uploadedBy?: number;
};

export type UpdateMediaData = {
  altText?: string | null;
};
