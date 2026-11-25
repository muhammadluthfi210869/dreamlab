"use client";

import CategoryPageLayout from "./CategoryPageLayout";

interface ProductPageV2Props {
  data: any;
}

export default function ProductPageV2({ data }: ProductPageV2Props) {
  return <CategoryPageLayout data={data} />;
}
