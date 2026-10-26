import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Renders the small markdown subset the assistant writes — headings, lists,
 * bold, inline code and links — straight to React nodes. No HTML is ever
 * injected, so model output cannot execute script. Only relative links and
 * https links are made clickable.
 */
function inline(text: string, keyBase: string): ReactNode[] {
  const out: ReactNode[] = [];
  const pattern = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*|`([^`]+)`/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = pattern.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const key = `${keyBase}-${i++}`;
    if (m[1] && m[2]) {
      const href = m[2];
      if (href.startsWith("/") && !href.startsWith("//")) {
        out.push(
          <Link key={key} href={href} className="text-teal underline underline-offset-2">
            {m[1]}
          </Link>,
        );
      } else if (/^https:\/\//.test(href)) {
        out.push(
          <a key={key} href={href} target="_blank" rel="noopener noreferrer" className="text-teal underline underline-offset-2">
            {m[1]}
          </a>,
        );
      } else {
        out.push(m[1]);
      }
    } else if (m[3]) {
      out.push(
        <strong key={key} className="text-white font-semibold">
          {m[3]}
        </strong>,
      );
    } else if (m[4]) {
      out.push(
        <code key={key} className="px-1 py-0.5 rounded bg-white/10 text-[0.9em]">
          {m[4]}
        </code>,
      );
    }
    last = pattern.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export default function Markdown({ text, compact = false }: { text: string; compact?: boolean }) {
  const lines = text.replace(/\r/g, "").split("\n");
  const blocks: ReactNode[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;
  let para: string[] = [];

  const flushPara = () => {
    if (para.length) {
      const k = `p${blocks.length}`;
      blocks.push(
        <p key={k} className={compact ? "mb-2 last:mb-0" : "mb-3 last:mb-0"}>
          {inline(para.join(" "), k)}
        </p>,
      );
      para = [];
    }
  };
  const flushList = () => {
    if (list) {
      const k = `l${blocks.length}`;
      const Tag = list.ordered ? "ol" : "ul";
      blocks.push(
        <Tag key={k} className={`${list.ordered ? "list-decimal" : "list-disc"} pl-5 space-y-1 ${compact ? "mb-2" : "mb-3"}`}>
          {list.items.map((it, idx) => (
            <li key={idx}>{inline(it, `${k}-${idx}`)}</li>
          ))}
        </Tag>,
      );
      list = null;
    }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    const heading = /^(#{1,3})\s+(.*)$/.exec(line);
    const bullet = /^\s*[-*•]\s+(.*)$/.exec(line);
    const numbered = /^\s*\d+[.)]\s+(.*)$/.exec(line);

    if (!line.trim()) {
      flushPara();
      flushList();
    } else if (heading) {
      flushPara();
      flushList();
      const level = heading[1].length;
      const k = `h${blocks.length}`;
      blocks.push(
        level === 1 ? (
          <h3 key={k} className="text-white text-lg font-bold mb-1">{inline(heading[2], k)}</h3>
        ) : (
          <h4 key={k} className="text-teal text-xs font-bold tracking-widest uppercase mt-5 mb-2">{inline(heading[2], k)}</h4>
        ),
      );
    } else if (bullet || numbered) {
      flushPara();
      const ordered = Boolean(numbered);
      if (!list || list.ordered !== ordered) {
        flushList();
        list = { ordered, items: [] };
      }
      list.items.push((bullet ?? numbered)![1]);
    } else {
      flushList();
      para.push(line.trim());
    }
  }
  flushPara();
  flushList();
  return <>{blocks}</>;
}
