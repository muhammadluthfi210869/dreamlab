"use client";

import Image from "next/image";

interface Feature {
  title: string;
  description: string;
  image: string;
}

const features: Feature[] = [
  {
    title: "RACIKAN AROMA",
    description: "Formulasi eksklusif dengan tren wewangian global terkini.",
    image: "/images/parfum/scent-splash.jpg", // Pastikan path benar
  },
  {
    title: "KUALITAS STABIL",
    description: "Presisi standar laboratorium di setiap batch produksi.",
    image: "/images/parfum/quality.jpg",
  },
  {
    title: "MAXIMIZE PROFIT",
    description: "Struktur biaya manufaktur efisien untuk margin tinggi.",
    image: "/images/parfum/profit.jpg",
  },
  {
    title: "EXCLUSIVE DESIGN",
    description: "Botol dan kemasan yang mendefinisikan kemewahan brand.",
    image: "/images/parfum/design.jpg",
  },
];

export default function WhyChooseUsV2() {
  return (
    <section className="w-full h-screen min-h-[700px] max-h-[900px] bg-[#FDFDFC] flex items-center overflow-hidden">
      <div className="container-custom h-full flex flex-col lg:flex-row border-y border-gray-100">
        
        {/* 1. BRAND AUTHORITY (LEFT) */}
        <div className="lg:w-[35%] p-12 lg:p-20 flex flex-col justify-center border-r border-gray-100">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-[1px] bg-brand-orange"></div>
            <span className="text-[10px] font-black text-brand-orange uppercase tracking-[0.4em]">
              Manufacturing Partner
            </span>
          </div>
          
          <h2 className="font-serif text-5xl xl:text-6xl text-[#212120] leading-[1.1] mb-8">
            Mengapa Brand Besar Memilih <span className="italic text-gray-400">Dreamlab?</span>
          </h2>
          
          <p className="text-sm text-gray-500 font-poppins leading-relaxed max-w-sm mb-12">
            Kami bukan sekadar pabrik. Kami adalah akselerator bisnis parfum Anda, menggabungkan seni penciuman dengan presisi manufaktur kelas dunia.
          </p>

          <div className="mt-auto">
             <div className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-4">
               Trusted by 200+ Brands
             </div>
             <div className="flex gap-8 grayscale opacity-30">
               {/* Logo-logo kecil bisa di sini */}
               <div className="w-8 h-8 bg-gray-400 rounded-full"></div>
               <div className="w-8 h-8 bg-gray-400 rounded-full"></div>
               <div className="w-8 h-8 bg-gray-400 rounded-full"></div>
             </div>
          </div>
        </div>

        {/* 2. THE BENTO GRID (RIGHT) */}
        <div className="lg:w-[65%] grid grid-cols-2 grid-rows-2 h-full">
          {features.map((feature, idx) => (
            <div 
              key={idx} 
              className={`relative group overflow-hidden border-b border-r border-gray-100 last:border-b-0`}
            >
              {/* Background Image with subtle zoom on hover (static by default) */}
              <div className="absolute inset-0 bg-gray-50 grayscale hover:grayscale-0 transition-all duration-700">
                {/* Fallback color if image not found */}
                <div className="w-full h-full bg-gray-100"></div>
                {/* 
                  <Image 
                    src={feature.image} 
                    alt={feature.title} 
                    fill 
                    className="object-cover opacity-20 group-hover:opacity-40 transition-opacity"
                  /> 
                */}
              </div>

              {/* Content */}
              <div className="relative h-full p-12 flex flex-col justify-end">
                <span className="text-[40px] font-serif text-gray-100 absolute top-8 right-10 group-hover:text-brand-orange/20 transition-colors">
                  0{idx + 1}
                </span>
                
                <h3 className="text-lg font-black text-[#212120] mb-3 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-xs text-gray-400 font-poppins leading-relaxed max-w-[200px]">
                  {feature.description}
                </p>
                
                <div className="w-0 h-[2px] bg-brand-orange mt-6 group-hover:w-full transition-all duration-500"></div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
