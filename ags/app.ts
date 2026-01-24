import app from "ags/gtk4/app"
import style from "./style.css"
import Applauncher from "./widget/launcher/Applauncher"
import PowerMenu from "./widget/powermenu/PowerMenu"
import Bar from "./widget/bar/Bar"
import QuickSettings from "./widget/quicksettings/QuickSettings"
import GLib from "gi://GLib"
import Gtk from "gi://Gtk?version=4.0"
import NotificationPopups from "./widget/notifications/NotificationPopups"
import MediaPlayer from "./widget/mediaplayer/MediaPlayer"
import VolumeOSD from "./widget/osd/VolumeOSD"
import BrightnessOSD from "./widget/osd/BrightnessOSD"

let applauncher: Gtk.Window
let powermenu: Gtk.Window
let mediaplayer: Gtk.Window
app.start({
  css: style,
  main() {
    app.get_monitors().map(Bar)
    NotificationPopups()
    mediaplayer = MediaPlayer() as Gtk.Window
    app.add_window(mediaplayer)
    VolumeOSD()
    BrightnessOSD()
    powermenu = PowerMenu() as Gtk.Window
    app.add_window(powermenu)

    applauncher = Applauncher() as Gtk.Window
    app.add_window(applauncher)

    app.add_window(QuickSettings() as Gtk.Window)
  },
})
