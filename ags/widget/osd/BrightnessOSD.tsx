import { Astal, Gtk } from "ags/gtk4"
import { createBinding } from "ags"
import GLib from "gi://GLib"
import Brightness from "../../services/Brightness"

export default function BrightnessOSD() {
    const brightness = Brightness.get_default()
    let win: Astal.Window
    let count = 0
    brightness.connect("notify::screen", () => {
        if (!win) return
            win.visible = true
            count++
            GLib.timeout_add(GLib.PRIORITY_DEFAULT, 3000, () => {
                count--
                if (count === 0 && win) {
                    win.visible = false
                }
                return GLib.SOURCE_REMOVE
            })
    })
    return (
        <window
        $={(ref) => (win = ref)}
        name="brightness-osd"
        class="OSD"
        namespace="brightness-osd"
        visible={false}
        anchor={Astal.WindowAnchor.BOTTOM}
        marginBottom={100}
        exclusivity={Astal.Exclusivity.IGNORE}
        >
        <box class="osd-container" spacing={16}>
        <image iconName="display-brightness-symbolic" />
        <box orientation={Gtk.Orientation.VERTICAL} valign={Gtk.Align.CENTER}>
        <slider
        class="osd-slider"
        value={createBinding(brightness, "screen")}
        />
        </box>
        <label
        class="osd-label"
        label={createBinding(brightness, "screen").as(v => `${Math.round(v * 100)}%`)}
        />
        </box>
        </window>
    )
}
