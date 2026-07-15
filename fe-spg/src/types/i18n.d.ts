import type vi from "@/messages/vi.json";

import type { AppLocale } from "@/i18n/routing";

declare module "next-intl" {
  interface AppConfig {
    Locale: AppLocale;
    Messages: typeof vi;
  }
}
