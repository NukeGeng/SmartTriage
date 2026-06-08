// CopyButton.tsx - Clipboard action atom for demo scripts and ticket examples.
"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

import { Button } from "@/components/ui/Button";

interface CopyButtonProps {
  value: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
}

export function CopyButton({
  value,
  label = "Copy",
  copiedLabel = "Copied",
  className,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <Button
      type="button"
      variant="secondary"
      className={className}
      icon={copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
      onClick={handleCopy}
      aria-live="polite"
    >
      {copied ? copiedLabel : label}
    </Button>
  );
}
