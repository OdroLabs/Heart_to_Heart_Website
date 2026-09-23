"use client";

import { useState } from "react";

const TRUNCATE_LENGTH = 80;

export function ExpandableText({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);

  if (text.length <= TRUNCATE_LENGTH) {
    return <span className="max-w-md">{text}</span>;
  }

  return (
    <div className="max-w-md">
      <span>{expanded ? text : `${text.slice(0, TRUNCATE_LENGTH)}…`}</span>{" "}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="font-medium text-primary hover:underline"
      >
        {expanded ? "Hide" : "View"}
      </button>
    </div>
  );
}
