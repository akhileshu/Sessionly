import React from "react";
import { IoIosStats } from "react-icons/io";
import {
  MdAdd,
  MdClose,
  MdDelete,
  MdEdit,
  MdOutlineFreeBreakfast,
  MdOutlineWorkOutline,
  MdPause,
  MdPlayArrow,
  MdDragIndicator,
} from "react-icons/md";
import { FaMarkdown } from "react-icons/fa";
const icons = {
  delete: MdDelete,
  edit: MdEdit,
  add: MdAdd,
  close: MdClose,
  breakfast: MdOutlineFreeBreakfast,
  work: MdOutlineWorkOutline,
  pause: MdPause,
  play: MdPlayArrow,
  stats: IoIosStats,
  drag: MdDragIndicator,
  markdown: FaMarkdown,
};

export type IconName = keyof typeof icons;

interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: IconName;
  size?: number;
  color?: string;
  withTooltip?: boolean;
}

export function Icon({
  name,
  size = 20,
  color = "currentColor",
  title,
  withTooltip = true,
  ...rest
}: IconProps) {
  const IconComponent = icons[name];
  if (!IconComponent) return null;

  return (
    <span
      title={withTooltip ? title ?? name : undefined}
      {...rest}
      style={{ display: "inline-flex", alignItems: "center" }}
    >
      <IconComponent size={size} color={color} />
    </span>
  );
}
