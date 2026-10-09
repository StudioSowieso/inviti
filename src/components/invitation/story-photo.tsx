/** De geüploade foto van "Ons verhaal": vult het (relatief gepositioneerde) kader waarin hij staat. */
export function StoryImg({ src, className = "" }: { src: string; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" loading="lazy" decoding="async" className={`absolute inset-0 h-full w-full object-cover ${className}`} />
  );
}
