import { useState, type ReactNode } from "react";

export function Tabs({
  tabs,
  defaultValue,
}: {
  tabs: { value: string; label: string; content: ReactNode }[];
  defaultValue?: string;
}) {
  const [active, setActive] = useState(defaultValue ?? tabs[0].value);
  return (
    <div>
      {/* Tab buttons */}
      <div className="flex gap-2 border-b mb-4">
        {tabs.map((t) => (
          <button
            key={t.value}
            onClick={() => setActive(t.value)}
            className={`px-3 py-1 text-sm font-medium border-b-2 transition-colors ${
              active === t.value
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div>
        {tabs.map(
          (t) =>
            active === t.value && (
              <div key={t.value} className="animate-fadeIn">
                {t.content}
              </div>
            )
        )}
      </div>
    </div>
  );
}
