import { LocaleCode } from '../enums/locale-code.enum';

export type CategoryTranslationResponseDto = {
  locale: LocaleCode;
  name: string;
  description: string | null;
};

type PublicCategoryResponseDtoData = {
  id: number;
  code: string;
  slug: string;
  name: string;
  description: string | null;
  sortOrder: number;
  showOnHome: boolean;
};

export class PublicCategoryResponseDto {
  readonly id: number;
  readonly code: string;
  readonly slug: string;
  readonly name: string;
  readonly description: string | null;
  readonly sortOrder: number;
  readonly showOnHome: boolean;

  constructor(data: PublicCategoryResponseDtoData) {
    this.id = data.id;
    this.code = data.code;
    this.slug = data.slug;
    this.name = data.name;
    this.description = data.description;
    this.sortOrder = data.sortOrder;
    this.showOnHome = data.showOnHome;
  }
}

type AdminCategoryResponseDtoData = {
  id: number;
  code: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
  showOnHome: boolean;
  translations: CategoryTranslationResponseDto[];
  createdBy: number | null;
  updatedBy: number | null;
  createdAt: Date;
  updatedAt: Date;
};

export class AdminCategoryResponseDto {
  readonly id: number;
  readonly code: string;
  readonly slug: string;
  readonly sortOrder: number;
  readonly isActive: boolean;
  readonly showOnHome: boolean;
  readonly translations: CategoryTranslationResponseDto[];
  readonly createdBy: number | null;
  readonly updatedBy: number | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(data: AdminCategoryResponseDtoData) {
    this.id = data.id;
    this.code = data.code;
    this.slug = data.slug;
    this.sortOrder = data.sortOrder;
    this.isActive = data.isActive;
    this.showOnHome = data.showOnHome;
    this.translations = data.translations;
    this.createdBy = data.createdBy;
    this.updatedBy = data.updatedBy;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}
