import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface ProductBreadcrumbProps {
  items: BreadcrumbItem[];
  productCount?: number;
  currentProduct?: string;
}

export default function ProductBreadcrumb({ items, currentProduct }: ProductBreadcrumbProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      item: `https://dreamlab.id${item.href}`,
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className="container-custom pt-4 pb-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ol className="flex flex-wrap items-center gap-1 text-xs text-gray-500">
        {items.map((item, i) => (
          <li key={item.href} className="flex items-center gap-1">
            {i > 0 && <span className="text-gray-300 mx-1">/</span>}
            {i < items.length - 1 ? (
              <Link href={item.href} className="hover:text-brand-orange transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-800 font-medium" aria-current="page">
                {currentProduct || item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}