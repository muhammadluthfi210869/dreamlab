import { generatePageSchema } from "@/lib/schema-generator";
import type { SchemaPageData } from "@/lib/schema-generator";

export function PageSchema(data: SchemaPageData) {
  const schema = generatePageSchema(data);
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
