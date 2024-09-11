import {
  Popover,
  PopoverHandler,
  PopoverContent,
} from "@material-tailwind/react";
import { ReactNode } from "react";

type MenuProps = {
  buttonTrigger: ReactNode;
  children: ReactNode;
};

export default function Menu({ buttonTrigger, children }: MenuProps) {
  return (
    <Popover placement="bottom-end">
      <PopoverHandler>{buttonTrigger}</PopoverHandler>
      <PopoverContent className="shadow-xl max-h-[500px] overflow-y-auto">
        {children}
      </PopoverContent>
    </Popover>
  );
}
