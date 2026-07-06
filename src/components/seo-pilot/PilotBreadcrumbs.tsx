import Link from 'next/link';

interface PilotBreadcrumbsProps {
  items: { label: string; href: string }[];
}

export default function PilotBreadcrumbs({ items }: PilotBreadcrumbsProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: `https://dreamlab.id${item.href.replace(/\/?$/, '/')}`,
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className="text-xs text-neutral-500">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center gap-2">
            {index > 0 && <span className="text-neutral-300">/</span>}
            {index < items.length - 1 ? (
              <Link href={item.href} className="transition hover:text-[#D98A00]">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="font-semibold text-[#1f1f1d]">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
