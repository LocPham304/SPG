import { AboutSubNavigation } from "@/components/about/AboutSubNavigation";
import { PageHero } from "@/components/common/PageHero";
import type { ContactContent } from "@/content/contact/contact";
import type { AppLocale } from "@/i18n/routing";

import { ContactSection } from "./ContactSection";
import { ScrollToSection } from "./ScrollToSection.client";

type ContactPageViewProps = {
  activeHref: "/contact" | "/contact/marketing-network";
  breadcrumbLabel: string;
  content: ContactContent;
  homeLabel: string;
  locale: AppLocale;
};

export function ContactPageView({
  activeHref,
  breadcrumbLabel,
  content,
  homeLabel,
  locale,
}: ContactPageViewProps) {
  const isMarketingNetwork = activeHref === "/contact/marketing-network";

  return (
    <>
      <PageHero
        breadcrumbLabel={breadcrumbLabel}
        breadcrumbs={[
          { href: "/", label: homeLabel },
          { label: content.heroTitle },
          ...(isMarketingNetwork
            ? [{ label: content.marketingTitle }]
            : []),
        ]}
        breadcrumbSeparator="-"
        title={content.heroTitle}
        variant="contact"
      >
        <AboutSubNavigation
          ariaLabel={content.heroTitle}
          currentHref={activeHref}
          items={[
            { href: "/contact", label: content.pageTitle },
            {
              href: "/contact/marketing-network",
              label: content.marketingTitle,
            },
          ]}
        />
      </PageHero>
      {isMarketingNetwork ? (
        <ScrollToSection targetId="marketing-network" />
      ) : null}
      <ContactSection
        form={content.form}
        labels={content.labels}
        locale={locale}
        marketingTitle={content.marketingTitle}
        network={content.network}
        pageTitle={content.pageTitle}
        primary={content.primary}
      />
    </>
  );
}
