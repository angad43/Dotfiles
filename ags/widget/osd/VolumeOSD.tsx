import { Astal, Gtk } from "ags/gtk4"
import { createBinding } from "ags"
import Wp from "gi://AstalWp"
import GLib from "gi://GLib"

export default function VolumeOSD() {
    const speaker = Wp.get_default()?.audio.defaultSpeaker
    if (!speaker) return <box />
        let win: Astal.Window
        let count = 0
        speaker.connect("notify::volume", () => {
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
            name="volume-osd"
            class="OSD"
            namespace="volume-osd"
            visible={false}
            anchor={Astal.WindowAnchor.BOTTOM}
            marginBottom={100}
            exclusivity={Astal.Exclusivity.IGNORE}
            >
            <box class="osd-container" spacing={16}>
            <image
            iconName={createBinding(speaker, "volume").as(v => {
                if (speaker.mute) return "audio-volume-muted-symbolic"
                    if (v < 0.33) return "audio-volume-low-symbolic"
                        if (v < 0.67) return "audio-volume-medium-symbolic"
                            return "audio-volume-high-symbolic"
            })}
            />
            <box orientation={Gtk.Orientation.VERTICAL} valign={Gtk.Align.CENTER}>
            <slider
            class="osd-slider"
            value={createBinding(speaker, "volume")}
            />
            </box>
            <label
            class="osd-label"
            label={createBinding(speaker, "volume").as(v => `${Math.round(v * 100)}%`)}
            />
            </box>
            </window>
        )
}
