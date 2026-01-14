import app from "ags/gtk4/app"
import { Astal, Gtk, Gdk } from "ags/gtk4"
import { Clock } from "./items/clock"
import { Workspaces } from "./items/workspace"
import { SystemStatus } from "./items/status"

export default function Bar(gdkmonitor: Gdk.Monitor) {
  const { TOP, LEFT, RIGHT } = Astal.WindowAnchor

  const toggleLauncher = () => {
    const win = app.get_window("launcher")
    if (win) win.visible = !win.visible
  }

  return (
    <window
    visible
    name={`bar-${gdkmonitor.get_model()}`}
    class="Bar"
    gdkmonitor={gdkmonitor}
    exclusivity={Astal.Exclusivity.EXCLUSIVE}
    anchor={TOP | LEFT | RIGHT}
    application={app}
    >
    <centerbox cssName="centerbox">
    <box $type="start">
    {/* Launcher Toggle Button */}
    <button
    class="launcher-button"
    onClicked={toggleLauncher}
    >
    <label label="󰣇" />
    </button>

    <Workspaces gdkmonitor={gdkmonitor} />
    </box>

    <box $type="center">
    <Clock />
    </box>
    <box $type="end">
    <SystemStatus />
    </box>
    </centerbox>
    </window>
  )
}
