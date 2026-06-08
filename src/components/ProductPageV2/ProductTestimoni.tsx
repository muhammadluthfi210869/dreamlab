"use client";

import Image from "next/image";
import { TestimonialV2 } from "@/types/product-v2";

interface ProductTestimoniProps {
  testimonials: TestimonialV2[];
}

export default function ProductTestimoni({ testimonials }: ProductTestimoniProps) {
  if (testimonials.length === 0) return null;

  return (
    <section className="py-12 md:py-16 bg-brand-light-blue">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="font-viga text-2xl md:text-3xl text-brand-black mb-2">
            APA KATA MEREKA?
          </h2>
          <p className="text-brand-gray">
            Testimoni dari brand yang sudah merasakan hasilnya
          </p>
          <div className="w-24 h-1.5 bg-brand-orange mx-auto rounded-full mt-4" />
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {testimonials.slice(0, 4).map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              {/* Quote */}
              <div className="mb-4">
                <svg className="w-10 h-10 text-brand-orange/20 mb-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-brand-black text-lg leading-relaxed italic">
                  "{testimonial.quote}"
                </p>
              </div>

              {/* Product Image */}
              {testimonial.productImage && (
                <div className="relative w-full h-40 rounded-xl overflow-hidden mb-4">
                  <Image
                    src={testimonial.productImage}
                    alt={`Produk dari ${testimonial.brand}`}
                    title={`Testimoni produk ${testimonial.brand} — Maklon Dreamlab`}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* Author */}
              <div className="flex items-center gap-3">
                {testimonial.avatarImage ? (
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src={testimonial.avatarImage}
                      alt={`Foto ${testimonial.name} — klien maklon Dreamlab`}
                      title={`${testimonial.name} — Klien Maklon Kosmetik Dreamlab`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-brand-orange/10 flex items-center justify-center">
                    <span className="text-brand-orange font-bold text-lg">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <div className="font-semibold text-brand-black">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-brand-gray">
                    {testimonial.brand}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}