import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { LocalizedLink } from "@/components/common/LocalizedLink";
import {
  companyContact,
  companyLegal,
  footerQrCodes,
} from "@/data/company";
import { mainNavigation } from "@/data/navigation";

import { BackToTop } from "./BackToTop.client";
import { FooterLinksDropdown } from "./FooterLinksDropdown.client";
import {
  FooterNavigation,
  type FooterNavigationGroup,
} from "./FooterNavigation.client";
import { FooterWave } from "./FooterWave.client";
import styles from "./SiteLayout.module.scss";

export async function SiteFooter() {
  const [t, navigation] = await Promise.all([
    getTranslations("footer"),
    getTranslations("navigation"),
  ]);
  const navigationGroups: FooterNavigationGroup[] = mainNavigation.map(
    (group) => ({
      id: group.label,
      href: group.href,
      label: navigation(group.label),
      children: group.children.map((item) => ({
        href: item.href,
        label: navigation(item.label),
      })),
    }),
  );

  return (
    <footer className={styles.footer} id="site-footer">
      <FooterWave />
      <div className={styles.footerInner}>
        <FooterNavigation
          ariaLabel={t("navigationLabel")}
          groups={navigationGroups}
        />

        <div className={styles.footerDetails}>
          <FooterLinksDropdown
            label={t("links")}
            menuLabel={t("partnerLinksLabel")}
          />

          <address className={styles.footerContact}>
            <div>
              <strong>{t("address")}</strong>
              <span>{companyContact.address}</span>
            </div>
            <div>
              <strong>{t("phone")}</strong>
              <a href={`tel:${companyContact.phoneHref}`}>
                {companyContact.phoneDisplay}
              </a>
            </div>
          </address>

          <div className={styles.footerQrCodes}>
            {footerQrCodes.map((qr) => (
              <figure key={qr.id}>
                <Image
                  alt={t(`${qr.labelKey}Alt`)}
                  height={qr.height}
                  loading="eager"
                  sizes="(max-width: 767px) 96px, 126px"
                  src={qr.src}
                  width={qr.width}
                />
                <figcaption>{t(qr.labelKey)}</figcaption>
              </figure>
            ))}
          </div>
        </div>

        <div className={styles.footerLegal}>
          <p>{t("copyright", { year: new Date().getFullYear() })}</p>
          <span>{companyLegal.registration}</span>
          <LocalizedLink href="/sitemap" prefetch={false}>
            {t("sitemap")}
          </LocalizedLink>
          <span>{t("designer", { name: companyLegal.designer })}</span>
        </div>
      </div>
      <BackToTop label={t("backToTop")} />
    </footer>
  );
}
