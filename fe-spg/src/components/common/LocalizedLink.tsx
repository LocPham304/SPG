import type { ComponentProps } from "react";

import { Link } from "@/i18n/navigation";

type LocalizedLinkProps = ComponentProps<typeof Link>;

export function LocalizedLink(props: LocalizedLinkProps) {
  return <Link {...props} />;
}
