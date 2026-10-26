'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { CountryCode } from 'libphonenumber-js';
import { COUNTRIES, CountryItem, validateAndNormalizePhone } from '@/lib/country-phone-data';

export interface InternationalPhoneInputProps {
  value: string;
  onChange: (phone: string, meta: { e164: string; countryIso2: string; dialCode: string; isValid: boolean }) => void;
  defaultCountry?: CountryCode;
  error?: string | null;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

export function InternationalPhoneInput({
  value,
  onChange,
  defaultCountry = 'ID',
  error,
  placeholder = '81234567890',
  required = true,
  disabled = false,
}: InternationalPhoneInputProps) {
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(defaultCountry);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Current active country object
  const activeCountry = useMemo(() => {
    return COUNTRIES.find((c) => c.iso2 === selectedCountry) || COUNTRIES[0];
  }, [selectedCountry]);

  // Filtered countries for search
  const filteredCountries = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.dialCode.toLowerCase().includes(q) ||
        c.iso2.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Auto-focus search input
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle phone input changes & paste
  const handleInputChange = (raw: string) => {
    let clean = raw;

    // If pasted full international number with '+' e.g. +60123456789 or +62812...
    if (clean.startsWith('+')) {
      const check = validateAndNormalizePhone(clean, selectedCountry);
      if (check.countryIso2 && check.countryIso2 !== selectedCountry) {
        setSelectedCountry(check.countryIso2 as CountryCode);
      }
    }

    const validation = validateAndNormalizePhone(clean, selectedCountry);
    onChange(clean, {
      e164: validation.e164,
      countryIso2: validation.countryIso2,
      dialCode: validation.dialCode,
      isValid: validation.isValid,
    });
  };

  const handleCountrySelect = (country: CountryItem) => {
    setSelectedCountry(country.iso2);
    setIsOpen(false);
    setSearchQuery('');

    // Re-validate existing input with new country without clearing phone number!
    const validation = validateAndNormalizePhone(value, country.iso2);
    onChange(value, {
      e164: validation.e164,
      countryIso2: country.iso2,
      dialCode: country.dialCode,
      isValid: validation.isValid,
    });
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div
        className={`flex items-center w-full rounded-xl border bg-white transition-all ${
          error
            ? 'border-red-400 ring-2 ring-red-100'
            : 'border-slate-200 focus-within:border-[#1E3A8A] focus-within:ring-2 focus-within:ring-[#1E3A8A]/15'
        }`}
      >
        {/* Country Selector Button */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-3 py-2.5 bg-slate-50 hover:bg-slate-100/80 border-r border-slate-200 rounded-l-xl text-xs sm:text-sm font-medium text-slate-700 transition-colors shrink-0"
          aria-label="Pilih kode negara"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className="text-base leading-none select-none">{activeCountry.flag}</span>
          <span className="font-mono text-slate-900 font-semibold">{activeCountry.dialCode}</span>
          <svg
            className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Phone Number Input */}
        <input
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          disabled={disabled}
          required={required}
          value={value}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-mono text-slate-900 bg-transparent outline-none placeholder:text-slate-400"
        />
      </div>

      {/* Country Dropdown Panel */}
      {isOpen && (
        <div className="absolute top-full left-0 z-50 w-72 sm:w-80 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-fadeIn">
          {/* Search Bar */}
          <div className="p-2 border-b border-slate-100 bg-slate-50/70">
            <div className="relative">
              <svg
                className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari negara atau kode telepon..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-[#1E3A8A]"
              />
            </div>
          </div>

          {/* Country List */}
          <div className="max-h-56 overflow-y-auto divide-y divide-slate-50" role="listbox">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((c) => {
                const isSelected = c.iso2 === selectedCountry;
                return (
                  <button
                    key={c.iso2}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleCountrySelect(c)}
                    className={`w-full flex items-center justify-between px-3.5 py-2 text-left text-xs transition-colors hover:bg-slate-50 ${
                      isSelected ? 'bg-blue-50/70 text-[#1E3A8A] font-semibold' : 'text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate pr-2">
                      <span className="text-sm leading-none shrink-0">{c.flag}</span>
                      <span className="truncate">{c.name}</span>
                      <span className="text-[10px] text-slate-400 uppercase">({c.iso2})</span>
                    </div>
                    <span className="font-mono text-slate-500 font-medium shrink-0">{c.dialCode}</span>
                  </button>
                );
              })
            ) : (
              <div className="p-3 text-center text-xs text-slate-400">Negara tidak ditemukan</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
