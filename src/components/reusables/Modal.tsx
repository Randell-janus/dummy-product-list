import { Dialog, DialogBody } from "@material-tailwind/react";
import { useState, ReactNode } from "react";

type ModalProps = {
  children: ReactNode;
  buttonTrigger: ReactNode;
};

export default function Modal({ children, buttonTrigger }: ModalProps) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(!open);

  return (
    <>
      <div className="cursor-pointer" onClick={handleOpen}>
        {buttonTrigger}
      </div>
      <Dialog open={open} handler={handleOpen} size="lg">
        <DialogBody className="p-8">
          {children}
          <button onClick={handleOpen} className="absolute top-4 right-4">
            <span className="material-symbols-outlined font-bold">close</span>
          </button>
        </DialogBody>
      </Dialog>
    </>
  );
}
