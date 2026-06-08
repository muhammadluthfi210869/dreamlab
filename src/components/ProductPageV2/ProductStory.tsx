"use client";

interface ProductStoryProps {
  story: string;
  productName: string;
}

export default function ProductStory({ story, productName }: ProductStoryProps) {
  return (
    <div className="py-8 px-4 bg-brand-light-blue rounded-2xl">
      <div className="max-w-2xl mx-auto">
        {/* Quote Icon */}
        <div className="flex justify-center mb-4">
          <svg className="w-12 h-12 text-brand-orange/30" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
        </div>
        
        {/* Story Content */}
        <div className="text-center">
          <p className="text-lg md:text-xl text-brand-black leading-relaxed italic mb-4">
            {story.split('\n\n')[0]}
          </p>
          {story.split('\n\n').length > 1 && (
            <p className="text-brand-gray">
              {story.split('\n\n')[1]}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}