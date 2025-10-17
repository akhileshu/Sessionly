"use client";

interface CategoryProjectSelectProps {
  categories: string[];
  projects: string[];
  category: string;
  project: string;
  onCategoryChange: (value: string) => void;
  onProjectChange: (value: string) => void;
}

export function CategoryProjectSelect({
  categories,
  projects,
  category,
  project,
  onCategoryChange,
  onProjectChange,
}: CategoryProjectSelectProps) {
  return (
    <div className="flex gap-2 ml-auto">
      {/* Category dropdown */}
      <select
        className="border px-2 py-1 rounded"
        value={category}
        onChange={(e) => {
          const v = e.target.value;
          onCategoryChange(v);
          if (v !== "project") onProjectChange("");
        }}
      >
        <option className="bg-gray-800" value="">Select Category</option>
        {categories.map((c) => (
          <option className="bg-gray-800" key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      {/* Project dropdown — only visible if category = "project" */}
      {category === "project" && (
        <select
          className="border px-2 py-1 rounded"
          value={project}
          onChange={(e) => onProjectChange(e.target.value)}
        >
          <option className="bg-gray-800" value="">Select Project</option>
          {projects.map((p) => (
            <option className="bg-gray-800" key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
