'use client';

import React from 'react';

interface FloatingWhatsAppCTAProps {
  onClick: () => void;
  label?: string;
}

export function FloatingWhatsAppCTA({
  onClick,
  label = 'Konsultasi WhatsApp',
}: FloatingWhatsAppCTAProps) {
  return (
    <>
      <style>{`
        .dreamlab-floating-wa {
          position: fixed;
          right: 24px;
          bottom: 24px;
          z-index: 999;
          height: 52px;
          border-radius: 99px;
          background: #25d366;
          color: #ffffff;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 0 22px 0 16px;
          box-shadow: 0 12px 30px rgba(37, 211, 102, 0.45);
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          font-size: 14px;
          font-weight: 800;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          border: none;
          cursor: pointer;
        }
        .dreamlab-floating-wa:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 18px 40px rgba(37, 211, 102, 0.55);
        }
        .dreamlab-floating-wa .wa-ping {
          position: absolute;
          top: -3px;
          right: -3px;
          width: 14px;
          height: 14px;
          background: #ff3b30;
          border: 2px solid #ffffff;
          border-radius: 50%;
          animation: wa-pulse 2s infinite;
        }
        @keyframes wa-pulse {
          0% { transform: scale(0.9); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.5; }
          100% { transform: scale(0.9); opacity: 1; }
        }
        @media (max-width: 640px) {
          .dreamlab-floating-wa {
            right: 16px;
            bottom: 16px;
            height: 48px;
            padding: 0 18px 0 14px;
            font-size: 13px;
          }
        }
      `}</style>
      <button
        type="button"
        className="dreamlab-floating-wa track"
        data-location="floating-whatsapp"
        onClick={onClick}
        aria-label="Konsultasi WhatsApp Langsung"
      >
        <span className="wa-ping" aria-hidden="true" />
        <svg
          viewBox="0 0 24 24"
          width="26"
          height="26"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>
        <span className="wa-label">{label}</span>
      </button>
    </>
  );
}
