import { Helmet } from "react-helmet-async";

export function HelmetComponent() {
  return (
    <Helmet>
      <title>Sessionly - Task Manager & Productivity Tracker</title>
      <meta
        name="description"
        content="Manage your tasks and boost productivity with Sessionly."
      />
      <meta property="og:title" content="Sessionly - Task Manager" />
      <meta
        property="og:description"
        content="Pomodoro timer, task analytics, and productivity tracker."
      />
      <meta property="og:type" content="website" />
      <meta
        property="og:url"
        content="https://akhileshu.github.io/Sessionly/"
      />
      <meta property="og:image" content="/og-image.png" />
      <script type="application/ld+json">
        {`
            {
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Sessionly",
              "operatingSystem": "Web",
              "applicationCategory": "ProductivityApplication",
              "url": "https://akhileshu.github.io/Sessionly/",
              "description": "Manage your tasks and boost productivity with Sessionly."
            }
          `}
      </script>
    </Helmet>
  );
}

