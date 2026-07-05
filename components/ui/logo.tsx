interface LogoProps {
  variant?: "dark" | "light";
  className?: string;
  showMark?: boolean;
}

/**
 * KYOSO BASE ロゴタイプ。
 * マーク＝2つの円が重なる「共創（co-creation）」のエクリプス。
 * モノクロのエディトリアル体系に合わせ、SVG＋テキストで常にクリスプに描画する。
 */
export default function Logo({
  variant = "dark",
  className = "",
  showMark = true,
}: LogoProps) {
  const ink = variant === "dark" ? "#0a0a0a" : "#ffffff";
  const muted = variant === "dark" ? "#a1a1aa" : "#8f8f96";

  return (
    <span
      className={`inline-flex items-center gap-2.5 ${className}`}
      aria-label="KYOSO BASE"
    >
      {showMark && (
        <svg
          width="30"
          height="18"
          viewBox="0 0 30 18"
          fill="none"
          aria-hidden="true"
          className="shrink-0"
        >
          <circle cx="19.5" cy="9" r="7.3" fill={ink} />
          <circle cx="10.5" cy="9" r="7.3" fill="none" stroke={ink} strokeWidth="2.1" />
        </svg>
      )}
      <span className="font-display text-[1.15rem] font-extrabold leading-none tracking-tight sm:text-[1.35rem]">
        <span style={{ color: ink }}>KYOSO</span>
        <span style={{ color: muted }}>&nbsp;BASE</span>
      </span>
    </span>
  );
}
