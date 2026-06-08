"use client";

import Image from "next/image";
import Link from "next/link";
import { RelatedProductV2 } from "@/types/product-v2";
import { motion } from "framer-motion";
import { productImageAlt, productImageTitle } from "@/lib/image-utils";

interface ProductRelatedProps {
  products: RelatedProductV2[];
  currentProductSlug?: string;
}

export default function ProductRelated({ products, currentProductSlug }: ProductRelatedProps) {
  const filteredProducts = currentProductSlug 
    ? products.filter(p => p.slug !== currentProductSlug).slice(0, 4)
    : products.slice(0, 4);

  const premiumEase = [0.16, 1, 0.3, 1] as any;

  if (filteredProducts.length === 0) return null;

  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="py-12 md:py-16 bg-brand-light-blue overflow-hidden"
    >
      <div className="container-custom">
        {/* Section Header */}
        <motion.div 
          variants={{
            hidden: { opacity: 0, y: 15 },
            show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: premiumEase } }
          }}
          className="text-center mb-10"
        >
          <h2 className="font-viga text-2xl md:text-3xl text-brand-black mb-2">
            PRODUK LAINNYA
          </h2>
          <motion.div 
            variants={{
              hidden: { width: 0 },
              show: { width: 96, transition: { delay: 0.2, duration: 0.8, ease: premiumEase } }
            }}
            className="h-1.5 bg-brand-orange mx-auto rounded-full" 
          />
        </motion.div>

        {/* Related Products Grid - Staggered entrance */}
        <motion.div 
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.15
              }
            }
          }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-5xl mx-auto"
        >
          {filteredProducts.map((product, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.8, ease: premiumEase }
                }
              }}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="flex"
            >
              <Link
                href={product.subCategorySlug 
                  ? `/produk/${product.categorySlug}/${product.subCategorySlug}/${product.slug}`
                  : `/produk/${product.categorySlug}/${product.slug}`
                }
                className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 w-full flex flex-col justify-between"
              >
                <div className="relative aspect-square overflow-hidden bg-gray-50">
                  <Image
                    src={product.image}
                    alt={productImageAlt(product.slug, product.categorySlug, product.name)}
                    title={productImageTitle(product.slug, product.categorySlug, product.name)}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    loading="lazy"
                    decoding="async"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-4 text-center flex-grow flex flex-col justify-center">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-brand-gray mb-1">{product.category}</span>
                  <h3 className="font-semibold text-brand-black text-xs md:text-sm group-hover:text-brand-orange transition-colors duration-300">
                    {product.name}
                  </h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}