interface CountryFlagProps {
  countryCode: string | null | undefined;
  size?: 'sm' | 'md';
}

export default function CountryFlag({ countryCode, size = 'sm' }: CountryFlagProps) {
  if (!countryCode || countryCode.length !== 2) return null;

  const code = countryCode.toUpperCase();
  const flag = String.fromCodePoint(
    0x1f1e6 + code.charCodeAt(0) - 65,
    0x1f1e6 + code.charCodeAt(1) - 65
  );

  return (
    <span
      className={size === 'sm' ? 'text-sm' : 'text-lg'}
      role="img"
      aria-label={code}
    >
      {flag}
    </span>
  );
}
