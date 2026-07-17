import { AboutSubNavigation } from "@/components/about/AboutSubNavigation";
import { PageHero } from "@/components/common/PageHero";
import type { ContactContent } from "@/content/contact/contact";

import { ContactSection } from "./ContactSection";
import { ScrollToSection } from "./ScrollToSection.client";

type ContactPageViewProps = {
  activeHref: "/contact" | "/contact/marketing-network";
  breadcrumbLabel: string;
  content: ContactContent;
  homeLabel: string;
};

export function ContactPageView({
  activeHref,
  breadcrumbLabel,
  content,
  homeLabel,
}: ContactPageViewProps) {
  const isMarketingNetwork = activeHref === "/contact/marketing-network";

  return (
    <>
      <PageHero
        breadcrumbLabel={breadcrumbLabel}
        breadcrumbs={[
          { href: "/", label: homeLabel },
          { label: content.heroTitle },
          {
            label: isMarketingNetwork
              ? content.marketingTitle
              : content.pageTitle,
          },
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
        labels={content.labels}
        marketingTitle={content.marketingTitle}
        network={content.network}
        pageTitle={content.pageTitle}
        primary={content.primary}
      />
    </>
  );
}
