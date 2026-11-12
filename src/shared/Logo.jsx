// Thilal Al Sidr logo, cut from the vector cover of their Company Profile (research/brand/logo-green.png, 1686 x 1222):
// the big dark leaf and the small light leaf over a double oval, with the wordmark ظلال السدر. Green or white.
export const LOGO_RATIO = 1686 / 1222;

export function SidrLogo({ variant = 'green', height = 56, className, style, alt = 'ظلال السدر | Thilal Al Sidr' }) {
  const width = Math.round(height * LOGO_RATIO);
  return (
    <img
      className={className}
      style={style}
      src={`/brand/logo-${variant}-sm.webp`}
      srcSet={`/brand/logo-${variant}-sm.webp 480w, /brand/logo-${variant}.webp 1200w`}
      sizes={`${width}px`}
      width={width}
      height={height}
      alt={alt}
      decoding="async"
    />
  );
}
