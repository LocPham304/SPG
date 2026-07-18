import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';

import {
  StorageService,
  type UploadStorageFileParams,
} from './storage.service';

const STORAGE_ERROR_MESSAGE =
  'Không thể kết nối kho lưu trữ. Vui lòng thử lại sau.';

@Injectable()
export class SupabaseStorageService extends StorageService {
  private readonly client: ReturnType<typeof createClient>;
  private readonly bucket: string;

  constructor(configService: ConfigService) {
    super();

    const supabaseUrl = configService.getOrThrow<string>('storage.supabaseUrl');
    const serviceRoleKey = configService.getOrThrow<string>(
      'storage.serviceRoleKey',
    );
    this.bucket = configService.getOrThrow<string>('storage.bucket');
    this.client = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  async uploadFile(params: UploadStorageFileParams): Promise<void> {
    const { error } = await this.client.storage
      .from(this.bucket)
      .upload(params.storagePath, params.buffer, {
        contentType: params.contentType,
        upsert: false,
      });

    if (error) {
      throw new ServiceUnavailableException(STORAGE_ERROR_MESSAGE);
    }
  }

  async deleteFile(storagePath: string): Promise<void> {
    const { error } = await this.client.storage
      .from(this.bucket)
      .remove([storagePath]);

    if (error) {
      throw new ServiceUnavailableException(STORAGE_ERROR_MESSAGE);
    }
  }

  getPublicUrl(storagePath: string): string {
    return this.client.storage.from(this.bucket).getPublicUrl(storagePath).data
      .publicUrl;
  }
}
