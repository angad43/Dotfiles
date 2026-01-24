import { Gtk } from "ags/gtk4"
import { createBinding } from "ags"
import { execAsync } from "ags/process"
import Network from "gi://AstalNetwork"
import Wp from "gi://AstalWp"
import Battery from "gi://AstalBattery"
import app from "ags/gtk4/app"

export function SystemStatus() {
    const network = Network.get_default()
    const wifi = network.get_wifi()
    const wired = network.get_wired()
    const bat = Battery.get_default()
    const wp = Wp.get_default()
    const speaker = wp?.audio.defaultSpeaker
    const getVolIcon = (v: number, m: boolean) => {
        if (m || v === 0) return "audio-volume-muted-symbolic"
        if (v < 0.33) return "audio-volume-low-symbolic"
        if (v < 0.67) return "audio-volume-medium-symbolic"
        return "audio-volume-high-symbolic"
    }
    return (
        <button
            class="system-status-pill"
            onClicked={() => {
                const win = app.get_window("quicksettings")
                if (win) win.visible = !win.visible
            }}
        >
            <Gtk.EventControllerScroll
                flags={Gtk.EventControllerScrollFlags.VERTICAL}
                onScroll={(_self, _dx, dy) => {
                    if (!speaker) return
                    const delta = dy < 0 ? 0.05 : -0.05
                    speaker.volume = Math.max(0, Math.min(1, speaker.volume + delta))
                }}
            />
            <box spacing={10}>
                {speaker && (
                    <box spacing={4}>
                        <image iconName={createBinding(speaker, "volume").as(v => getVolIcon(v, speaker.mute))} />
                    </box>
                )}
                <Gtk.Separator visible={true} orientation={Gtk.Orientation.VERTICAL} />
                <box>
                {wired && (
                    <image
                    iconName="network-wired-symbolic"
                    visible={createBinding(wired, "state").as(s => s === Network.DeviceState.ACTIVATED)}
                    />
                )}
                {wifi && (
                    <box
                    visible={createBinding(wifi, "state").as(s => s === Network.DeviceState.ACTIVATED)}
                    spacing={4}
                    >
                    <image iconName={createBinding(wifi, "iconName").as(String)} />
                    </box>
                )}
                </box>
                <Gtk.Separator visible={true} orientation={Gtk.Orientation.VERTICAL} />
                {bat && (
                    <box spacing={4} visible={createBinding(bat, "isPresent")}>
                    <image iconName={createBinding(bat, "batteryIconName").as(i => i || "battery-missing-symbolic")} />
                    <label label={createBinding(bat, "percentage").as(p => `${Math.floor(p * 100)}%`)} />
                    </box>
                )}
            </box>
        </button>
    )
}
