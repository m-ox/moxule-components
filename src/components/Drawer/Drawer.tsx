import { DialogSurface, type DialogSurfaceProps } from "../Dialog/DialogSurface";

export type DrawerSide = "left" | "right";

export interface DrawerProps extends Omit<DialogSurfaceProps, "presentation" | "side"> {
  side?: DrawerSide;
}

export function Drawer(props: DrawerProps) {
  return <DialogSurface {...props} presentation="drawer" />;
}
