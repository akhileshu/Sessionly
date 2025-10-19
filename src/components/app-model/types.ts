type BaseModalProps = {
  trigger: string;
  className?: string;
  isOpenDefault?: boolean;
  onClose?: () => void;
};

// 🧩 Define type-specific props
type AddProjectAndCategoryProps = BaseModalProps & {
  type: "addProjectAndCategory";
};

type ViewSessionAnalyticsProps = BaseModalProps & {
  type: "viewSessionAnalytics";
  md: string;
  showMdCopyButton?: boolean;
};

type AddTaskCompletedNotesProps = BaseModalProps & {
  type: "AddTaskCompletedNotes";
  taskNotes: string;
  onSaveNotes: (val: string) => void;
  skipButton?: {
    text: string;
    onClick: () => void;
  };
};

// 🔐 Combine them into a discriminated union
export type AppModalProps =
  | AddProjectAndCategoryProps
  | ViewSessionAnalyticsProps
  | AddTaskCompletedNotesProps;
