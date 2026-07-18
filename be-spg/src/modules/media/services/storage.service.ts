export type UploadStorageFileParams = {
  storagePath: string;
  buffer: Buffer;
  contentType: string;
};

export abstract class StorageService {
  abstract uploadFile(params: UploadStorageFileParams): Promise<void>;
  abstract deleteFile(storagePath: string): Promise<void>;
  abstract getPublicUrl(storagePath: string): string;
}
