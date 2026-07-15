import { ApiNewsRepository } from "./api-news.repository";
import { MockNewsRepository } from "./mock-news.repository";
import type { NewsRepository } from "./news.repository";

export type { NewsRepository } from "./news.repository";

export function createNewsRepository(): NewsRepository {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
  return apiBaseUrl
    ? new ApiNewsRepository(apiBaseUrl)
    : new MockNewsRepository();
}
