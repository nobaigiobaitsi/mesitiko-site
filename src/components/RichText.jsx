import { Link } from "react-router-dom";

// Small, explicit rich text schema; content is rendered as React, never raw HTML.
export function RichText({ children = [] }) {
  return children.map((part, index) => {
    if (typeof part === "string") return part;
    const { tag, href, children: nested } = part;
    if (tag === "br") return <br key={index} />;
    if (tag === "a") {
      if (href.startsWith("/")) {
        return (
          <Link key={index} to={href}>
            <RichText>{nested}</RichText>
          </Link>
        );
      }
      return (
        <a
          key={index}
          href={href}
          target={href.startsWith("https:") ? "_blank" : undefined}
          rel="noopener noreferrer"
        >
          <RichText>{nested}</RichText>
        </a>
      );
    }
    const Tag = ["strong", "b", "em", "i"].includes(tag) ? tag : "span";
    return (
      <Tag key={index}>
        <RichText>{nested}</RichText>
      </Tag>
    );
  });
}

export function ContentBlocks({ blocks }) {
  return blocks.map((block, index) => {
    const Tag = ["h2", "h3", "h4", "p", "blockquote", "ul", "ol"].includes(
      block.tag,
    )
      ? block.tag
      : "p";
    return (
      <Tag key={index}>
        {block.items ? (
          block.items.map((item, i) => (
            <li key={i}>
              <RichText>{item}</RichText>
            </li>
          ))
        ) : (
          <RichText>{block.children}</RichText>
        )}
      </Tag>
    );
  });
}
