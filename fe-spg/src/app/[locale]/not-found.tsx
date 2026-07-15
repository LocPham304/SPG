import { getTranslations } from "next-intl/server";

import { Container } from "@/components/common/Container";
import { ErrorState } from "@/components/ui/ErrorState";

export default async function LocaleNotFound() {
  const t = await getTranslations("errors.notFound");

  return (
    <Container>
      <ErrorState
        centered
        description={t("description")}
        title={t("title")}
      />
    </Container>
  );
}
