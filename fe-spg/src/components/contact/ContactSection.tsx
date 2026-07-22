import Image from "next/image";

import { Container } from "@/components/common/Container";
import { ImageWithSkeleton } from "@/components/news/ImageWithSkeleton";
import { ScrollReveal } from "@/components/news/ScrollReveal";
import { getStaggerDelay } from "@/components/news/animation";
import type {
  ContactContent,
  ContactDetails,
} from "@/content/contact/contact";
import type { AppLocale } from "@/i18n/routing";

import { ContactInquiryForm } from "./ContactInquiryForm.client";
import styles from "./ContactSection.module.scss";

type ContactSectionProps = Pick<
  ContactContent,
  "form" | "labels" | "marketingTitle" | "network" | "pageTitle" | "primary"
> & {
  locale: AppLocale;
};

type DetailItem = {
  className?: string;
  label: string;
  type?: "email" | "phone";
  value?: string;
};

function DetailValue({ type, value = "" }: Pick<DetailItem, "type" | "value">) {
  if (!value) {
    return <span aria-hidden="true">&nbsp;</span>;
  }

  if (type === "email") {
    return <a href={`mailto:${value}`}>{value}</a>;
  }

  if (type === "phone") {
    return <a href={`tel:${value.replace(/[^\d+]/g, "")}`}>{value}</a>;
  }

  return <span>{value}</span>;
}

function DetailsList({
  items,
  network = false,
}: {
  items: readonly DetailItem[];
  network?: boolean;
}) {
  return (
    <dl className={network ? styles.networkDetails : styles.primaryDetails}>
      {items.map((item) => (
        <div className={item.className} key={item.label}>
          <dt>{item.label}</dt>
          <dd>
            <DetailValue type={item.type} value={item.value} />
          </dd>
        </div>
      ))}
    </dl>
  );
}

function NetworkCard({
  contact,
  labels,
}: {
  contact: ContactDetails;
  labels: ContactContent["labels"];
}) {
  return (
    <article className={styles.networkCard}>
      <h3>{contact.company}</h3>
      <DetailsList
        network
        items={[
          {
            className: styles.addressField,
            label: labels.address,
            value: contact.address,
          },
          { label: labels.fax, type: "phone", value: contact.fax },
          { label: labels.phone, type: "phone", value: contact.phone },
          { label: labels.mailbox, type: "email", value: contact.mailbox },
          { label: labels.postcode, value: contact.postcode },
        ]}
      />
    </article>
  );
}

export function ContactSection({
  form,
  labels,
  locale,
  marketingTitle,
  network,
  pageTitle,
  primary,
}: ContactSectionProps) {
  return (
    <div className={styles.contactPage}>
      <Container className={styles.inner}>
        <section aria-labelledby="contact-heading" className={styles.block}>
          <ScrollReveal threshold={0.15}>
            <h2 className={styles.sectionTitle} id="contact-heading">
              {pageTitle}
            </h2>
          </ScrollReveal>
          <ScrollReveal animation="animate__fadeInUp" threshold={0.15}>
            <article className={styles.primaryCard}>
            <Image
              alt=""
              aria-hidden="true"
              className={styles.primaryLogoWatermark}
              height={317}
              src="/images/public/files/image/bg_logo.png"
              width={402}
            />
            <div className={styles.primaryContent}>
              <h3>{primary.company}</h3>
              <DetailsList
                items={[
                  { label: labels.address, value: primary.address },
                  {
                    label: labels.businessPhone,
                    type: "phone",
                    value: primary.phone,
                  },
                  {
                    label: labels.mailbox,
                    type: "email",
                    value: primary.mailbox,
                  },
                ]}
              />
            </div>
            <ImageWithSkeleton
              alt=""
              className={styles.contactImageFrame}
              fill
              imageClassName={styles.contactImage}
              priority
              sizes="(max-width: 767px) 85vw, 47vw"
              src="/images/public/files/image/contact_img1.png"
              transparent
            />
            </article>
          </ScrollReveal>
        </section>

        <section aria-labelledby="inquiry-heading" className={styles.block}>
          <ScrollReveal threshold={0.15}>
            <h2 className={styles.sectionTitle} id="inquiry-heading">
              {form.title}
            </h2>
          </ScrollReveal>
          <ScrollReveal threshold={0.15}>
            <ContactInquiryForm content={form} locale={locale} />
          </ScrollReveal>
        </section>

        <section
          aria-labelledby="network-heading"
          className={`${styles.block} ${styles.marketingBlock}`}
          id="marketing-network"
        >
          <ScrollReveal threshold={0.15}>
            <h2 className={styles.sectionTitle} id="network-heading">
              {marketingTitle}
            </h2>
          </ScrollReveal>
          <div className={styles.networkGrid}>
            {network.map((contact, index) => (
              <ScrollReveal
                className={styles.networkGridItem}
                delay={getStaggerDelay(index)}
                key={contact.company}
                threshold={0.15}
              >
                <NetworkCard contact={contact} labels={labels} />
              </ScrollReveal>
            ))}
          </div>
        </section>
      </Container>
    </div>
  );
}
