export function GhTable({ rows }: { rows: Array<any> }) {
  return (
    <div className="overflow-x-auto">
      <table
        className="min-w-full text-sm text-left border rounded-md shadow-sm
                        bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
      >
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300">
              Name
            </th>
            <th className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300">
              Description
            </th>
            <th className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300">
              Stars
            </th>
            <th className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300">
              Language
            </th>
            <th className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300">
              Updated
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {rows.map((r: any) => (
            <tr
              key={r.name}
              className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <td className="px-4 py-3">
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {r.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {r.subtitle}
                </div>
              </td>
              <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                {r.description}
              </td>
              <td className="px-4 py-3">
                <span
                  className="inline-flex items-center px-2 py-0.5 text-xs font-medium
                                 bg-gray-100 dark:bg-gray-800 rounded text-gray-800 dark:text-gray-200"
                >
                  ★ {r.stars}
                </span>
              </td>
              <td className="px-4 py-3 text-sm font-mono text-gray-600 dark:text-gray-400">
                {r.lang}
              </td>
              <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs">
                {r.updated}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function GhTableWithData() {
  const rows = [
    {
      name: "sessionly",
      subtitle: "A tiny session tracker",
      description: "Pomodoro-like timer with projects & categories",
      stars: 124,
      lang: "TypeScript",
      updated: "Oct 18, 2025",
    },
    {
      name: "ui-kit",
      subtitle: "Shared components",
      description: "Buttons, modals and tokens",
      stars: 89,
      lang: "React",
      updated: "Sep 30, 2025",
    },
    {
      name: "next-blog",
      subtitle: "Personal blog",
      description: "Next.js + Tailwind blog template",
      stars: 56,
      lang: "Next.js",
      updated: "Oct 10, 2025",
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-lg font-bold mb-4">My GitHub-style Table</h1>
      <GhTable rows={rows} />
    </div>
  );
}
