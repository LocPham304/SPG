import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { LocalizedLink } from "@/components/common/LocalizedLink";
import { ScrollReveal } from "@/components/news/ScrollReveal";
import {
  companyContact,
  companyLegal,
  vietnamOfficeContact,
} from "@/data/company";
import { mainNavigation } from "@/data/navigation";

import { BackToTop } from "./BackToTop.client";
import { ContactSupport } from "./ContactSupport.client";
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
        <ScrollReveal threshold={0.1}>
          <FooterNavigation
            ariaLabel={t("navigationLabel")}
            groups={navigationGroups}
          />
        </ScrollReveal>

        <ScrollReveal animation="animate__fadeInUp" threshold={0.1}>
          <div className={styles.footerDetails}>
            <FooterLinksDropdown
              label={t("links")}
              menuLabel={t("partnerLinksLabel")}
            />

            <address className={styles.footerContact}>
              <div>
                <strong>{t("address")}</strong>
                <a
                  href={companyContact.addressHref}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {companyContact.address}
                </a>
              </div>
              <div>
                <strong>{t("phone")}</strong>
                <a href={`tel:${companyContact.phoneHref}`}>
                  {companyContact.phoneDisplay}
                </a>
              </div>
            </address>

            <address className={styles.footerContact}>
              <div>
                <strong>{t("vietnamOfficeAddress")}</strong>
                <span>{t("vietnamOfficeLocation")}</span>
              </div>
              <div className={styles.footerVietnamContactMethods}>
                <div>
                  <strong>{t("phone")}:</strong>
                  <a href={`tel:${vietnamOfficeContact.phoneHref}`}>
                    {vietnamOfficeContact.phoneDisplay}
                  </a>
                </div>
                <div>
                  <strong>Email:</strong>
                  <a href={`mailto:${vietnamOfficeContact.email}`}>
                    {vietnamOfficeContact.email}
                  </a>
                </div>
              </div>
            </address>

            <div className={styles.footerQrCodes}>
              <figure>
                <Image
                  alt={t("qrMiniProgramAlt")}
                  className={styles.footerQrImage}
                  height={544}
                  sizes="(max-width: 1199px) 128px, 142px"
                  src="/images/uploads/allimg/20240531/deb3408ee543ed1217dfb22f8a768b68.jpg"
                  width={543}
                />
                <figcaption>{t("qrMiniProgram")}</figcaption>
              </figure>
              <figure>
                <Image
                  alt={t("qrPublicAccountAlt")}
                  className={styles.footerQrImage}
                  height={430}
                  sizes="(max-width: 1199px) 128px, 142px"
                  src="/images/uploads/allimg/20240531/84dc6533d0aab16149c7e5089d1a95fa.jpg"
                  width={430}
                />
                <figcaption>{t("qrPublicAccount")}</figcaption>
              </figure>
            </div>
          </div>
        </ScrollReveal>

        <div className={styles.footerLegal}>
          <p>
            © {new Date().getFullYear()}{" "}
            <a
              href={companyLegal.companyUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              Shandong Port Equipment Group
            </a>{" "}
            All rights reserved{" "}
            <a
              href={companyLegal.registrationUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              {companyLegal.registration}
            </a>{" "}
            <LocalizedLink href="/sitemap" prefetch={false}>
              Sitemap
            </LocalizedLink>{" "}
            <a
              href={companyLegal.designerUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              Design:LTD
            </a>{" "}.
          </p>
        </div>
      </div>
      <ContactSupport
        phoneLabel={t("supportPhone")}
        supportLabel={t("supportLabel")}
        zaloLabel={t("supportZalo")}
      />
      <BackToTop label={t("backToTop")} />
    </footer>
  );
}
