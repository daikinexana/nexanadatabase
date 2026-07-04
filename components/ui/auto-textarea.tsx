"use client";

import { useLayoutEffect, useRef, type TextareaHTMLAttributes } from "react";

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  /** 初期表示・最小の行数 */
  minRows?: number;
};

/**
 * 入力内容に合わせて高さが自動で伸びる textarea。
 * 文字量が増えても隠れず、全文が見えるようにする。
 */
export default function AutoTextarea({
  minRows = 3,
  value,
  className = "",
  style,
  ...props
}: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const resize = () => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  // 値の変化（外部からの読み込み含む）ごとに高さを再計算
  useLayoutEffect(() => {
    resize();
  }, [value]);

  return (
    <textarea
      ref={ref}
      value={value}
      onInput={resize}
      rows={minRows}
      className={`resize-none overflow-hidden ${className}`}
      style={{ minHeight: `calc(${minRows} * 1.5em + 1.25rem)`, ...style }}
      {...props}
    />
  );
}
