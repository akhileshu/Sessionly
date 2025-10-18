import React from "react";
import {
  MdAdd,
  MdClose,
  MdDelete,
  MdEdit,
  MdOutlineFreeBreakfast,
  MdOutlineWorkOutline,
  MdPause,
  MdPlayArrow,
} from "react-icons/md";

export type IconName =
  | "delete"
  | "edit"
  | "add"
  | "close"
  | "MdOutlineFreeBreakfast"
  | "MdOutlineWorkOutline"
  | "MdPlayArrow"
  | "MdPause";

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
  const renderIcon = () => {
    switch (name) {
      case "delete":
        return <MdDelete size={size} color={color} />;
      case "edit":
        return <MdEdit size={size} color={color} />;
      case "add":
        return <MdAdd size={size} color={color} />;
      case "close":
        return <MdClose size={size} color={color} />;
      case "MdOutlineFreeBreakfast":
        return <MdOutlineFreeBreakfast size={size} color={color} />;
      case "MdOutlineWorkOutline":
        return <MdOutlineWorkOutline size={size} color={color} />;
      case "MdPause":
        return <MdPause size={size} color={color} />;
      case "MdPlayArrow":
        return <MdPlayArrow size={size} color={color} />;
      default:
        return null;
    }
  };

  return (
    <span
      title={withTooltip ? title ?? name : undefined}
      {...rest}
      style={{ display: "inline-flex", alignItems: "center" }}
    >
      {renderIcon()}
    </span>
  );
}
