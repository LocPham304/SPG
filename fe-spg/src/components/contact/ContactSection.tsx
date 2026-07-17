import Image from "next/image";

import { Container } from "@/components/common/Container";
import type {
  ContactContent,
  ContactDetails,
} from "@/content/contact/contact";

import styles from "./ContactSection.module.scss";

type ContactSectionProps = Pick<
  ContactContent,
  "labels" | "marketingTitle" | "network" | "pageTitle" | "primary"
>;

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
  labels,
  marketingTitle,
  network,
  pageTitle,
  primary,
}: ContactSectionProps) {
  return (
    <div className={styles.contactPage}>
      <Container className={styles.inner}>
        <section aria-labelledby="contact-heading" className={styles.block}>
          <h2 className={styles.sectionTitle} id="contact-heading">
            {pageTitle}
          </h2>
          <article className={styles.primaryCard}>
            <div className={styles.primaryContent}>
              <h3>{primary.company}</h3>
              <DetailsList
                items={[
                  { label: labels.address, value: primary.address },
                  {
                    label: labels.phone,
                    type: "phone",
                    value: primary.phone,
                  },
                  {
                    label: labels.mailbox,
                    type: "email",
                    value: primary.mailbox,
                  },
                  {
                    label: labels.businessPhone,
                    type: "phone",
                    value: primary.businessPhone,
                  },
                ]}
              />
            </div>
            <Image
              alt=""
              aria-hidden="true"
              className={styles.contactImage}
              height={460}
              priority
              src="/images/public/files/image/contact_img1.png"
              width={688}
            />
          </article>
        </section>

        <section
          aria-labelledby="network-heading"
          className={`${styles.block} ${styles.marketingBlock}`}
          id="marketing-network"
        >
          <h2 className={styles.sectionTitle} id="network-heading">
            {marketingTitle}
          </h2>
          <div className={styles.networkGrid}>
            {network.map((contact) => (
              <NetworkCard
                contact={contact}
                key={contact.company}
                labels={labels}
              />
            ))}
          </div>
        </section>
      </Container>
    </div>
  );
}
