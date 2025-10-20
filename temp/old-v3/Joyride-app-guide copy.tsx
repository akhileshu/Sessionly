import { useEffect, useState } from "react";
import Joyride, { type Step, STATUS } from "react-joyride";

const steps: Step[] = [
  {
    target: ".sidebar-trigger-outside",
    content:
      "Click here to open your sidebar and access key sections of the app.",
  },
  {
    target: "button.add-sample-projects-and-categories",
    content:
      "Add some sample projects and categories to explore the app quickly.",
  },
  {
    target: "[value='manage-my-preferences']",
    content: "Manage your preferences here",
  },
  {
    target: ".sidebar-trigger-inside",
    content:
      "Click here again to close the sidebar when you're done exploring.",
  },
  {
    target: ".create-session button[type='submit']",
    content: "Start a new session to begin tracking your work or study tasks.",
  },
  {
    target: "button.init-sample-session",
    content:
      "You can also create a sample session to see how it works in action.",
  },
  {
    target: "[value='session-table']",
    content:
      "This table lists your tasks. Drag and drop to reorder them as needed.",
  },
  {
    target: ".session-timer",
    content:
      "Use the timer controls here to start, pause, your work/break session.",
  },
  {
    target: ".session-current-task-notes",
    content:
      "view notes for your current task — useful for quick reflections or ideas.",
  },
];

/**
 *
 * @todo - react-joyride npm package has version conflicts with react19
 *
 * npm i react-joyride npm error code ERESOLVE npm error ERESOLVE unable to resolve dependency tree
 */
export default function AppTour() {
  const [run, setRun] = useState(false);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem("app-tour-complete");
    if (!hasSeenTour) setRun(true);
  }, []);

  const handleJoyrideCallback = (data: any) => {
    const { status } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];
    if (finishedStatuses.includes(status)) {
      localStorage.setItem("app-tour-complete", "true");
      setRun(false);
    }
  };
  return (
    <>
      <Joyride
        steps={steps}
        run={run}
        continuous
        showSkipButton
        showProgress
        spotlightClicks={true}
        callback={handleJoyrideCallback}
      />
    </>
  );
}
