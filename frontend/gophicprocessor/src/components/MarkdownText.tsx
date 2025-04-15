import React from "react";
import ReactMarkdown from "react-markdown";

interface MarkdownTextProps {
  text: string;
  className?: string;
  style?: object;
}

export default function MarkdownText({ text, className, style }: MarkdownTextProps) {
  return (
    <div style={{ whiteSpace: "pre-line", ...style }} className={className}>
      <ReactMarkdown>{text}</ReactMarkdown>
    </div>
  );
}
