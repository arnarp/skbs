import * as React from "react";
import { cn } from "itils/dist/misc/cn";
import "./IconButton.css";
import { IconProps, MainColor } from "../../icons/IconProps";

type Props = {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  Icon: (props: IconProps) => JSX.Element;
  color: MainColor;
};

export const IconButton = React.forwardRef<HTMLButtonElement, Props>(
  ({ Icon, onClick, color }, ref) => {
    return (
      <button className={cn("IconButton", color)} ref={ref} onClick={onClick}>
        <Icon size="small" color={color} />
      </button>
    );
  }
);
