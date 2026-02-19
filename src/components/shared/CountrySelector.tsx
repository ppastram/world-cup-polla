'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { useTranslation } from '@/i18n';

interface Country {
  code: string;
  name: string;
}

const FEATURED_CODES = [
  'CO', 'US', 'MX', 'AR', 'BR', 'CL', 'PE', 'EC', 'VE', 'UY',
  'PY', 'BO', 'CR', 'PA', 'GT', 'HN', 'SV', 'DO', 'CA', 'ES',
];

const FEATURED_SET = new Set(FEATURED_CODES);

const COUNTRY_NAMES: Record<string, { es: string; en: string }> = {
  AF: { es: 'Afganistán', en: 'Afghanistan' },
  AL: { es: 'Albania', en: 'Albania' },
  DE: { es: 'Alemania', en: 'Germany' },
  AD: { es: 'Andorra', en: 'Andorra' },
  AO: { es: 'Angola', en: 'Angola' },
  AG: { es: 'Antigua y Barbuda', en: 'Antigua and Barbuda' },
  SA: { es: 'Arabia Saudita', en: 'Saudi Arabia' },
  DZ: { es: 'Argelia', en: 'Algeria' },
  AR: { es: 'Argentina', en: 'Argentina' },
  AM: { es: 'Armenia', en: 'Armenia' },
  AU: { es: 'Australia', en: 'Australia' },
  AT: { es: 'Austria', en: 'Austria' },
  AZ: { es: 'Azerbaiyán', en: 'Azerbaijan' },
  BS: { es: 'Bahamas', en: 'Bahamas' },
  BD: { es: 'Bangladés', en: 'Bangladesh' },
  BB: { es: 'Barbados', en: 'Barbados' },
  BH: { es: 'Baréin', en: 'Bahrain' },
  BE: { es: 'Bélgica', en: 'Belgium' },
  BZ: { es: 'Belice', en: 'Belize' },
  BJ: { es: 'Benín', en: 'Benin' },
  BY: { es: 'Bielorrusia', en: 'Belarus' },
  MM: { es: 'Birmania', en: 'Myanmar' },
  BO: { es: 'Bolivia', en: 'Bolivia' },
  BA: { es: 'Bosnia y Herzegovina', en: 'Bosnia and Herzegovina' },
  BW: { es: 'Botsuana', en: 'Botswana' },
  BR: { es: 'Brasil', en: 'Brazil' },
  BN: { es: 'Brunéi', en: 'Brunei' },
  BG: { es: 'Bulgaria', en: 'Bulgaria' },
  BF: { es: 'Burkina Faso', en: 'Burkina Faso' },
  BI: { es: 'Burundi', en: 'Burundi' },
  BT: { es: 'Bután', en: 'Bhutan' },
  CV: { es: 'Cabo Verde', en: 'Cape Verde' },
  KH: { es: 'Camboya', en: 'Cambodia' },
  CM: { es: 'Camerún', en: 'Cameroon' },
  CA: { es: 'Canadá', en: 'Canada' },
  QA: { es: 'Catar', en: 'Qatar' },
  TD: { es: 'Chad', en: 'Chad' },
  CL: { es: 'Chile', en: 'Chile' },
  CN: { es: 'China', en: 'China' },
  CY: { es: 'Chipre', en: 'Cyprus' },
  VA: { es: 'Ciudad del Vaticano', en: 'Vatican City' },
  CO: { es: 'Colombia', en: 'Colombia' },
  KM: { es: 'Comoras', en: 'Comoros' },
  KP: { es: 'Corea del Norte', en: 'North Korea' },
  KR: { es: 'Corea del Sur', en: 'South Korea' },
  CI: { es: 'Costa de Marfil', en: 'Ivory Coast' },
  CR: { es: 'Costa Rica', en: 'Costa Rica' },
  HR: { es: 'Croacia', en: 'Croatia' },
  CU: { es: 'Cuba', en: 'Cuba' },
  DK: { es: 'Dinamarca', en: 'Denmark' },
  DM: { es: 'Dominica', en: 'Dominica' },
  EC: { es: 'Ecuador', en: 'Ecuador' },
  EG: { es: 'Egipto', en: 'Egypt' },
  SV: { es: 'El Salvador', en: 'El Salvador' },
  AE: { es: 'Emiratos Árabes Unidos', en: 'United Arab Emirates' },
  ER: { es: 'Eritrea', en: 'Eritrea' },
  SK: { es: 'Eslovaquia', en: 'Slovakia' },
  SI: { es: 'Eslovenia', en: 'Slovenia' },
  ES: { es: 'España', en: 'Spain' },
  US: { es: 'Estados Unidos', en: 'United States' },
  EE: { es: 'Estonia', en: 'Estonia' },
  SZ: { es: 'Esuatini', en: 'Eswatini' },
  ET: { es: 'Etiopía', en: 'Ethiopia' },
  PH: { es: 'Filipinas', en: 'Philippines' },
  FI: { es: 'Finlandia', en: 'Finland' },
  FJ: { es: 'Fiyi', en: 'Fiji' },
  FR: { es: 'Francia', en: 'France' },
  GA: { es: 'Gabón', en: 'Gabon' },
  GM: { es: 'Gambia', en: 'Gambia' },
  GE: { es: 'Georgia', en: 'Georgia' },
  GH: { es: 'Ghana', en: 'Ghana' },
  GD: { es: 'Granada', en: 'Grenada' },
  GR: { es: 'Grecia', en: 'Greece' },
  GT: { es: 'Guatemala', en: 'Guatemala' },
  GN: { es: 'Guinea', en: 'Guinea' },
  GQ: { es: 'Guinea Ecuatorial', en: 'Equatorial Guinea' },
  GW: { es: 'Guinea-Bisáu', en: 'Guinea-Bissau' },
  GY: { es: 'Guyana', en: 'Guyana' },
  HT: { es: 'Haití', en: 'Haiti' },
  HN: { es: 'Honduras', en: 'Honduras' },
  HU: { es: 'Hungría', en: 'Hungary' },
  IN: { es: 'India', en: 'India' },
  ID: { es: 'Indonesia', en: 'Indonesia' },
  IQ: { es: 'Irak', en: 'Iraq' },
  IR: { es: 'Irán', en: 'Iran' },
  IE: { es: 'Irlanda', en: 'Ireland' },
  IS: { es: 'Islandia', en: 'Iceland' },
  MH: { es: 'Islas Marshall', en: 'Marshall Islands' },
  SB: { es: 'Islas Salomón', en: 'Solomon Islands' },
  IL: { es: 'Israel', en: 'Israel' },
  IT: { es: 'Italia', en: 'Italy' },
  JM: { es: 'Jamaica', en: 'Jamaica' },
  JP: { es: 'Japón', en: 'Japan' },
  JO: { es: 'Jordania', en: 'Jordan' },
  KZ: { es: 'Kazajistán', en: 'Kazakhstan' },
  KE: { es: 'Kenia', en: 'Kenya' },
  KG: { es: 'Kirguistán', en: 'Kyrgyzstan' },
  KI: { es: 'Kiribati', en: 'Kiribati' },
  KW: { es: 'Kuwait', en: 'Kuwait' },
  LA: { es: 'Laos', en: 'Laos' },
  LS: { es: 'Lesoto', en: 'Lesotho' },
  LV: { es: 'Letonia', en: 'Latvia' },
  LB: { es: 'Líbano', en: 'Lebanon' },
  LR: { es: 'Liberia', en: 'Liberia' },
  LY: { es: 'Libia', en: 'Libya' },
  LI: { es: 'Liechtenstein', en: 'Liechtenstein' },
  LT: { es: 'Lituania', en: 'Lithuania' },
  LU: { es: 'Luxemburgo', en: 'Luxembourg' },
  MK: { es: 'Macedonia del Norte', en: 'North Macedonia' },
  MG: { es: 'Madagascar', en: 'Madagascar' },
  MY: { es: 'Malasia', en: 'Malaysia' },
  MW: { es: 'Malaui', en: 'Malawi' },
  MV: { es: 'Maldivas', en: 'Maldives' },
  ML: { es: 'Malí', en: 'Mali' },
  MT: { es: 'Malta', en: 'Malta' },
  MA: { es: 'Marruecos', en: 'Morocco' },
  MU: { es: 'Mauricio', en: 'Mauritius' },
  MR: { es: 'Mauritania', en: 'Mauritania' },
  MX: { es: 'México', en: 'Mexico' },
  FM: { es: 'Micronesia', en: 'Micronesia' },
  MD: { es: 'Moldavia', en: 'Moldova' },
  MC: { es: 'Mónaco', en: 'Monaco' },
  MN: { es: 'Mongolia', en: 'Mongolia' },
  ME: { es: 'Montenegro', en: 'Montenegro' },
  MZ: { es: 'Mozambique', en: 'Mozambique' },
  NA: { es: 'Namibia', en: 'Namibia' },
  NR: { es: 'Nauru', en: 'Nauru' },
  NP: { es: 'Nepal', en: 'Nepal' },
  NI: { es: 'Nicaragua', en: 'Nicaragua' },
  NE: { es: 'Níger', en: 'Niger' },
  NG: { es: 'Nigeria', en: 'Nigeria' },
  NO: { es: 'Noruega', en: 'Norway' },
  NZ: { es: 'Nueva Zelanda', en: 'New Zealand' },
  OM: { es: 'Omán', en: 'Oman' },
  NL: { es: 'Países Bajos', en: 'Netherlands' },
  PK: { es: 'Pakistán', en: 'Pakistan' },
  PW: { es: 'Palaos', en: 'Palau' },
  PS: { es: 'Palestina', en: 'Palestine' },
  PA: { es: 'Panamá', en: 'Panama' },
  PG: { es: 'Papúa Nueva Guinea', en: 'Papua New Guinea' },
  PY: { es: 'Paraguay', en: 'Paraguay' },
  PE: { es: 'Perú', en: 'Peru' },
  PL: { es: 'Polonia', en: 'Poland' },
  PT: { es: 'Portugal', en: 'Portugal' },
  GB: { es: 'Reino Unido', en: 'United Kingdom' },
  CF: { es: 'República Centroafricana', en: 'Central African Republic' },
  CZ: { es: 'República Checa', en: 'Czech Republic' },
  CG: { es: 'República del Congo', en: 'Republic of the Congo' },
  CD: { es: 'República Democrática del Congo', en: 'Democratic Republic of the Congo' },
  DO: { es: 'República Dominicana', en: 'Dominican Republic' },
  RW: { es: 'Ruanda', en: 'Rwanda' },
  RO: { es: 'Rumanía', en: 'Romania' },
  RU: { es: 'Rusia', en: 'Russia' },
  WS: { es: 'Samoa', en: 'Samoa' },
  KN: { es: 'San Cristóbal y Nieves', en: 'Saint Kitts and Nevis' },
  SM: { es: 'San Marino', en: 'San Marino' },
  VC: { es: 'San Vicente y las Granadinas', en: 'Saint Vincent and the Grenadines' },
  LC: { es: 'Santa Lucía', en: 'Saint Lucia' },
  ST: { es: 'Santo Tomé y Príncipe', en: 'São Tomé and Príncipe' },
  SN: { es: 'Senegal', en: 'Senegal' },
  RS: { es: 'Serbia', en: 'Serbia' },
  SC: { es: 'Seychelles', en: 'Seychelles' },
  SL: { es: 'Sierra Leona', en: 'Sierra Leone' },
  SG: { es: 'Singapur', en: 'Singapore' },
  SY: { es: 'Siria', en: 'Syria' },
  SO: { es: 'Somalia', en: 'Somalia' },
  LK: { es: 'Sri Lanka', en: 'Sri Lanka' },
  ZA: { es: 'Sudáfrica', en: 'South Africa' },
  SD: { es: 'Sudán', en: 'Sudan' },
  SS: { es: 'Sudán del Sur', en: 'South Sudan' },
  SE: { es: 'Suecia', en: 'Sweden' },
  CH: { es: 'Suiza', en: 'Switzerland' },
  SR: { es: 'Surinam', en: 'Suriname' },
  TH: { es: 'Tailandia', en: 'Thailand' },
  TW: { es: 'Taiwán', en: 'Taiwan' },
  TZ: { es: 'Tanzania', en: 'Tanzania' },
  TJ: { es: 'Tayikistán', en: 'Tajikistan' },
  TL: { es: 'Timor Oriental', en: 'East Timor' },
  TG: { es: 'Togo', en: 'Togo' },
  TO: { es: 'Tonga', en: 'Tonga' },
  TT: { es: 'Trinidad y Tobago', en: 'Trinidad and Tobago' },
  TN: { es: 'Túnez', en: 'Tunisia' },
  TM: { es: 'Turkmenistán', en: 'Turkmenistan' },
  TR: { es: 'Turquía', en: 'Turkey' },
  TV: { es: 'Tuvalu', en: 'Tuvalu' },
  UA: { es: 'Ucrania', en: 'Ukraine' },
  UG: { es: 'Uganda', en: 'Uganda' },
  UY: { es: 'Uruguay', en: 'Uruguay' },
  UZ: { es: 'Uzbekistán', en: 'Uzbekistan' },
  VU: { es: 'Vanuatu', en: 'Vanuatu' },
  VE: { es: 'Venezuela', en: 'Venezuela' },
  VN: { es: 'Vietnam', en: 'Vietnam' },
  YE: { es: 'Yemen', en: 'Yemen' },
  DJ: { es: 'Yibuti', en: 'Djibouti' },
  ZM: { es: 'Zambia', en: 'Zambia' },
  ZW: { es: 'Zimbabue', en: 'Zimbabwe' },
};

function codeToFlag(code: string): string {
  const upper = code.toUpperCase();
  return String.fromCodePoint(
    0x1f1e6 + upper.charCodeAt(0) - 65,
    0x1f1e6 + upper.charCodeAt(1) - 65
  );
}

function buildLists(locale: string): { featured: Country[]; other: Country[] } {
  const lang = locale === 'en' ? 'en' : 'es';
  const featured = FEATURED_CODES.map((code) => ({
    code,
    name: COUNTRY_NAMES[code]?.[lang] ?? code,
  }));
  const other = Object.keys(COUNTRY_NAMES)
    .filter((code) => !FEATURED_SET.has(code))
    .map((code) => ({ code, name: COUNTRY_NAMES[code][lang] }))
    .sort((a, b) => a.name.localeCompare(b.name, locale));
  return { featured, other };
}

interface CountrySelectorProps {
  value: string | null;
  onChange: (code: string | null) => void;
  label?: string;
}

export default function CountrySelector({ value, onChange, label }: CountrySelectorProps) {
  const { t, locale } = useTranslation();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  const { featured, other } = useMemo(() => buildLists(locale), [locale]);
  const all = useMemo(() => [...featured, ...other], [featured, other]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const filtered = search
    ? all.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.code.toLowerCase().includes(search.toLowerCase())
      )
    : null;

  const selected = value ? all.find((c) => c.code === value) : null;

  return (
    <div ref={ref} className="relative">
      {label && (
        <label className="text-xs text-gray-500 uppercase tracking-wider block mb-2">
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between bg-wc-darker border border-wc-border rounded-lg px-4 py-2.5 text-sm text-left hover:border-gray-600 transition-colors"
      >
        <span className={selected ? 'text-white' : 'text-gray-600'}>
          {selected ? `${codeToFlag(selected.code)} ${selected.name}` : t('country.placeholder')}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-wc-card border border-wc-border rounded-lg shadow-xl max-h-60 overflow-hidden">
          <div className="p-2 border-b border-wc-border">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-wc-darker border border-wc-border rounded pl-8 pr-3 py-1.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gold-500/50"
                placeholder={t('country.search')}
                autoFocus
              />
            </div>
          </div>
          <div className="overflow-y-auto max-h-48">
            {filtered ? (
              filtered.length === 0 ? (
                <p className="text-sm text-gray-500 p-3 text-center">{t('country.noResults')}</p>
              ) : (
                filtered.map((c) => (
                  <CountryOption
                    key={c.code}
                    country={c}
                    selected={value === c.code}
                    onSelect={() => { onChange(c.code); setOpen(false); setSearch(''); }}
                  />
                ))
              )
            ) : (
              <>
                {featured.map((c) => (
                  <CountryOption
                    key={c.code}
                    country={c}
                    selected={value === c.code}
                    onSelect={() => { onChange(c.code); setOpen(false); }}
                  />
                ))}
                <div className="px-3 py-1.5 text-xs text-gray-600 uppercase tracking-wider bg-wc-darker">
                  {t('country.other')}
                </div>
                {other.map((c) => (
                  <CountryOption
                    key={c.code}
                    country={c}
                    selected={value === c.code}
                    onSelect={() => { onChange(c.code); setOpen(false); }}
                  />
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function CountryOption({ country, selected, onSelect }: { country: Country; selected: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-white/5 transition-colors ${
        selected ? 'text-gold-400 bg-gold-500/10' : 'text-gray-300'
      }`}
    >
      <span>{codeToFlag(country.code)}</span>
      <span>{country.name}</span>
    </button>
  );
}
