import app from "ags/gtk4/app"
import style from "./style.css"
import Applauncher from "./widget/launcher/Applauncher"
import Bar from "./widget/bar/Bar"
import GLib from "gi://GLib"
import Gtk from "gi://Gtk?version=4.0"
import NotificationPopups from "./widget/notifications/NotificationPopups"

let applauncher: Gtk.Window

app.start({
  css: style,
  gtkTheme: "Adwaita",
  requestHandler(request, res) {
    const [, argv] = GLib.shell_parse_argv(request)
    if (!argv) return res("argv parse error")

      switch (argv[0]) {
        case "toggle":
          applauncher.visible = !applauncher.visible
          return res("ok")
        default:
          return res("unknown command")
      }
  },
  main() {
    // Initialize Bar on all monitors
    app.get_monitors().map(Bar)
    NotificationPopups()
    // Initialize Applauncher
    applauncher = Applauncher() as Gtk.Window
    app.add_window(applauncher)
  },
})
