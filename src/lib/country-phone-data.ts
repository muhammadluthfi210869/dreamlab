import {
  parsePhoneNumberFromString,
  getCountries,
  getCountryCallingCode,
  CountryCode,
} from 'libphonenumber-js';

export interface CountryItem {
  iso2: CountryCode;
  name: string;
  dialCode: string;
  flag: string;
}

function getFlagEmoji(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

const displayNames =
  typeof Intl !== 'undefined' && Intl.DisplayNames
    ? new Intl.DisplayNames(['id', 'en'], { type: 'region' })
    : null;

// Build list of all countries
const rawCountries: CountryItem[] = getCountries().map((iso2) => {
  let name: string = iso2;
  try {
    if (displayNames) {
      name = displayNames.of(iso2) || iso2;
    }
  } catch {
    name = iso2;
  }
  const dialCode = '+' + getCountryCallingCode(iso2);
  return {
    iso2,
    name,
    dialCode,
    flag: getFlagEmoji(iso2),
  };
});

// Priority countries to show at the top of the dropdown
const PRIORITY_ISO: CountryCode[] = ['ID', 'MY', 'SG', 'AU', 'US', 'GB', 'SA', 'AE', 'JP', 'KR'];

const priorityList: CountryItem[] = [];
const otherList: CountryItem[] = [];

for (const code of PRIORITY_ISO) {
  const found = rawCountries.find((c) => c.iso2 === code);
  if (found) priorityList.push(found);
}

for (const c of rawCountries) {
  if (!PRIORITY_ISO.includes(c.iso2)) {
    otherList.push(c);
  }
}

// Sort others alphabetically by name
otherList.sort((a, b) => a.name.localeCompare(b.name, 'id'));

export const COUNTRIES: CountryItem[] = [...priorityList, ...otherList];

export interface PhoneValidationResult {
  isValid: boolean;
  e164: string;
  countryIso2: string;
  dialCode: string;
  formattedNational?: string;
  error?: string;
}

export function validateAndNormalizePhone(
  rawInput: string,
  selectedCountryIso2: CountryCode = 'ID'
): PhoneValidationResult {
  const trimmed = (rawInput || '').trim();
  if (!trimmed) {
    return {
      isValid: false,
      e164: '',
      countryIso2: selectedCountryIso2,
      dialCode: '+' + getCountryCallingCode(selectedCountryIso2),
      error: 'Nomor WhatsApp wajib diisi.',
    };
  }

  // Pre-process Indonesian input specifically to avoid edge cases with leading zero/country code
  let toParse = trimmed;
  if (selectedCountryIso2 === 'ID') {
    // If user typed 628xxx without plus
    if (/^62[0-9]{8,13}$/.test(toParse)) {
      toParse = '+' + toParse;
    }
  }

  try {
    // Try parsing with selected country as default
    let parsed = parsePhoneNumberFromString(toParse, selectedCountryIso2);

    // If user pasted a full international number with + prefix of another country
    if (toParse.startsWith('+') && parsed) {
      // It will automatically detect the actual country from the prefix
    }

    if (parsed && parsed.isValid()) {
      const country = (parsed.country || selectedCountryIso2) as CountryCode;
      const dial = '+' + (parsed.countryCallingCode || getCountryCallingCode(country));
      return {
        isValid: true,
        e164: parsed.number, // e.g. +6281234567890
        countryIso2: country,
        dialCode: dial,
        formattedNational: parsed.formatNational(),
      };
    }

    return {
      isValid: false,
      e164: '',
      countryIso2: selectedCountryIso2,
      dialCode: '+' + getCountryCallingCode(selectedCountryIso2),
      error: `Format nomor WhatsApp tidak valid untuk ${
        COUNTRIES.find((c) => c.iso2 === selectedCountryIso2)?.name || selectedCountryIso2
      }. Pastikan jumlah digit sesuai.`,
    };
  } catch (err: any) {
    return {
      isValid: false,
      e164: '',
      countryIso2: selectedCountryIso2,
      dialCode: '+' + getCountryCallingCode(selectedCountryIso2),
      error: 'Nomor telepon tidak dapat diproses. Silakan periksa kembali.',
    };
  }
}
