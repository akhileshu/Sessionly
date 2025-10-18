import { NotesPreview } from "./NotesPreview";
import { Pill } from "./pill";

interface TaskNotesSummaryProps {
  beforeNotes?: string | null;
  afterNotes?: string | null;
  hasTask: boolean;
}

export function TaskNotesSummary({
  beforeNotes,
  afterNotes,
  hasTask,
}: TaskNotesSummaryProps) {
  if (!hasTask)
    return <div className="text-sm text-gray-500">No running task</div>;

  return (
    <div className="border p-3 rounded space-y-3 text-sm">
      <Pill>Task notes</Pill>
      {beforeNotes ? (
        <div>
          <p className="font-medium text-gray-700 mb-1">Before Notes</p>
          <p className="text-gray-600">{beforeNotes}</p>
        </div>
      ) : (
        <p>No before notes</p>
      )}

      <hr />

      {afterNotes ? (
        <div>
          <p className="font-medium text-gray-700 mb-1">After Notes</p>
          <NotesPreview className="w-full" content={afterNotes} noPopup />
        </div>
      ) : (
        <p>No after notes</p>
      )}
    </div>
  );
}
