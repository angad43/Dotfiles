import GLib from "gi://GLib?version=2.0"

export const Globals = {
  CurrentUser: GLib.getenv("USER"),
  HOME: GLib.getenv("HOME"),
  DESKTOP_SESSION: GLib.getenv("DESKTOP_SESSION"),
  MASTER_TRANSITION_DURATION: 300,
};

