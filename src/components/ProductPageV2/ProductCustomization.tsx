"use client";

import Image from "next/image";
import { ProductVariantV2 } from "@/types/product-v2";

interface ProductCustomizationProps {
  productData: ProductVariantV2;
}

export default function ProductCustomization({ productData }: ProductCustomizationProps) {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="font-viga text-2xl md:text-3xl text-brand-black mb-2">
            KUSTOMISASI {productData.name.toUpperCase()}
          </h2>
          <div className="w-24 h-1.5 bg-brand-orange mx-auto rounded-full" />
        </div>

        {/* Size Options */}
        <div className="mb-8">
          <h3 className="font-semibold text-brand-black mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-brand-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            Ukuran
          </h3>
          <div className="flex flex-wrap gap-3">
            {productData.sizeOptions.map((size, idx) => (
              <button
                key={idx}
                className="px-6 py-3 border-2 border-brand-orange rounded-lg font-medium text-brand-black hover:bg-brand-orange hover:text-white transition-colors"
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Bottle Options */}
        {productData.bottleOptions && productData.bottleOptions.length > 0 && (
          <div className="mb-8">
            <h3 className="font-semibold text-brand-black mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-brand-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              Pilihan Botol
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {productData.bottleOptions.map((bottle, idx) => (
                <div 
                  key={idx}
                  className="bg-brand-light-blue rounded-xl p-4 text-center hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="text-sm font-medium text-brand-black">
                    {bottle}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cap Options */}
        {productData.capOptions && productData.capOptions.length > 0 && (
          <div className="mb-8">
            <h3 className="font-semibold text-brand-black mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-brand-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 5z" />
              </svg>
              Pilihan Tutup/Sprayer
            </h3>
            <div className="flex flex-wrap gap-3">
              {productData.capOptions.map((cap, idx) => (
                <button
                  key={idx}
                  className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium text-brand-black hover:bg-gray-200 transition-colors"
                >
                  {cap}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Ingredients / Notes Pyramid for Fragrance */}
        {productData.ingredients && productData.ingredients.length > 0 && (
          <div className="mb-8">
            <h3 className="font-semibold text-brand-black mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-brand-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              Bahan Utama
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {productData.ingredients.map((ingredient, idx) => (
                <div 
                  key={idx}
                  className="bg-gradient-to-br from-brand-light-blue to-white rounded-xl p-4 border border-brand-orange/10"
                >
                  <div className="text-lg font-bold text-brand-orange mb-1">
                    {ingredient.name}
                  </div>
                  <div className="text-xs text-brand-gray mb-2">
                    {ingredient.origin}
                  </div>
                  <div className="text-sm text-brand-black">
                    {ingredient.function}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes Pyramid for Fragrance Products */}
        {productData.notesPyramid && (
          <div className="mb-8">
            <h3 className="font-semibold text-brand-black mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-brand-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Notes Pyramid
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {/* Top Notes */}
              <div className="bg-gradient-to-b from-yellow-50 to-yellow-100 rounded-xl p-6 border-t-4 border-yellow-400">
                <h4 className="font-viga text-lg text-yellow-700 mb-3">Top Notes</h4>
                <div className="flex flex-wrap gap-2">
                  {productData.notesPyramid.top.map((note, idx) => (
                    <span key={idx} className="bg-yellow-200 text-yellow-800 text-xs px-3 py-1 rounded-full">
                      {note}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-yellow-600 mt-3">
                  Pertama tercium saat spray
                </p>
              </div>

              {/* Heart Notes */}
              <div className="bg-gradient-to-b from-orange-50 to-orange-100 rounded-xl p-6 border-t-4 border-orange-400">
                <h4 className="font-viga text-lg text-orange-700 mb-3">Heart Notes</h4>
                <div className="flex flex-wrap gap-2">
                  {productData.notesPyramid.heart.map((note, idx) => (
                    <span key={idx} className="bg-orange-200 text-orange-800 text-xs px-3 py-1 rounded-full">
                      {note}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-orange-600 mt-3">
                  Mengembang setelah 15-30 menit
                </p>
              </div>

              {/* Base Notes */}
              <div className="bg-gradient-to-b from-brown-50 to-brown-100 rounded-xl p-6 border-t-4 border-brown-400">
                <h4 className="font-viga text-lg text-brown-700 mb-3">Base Notes</h4>
                <div className="flex flex-wrap gap-2">
                  {productData.notesPyramid.base.map((note, idx) => (
                    <span key={idx} className="bg-brown-200 text-brown-800 text-xs px-3 py-1 rounded-full">
                      {note}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-brown-600 mt-3">
                  Tahan 6-12 jam
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Benefits */}
        {productData.benefits && productData.benefits.length > 0 && (
          <div className="bg-brand-light-blue rounded-2xl p-6 md:p-8">
            <h3 className="font-semibold text-brand-black mb-4">
              Keunggulan {productData.name}
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              {productData.benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="text-brand-orange text-lg">✓</span>
                  <span className="text-brand-black">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}