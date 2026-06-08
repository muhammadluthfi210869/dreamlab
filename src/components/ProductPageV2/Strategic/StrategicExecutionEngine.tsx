"use client";

import { motion } from "framer-motion";
import { Zap, FlaskConical, ShieldCheck, Lock } from "lucide-react";

interface StrategicExecutionEngineProps {
  headline: string;
  points: {
    title: string;
    description: string;
  }[];
  image?: string;
}

const icons = [
  <Zap key="0" size={24} className="text-brand-orange" />,
  <FlaskConical key="1" size={24} className="text-brand-orange" />,
  <ShieldCheck key="2" size={24} className="text-brand-orange" />,
  <Lock key="3" size={24} className="text-brand-orange" />
];

export default function StrategicExecutionEngine({ headline, points }: StrategicExecutionEngineProps) {
  const premiumEase = [0.16, 1, 0.3, 1] as any;

  const headlineVariants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: premiumEase }
    }
  };

  const cardVariants = (index: number) => ({
    hidden: { opacity: 0, y: 40 },
    show: {
      opacity: 1,
      y: 0,
      transition: { delay: index * 0.1, duration: 0.8, ease: premiumEase }
    }
  });

  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="relative z-10 bg-[#FDFDFC] py-20 lg:py-24 overflow-hidden border-y border-gray-100"
    >
      <div className="container-custom">
        <div className="flex flex-col gap-16 items-center">
          
          <div className="w-full text-center lg:text-left">
            <motion.h2 
              variants={headlineVariants}
              className="font-display text-[28px] lg:text-[48px] font-normal text-[#212120] leading-tight tracking-tight uppercase max-w-4xl mx-auto lg:mx-0"
            >
              {headline.split(' ').map((word, i) => (
                <span key={i} className={i % 2 !== 0 ? "text-brand-orange" : ""}>
                  {word}{' '}
                </span>
              ))}
            </motion.h2>
          </div>

          {/* Technical Grid - Minimalist Headlines and Descriptions with Icons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8 w-full">
            {points.map((point, index) => (
              <motion.div
                key={index}
                variants={cardVariants(index)}
                whileHover="hovered"
                className="bg-white p-6 lg:p-10 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:border-brand-orange/20 transition-all duration-500 group flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 w-full cursor-default"
              >
                <motion.div 
                  variants={{
                    hovered: { scale: 1.15, rotate: 8 }
                  }}
                  transition={{ duration: 0.4, ease: premiumEase }}
                  className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl bg-brand-orange/5 flex items-center justify-center flex-shrink-0"
                >
                  {icons[index % icons.length]}
                </motion.div>

                <div className="space-y-2 w-full">
                  <h3 className="font-onest text-sm lg:text-base font-black text-[#212120] uppercase tracking-tight leading-tight group-hover:text-brand-orange transition-colors duration-300">
                    {point.title}
                  </h3>
                  {point.description && (
                    <p className="font-medium text-xs lg:text-sm text-[#212120]/60 leading-relaxed">
                      {point.description}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </motion.section>
  );
}
