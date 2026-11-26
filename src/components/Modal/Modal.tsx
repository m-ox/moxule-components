import { DialogSurface, type DialogSurfaceProps } from "../Dialog/DialogSurface";

export type ModalSize = "sm" | "md" | "lg";

export interface ModalProps extends Omit<DialogSurfaceProps, "presentation" | "side"> {
  size?: ModalSize;
}

export function Modal({ size = "md", ...props }: ModalProps) {
  return <DialogSurface {...props} presentation="modal" data-mx-size={size} />;
}
