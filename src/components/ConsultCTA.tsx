'use client';

import React from 'react';

interface ConsultCTAProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
}

const DEFAULTS = {
  title: 'Konsultasi Gratis dengan Dreamlab',
  description: 'Diskusikan HPP, formula, dan strategi brand kosmetik-mu tanpa komitmen awal.',
  buttonText: 'Konsultasi Gratis Sekarang',
  buttonHref: '/thankyou/google/',
};

const ConsultCTA: React.FC<ConsultCTAProps> = ({
  title = DEFAULTS.title,
  description = DEFAULTS.description,
  buttonText = DEFAULTS.buttonText,
  buttonHref = DEFAULTS.buttonHref,
}) => {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        borderRadius: 24,
        padding: '36px 48px',
        margin: '40px auto',
        boxShadow: '0 12px 40px rgba(0,0,0,0.18)',
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      <h3
        style={{
          color: '#ffffff',
          fontSize: 22,
          fontWeight: 800,
          margin: '0 0 10px',
          lineHeight: 1.3,
          textAlign: 'center',
        }}
      >
        {title}
      </h3>
      <p
        style={{
          color: '#a0aec0',
          fontSize: 14,
          margin: '0 0 20px',
          lineHeight: 1.6,
          textAlign: 'center',
        }}
      >
        {description}
      </p>
      <a
        href={buttonHref}
        style={{
          background: 'linear-gradient(135deg, #D98A00 0%, #e6a020 50%, #f0b830 100%)',
          color: '#ffffff',
          padding: '16px 44px',
          borderRadius: 50,
          fontWeight: 800,
          textDecoration: 'none',
          display: 'inline-block',
          fontSize: 15,
          letterSpacing: '0.5px',
          textAlign: 'center',
          position: 'relative',
          transition: 'all 0.3s ease',
          whiteSpace: 'nowrap',
          alignSelf: 'center',
          boxShadow: '0 8px 24px rgba(217,138,0,0.35)',
        }}
      >
        {buttonText}
      </a>
    </div>
  );
};

export default ConsultCTA;
