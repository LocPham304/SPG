type MediaResponseDtoData = {
  id: number;
  storagePath: string;
  publicUrl: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  width: number;
  height: number;
  altText: string | null;
  uploadedBy: number;
  createdAt: Date;
  updatedAt: Date;
};

export class MediaResponseDto {
  readonly id: number;
  readonly storagePath: string;
  readonly publicUrl: string;
  readonly originalName: string;
  readonly mimeType: string;
  readonly sizeBytes: number;
  readonly width: number;
  readonly height: number;
  readonly altText: string | null;
  readonly uploadedBy: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(data: MediaResponseDtoData) {
    this.id = data.id;
    this.storagePath = data.storagePath;
    this.publicUrl = data.publicUrl;
    this.originalName = data.originalName;
    this.mimeType = data.mimeType;
    this.sizeBytes = data.sizeBytes;
    this.width = data.width;
    this.height = data.height;
    this.altText = data.altText;
    this.uploadedBy = data.uploadedBy;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}
