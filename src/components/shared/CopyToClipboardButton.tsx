import { useState } from "react";
import { Button } from "./Button";
import { cn } from "@/lib/utils";

export function CopyToClipboardButton({ text,className }: { text: string,className?:string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500); // reset after 1.5s
    } catch {
      setCopied(false);
    }
  };

  return (
    <Button
      className={cn("", className)}
      variant="primary"
      onClick={handleCopy}
    >
      {copied ? "Copied!" : "Copy to clipboard"}
    </Button>
  );
}
