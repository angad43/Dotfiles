import app from "ags/gtk4/app"
import { Astal, Gtk } from "ags/gtk4"
import { exec } from "ags/process"

export default function PowerMenu() {
    const { TOP, RIGHT } = Astal.WindowAnchor

    const close = () => {
        const win = app.get_window("powermenu")
        if (win) win.visible = false
    }

    const MenuButton = (label: string, icon: string, command: string) => (
        <button
        class="menu-item"
        onClicked={() => {
            // This is the part that actually runs the command
            try {
                exec(command)
            } catch (err) {
                console.error(`Failed to execute ${command}:`, err)
            }
            close()
        }}>
        <box spacing={12} halign={Gtk.Align.START}>
        <label class="menu-icon" label={icon} />
        <label class="menu-text" label={label} />
        </box>
        </button>
    )

    return (
        <window
        name="powermenu"
        class="PowerMenuDropdown"
        visible={false}
        anchor={TOP | RIGHT}
        marginTop={10}
        marginRight={10}
        exclusivity={Astal.Exclusivity.NORMAL}
        keymode={Astal.Keymode.ON_DEMAND}
        application={app}>

        <box orientation={Gtk.Orientation.VERTICAL} class="menu-container">
        {MenuButton("Lock", "󰌾", "swaylock")}
        {MenuButton("Logout", "󰍃", "niri msg action quit")}
        {MenuButton("Sleep", "󰒲", "systemctl suspend")}
        {MenuButton("Reboot", "󰑐", "systemctl reboot")}
        {MenuButton("Shutdown", "󰐥", "systemctl poweroff")}
        </box>
        </window>
    )
}
