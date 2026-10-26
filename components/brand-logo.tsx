import Image from "next/image";

type BrandLogoProps = {
  className?: string;
  inverse?: boolean;
  compact?: boolean;
};

export default function BrandLogo({ className = "", inverse = false, compact = false }: BrandLogoProps) {
  return (
    <span className={`inline-flex shrink-0 items-center tracking-normal ${className}`} aria-label="Linkdrive Auto Hub">
      <Image
        src="/linkdrive_logo.jpg"
        alt="Linkdrive Auto Hub"
        width={compact ? 40 : 56}
        height={compact ? 40 : 56}
        className={`rounded-full object-cover ${inverse ? "ring-1 ring-white/20" : ""}`}
        priority
      />
    </span>
  );
}