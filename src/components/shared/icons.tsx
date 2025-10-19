import React from "react";
import { FaEnvelope, FaGithub, FaGlobe, FaMarkdown } from "react-icons/fa";import { FaLocationDot } from "react-icons/fa6";
import { TbFileAnalytics } from "react-icons/tb";
import { IoIosStats } from "react-icons/io";
import {
  MdAdd,
  MdClose,
  MdDelete,
  MdDragIndicator,
  MdEdit,
  MdOutlineFreeBreakfast,
  MdOutlineWorkOutline,
  MdPause,
  MdPlayArrow,
} from "react-icons/md";
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
  github: FaGithub,
  globe: FaGlobe,
  envelope: FaEnvelope,
  location: FaLocationDot,
  fileAnalytics: TbFileAnalytics,
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
