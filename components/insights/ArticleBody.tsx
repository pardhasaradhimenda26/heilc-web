import { headingId, type Block } from "@/lib/content/insights";

/**
 * Renders article blocks as plain semantic HTML on the server — no client
 * component, no hydration gate. Every word is in the initial response.
 */
export default function ArticleBody({ blocks }: { blocks: Block[] }) {
  return (
    <div className="prose-heilc">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "h2":
            return (
              <h2 key={i} id={headingId(block.text)} className="scroll-mt-28">
                {block.text}
              </h2>
            );
          case "h3":
            return (
              <h3 key={i} id={headingId(block.text)} className="scroll-mt-28">
                {block.text}
              </h3>
            );
          case "p":
            return <p key={i}>{block.text}</p>;
          case "ul":
            return (
              <ul key={i}>
                {block.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={i}>
                {block.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ol>
            );
          case "dl":
            return (
              <dl key={i}>
                {block.items.map((item, j) => (
                  <div key={j}>
                    <dt>{item.term}</dt>
                    <dd>{item.def}</dd>
                  </div>
                ))}
              </dl>
            );
          case "callout":
            return (
              <aside
                key={i}
                className="my-8 rounded-xl border-l-2 border-teal bg-teal/5 px-6 py-5 text-white/70 text-[15px] leading-relaxed"
              >
                {block.text}
              </aside>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
