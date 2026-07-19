type JsonLdProps = {
  data: Record<string, unknown> | readonly Record<string, unknown>[];
  id?: string;
};

export function JsonLd({ data, id }: JsonLdProps) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <script
      dangerouslySetInnerHTML={{ __html: json }}
      id={id}
      type="application/ld+json"
    />
  );
}
