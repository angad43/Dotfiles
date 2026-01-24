import app from "ags/gtk4/app"
import { Astal, Gtk, Gdk } from "ags/gtk4"
import { createBinding, For, createState } from "ags"
import Pango from "gi://Pango?version=1.0"
import GLib from "gi://GLib"
import Network from "gi://AstalNetwork"
import Bluetooth from "gi://AstalBluetooth"
import PowerProfiles from "gi://AstalPowerProfiles"
import Wp from "gi://AstalWp"
import Notifd from "gi://AstalNotifd"
import Brightness from "../../services/Brightness"
import Graphene from "gi://Graphene"

export default function QuickSettings() {
    const network = Network.get_default()
    const wifi = network.get_wifi()
    const bt = Bluetooth.get_default()
    const pp = PowerProfiles.get_default()
    const speaker = Wp.get_default()?.audio.defaultSpeaker
    const brightness = Brightness.get_default()
    const notifd = Notifd.get_default()

    const notifications = createBinding(notifd, "notifications")
    const [nightLight, setNightLight] = createState(false)

    let win: Astal.Window
    let contentbox: Gtk.Box

    const getVolIcon = (v: number, m: boolean) => {
        if (m || v === 0) return "audio-volume-muted-symbolic"
            if (v < 0.33) return "audio-volume-low-symbolic"
                if (v < 0.67) return "audio-volume-medium-symbolic"
                    return "audio-volume-high-symbolic"
    }

    function onKey(_e: Gtk.EventControllerKey, keyval: number) {
        if (keyval === Gdk.KEY_Escape) win.visible = false
    }

    function onClickOutside(_e: Gtk.GestureClick, _: number, x: number, y: number) {
        const [, rect] = contentbox.compute_bounds(win)
        const position = new Graphene.Point({ x, y })
        if (!rect.contains_point(position)) win.visible = false
    }

    const QSToggle = ({ icon, label, active, onClick }: any) => (
        <box
        orientation={Gtk.Orientation.VERTICAL}
        spacing={8}
        halign={Gtk.Align.CENTER}
        css="min-width: 72px;"
        >
        <button
        onClicked={onClick}
        halign={Gtk.Align.CENTER}
        class={active.as
            ? active.as((a: boolean) => a ? "qs-square-button active" : "qs-square-button")
            : active((a: boolean) => a ? "qs-square-button active" : "qs-square-button")
        }
        >
        <image
        iconName={icon}
        pixelSize={24}
        halign={Gtk.Align.CENTER}
        valign={Gtk.Align.CENTER}
        />
        </button>
        <label
        label={label}
        class="qs-label-external"
        halign={Gtk.Align.CENTER}
        css="font-size: 12px; font-weight: 500; margin-top: 2px;"
        />
        </box>
    )

    return (
        <window
        $={(ref) => (win = ref)}
        name="quicksettings"
        anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.LEFT | Astal.WindowAnchor.RIGHT}
        visible={false}
        application={app}
        class="window-quicksettings"
        keymode={Astal.Keymode.ON_DEMAND}
        exclusivity={Astal.Exclusivity.IGNORE}
        >
        <Gtk.EventControllerKey onKeyPressed={onKey} />
        <Gtk.GestureClick onPressed={onClickOutside} />

        <box halign={Gtk.Align.END} valign={Gtk.Align.START}>
        <box
        $={(ref) => (contentbox = ref)}
        class="quicksettings-content"
        orientation={Gtk.Orientation.VERTICAL}
        spacing={24}
        css="min-width: 380px; padding: 24px;"
        >
        <box spacing={12} halign={Gtk.Align.CENTER} homogeneous={true}>
        {wifi && (
            <QSToggle
            icon={createBinding(wifi, "iconName").as(String)}
            label="Wi-Fi"
            active={createBinding(wifi, "enabled")}
            onClick={() => wifi.enabled = !wifi.enabled}
            />
        )}
        <QSToggle
        icon={createBinding(bt, "isPowered").as(p => p ? "bluetooth-active-symbolic" : "bluetooth-disabled-symbolic")}
        label="Bluetooth"
        active={createBinding(bt, "isPowered")}
        onClick={() => {
            if (bt.adapter) {
                bt.adapter.powered = !bt.adapter.powered
            } else {
                console.warn("No bluetooth adapter found")
            }
        }}
        />
        <QSToggle
        icon="battery-level-10-charging-symbolic"
        label="Saver"
        active={createBinding(pp, "active_profile").as(p => p === "power-saver")}
        onClick={() => {
            pp.active_profile = pp.active_profile === "power-saver" ? "balanced" : "power-saver"
        }}
        />
        <QSToggle
        icon="night-light-symbolic"
        label="Night"
        active={nightLight}
        onClick={() => {
            const newState = !nightLight.get()
            setNightLight(newState)
            try {
                if (newState) {
                    GLib.spawn_command_line_async("wlsunset -t 4500 -T 6500")
                } else {
                    GLib.spawn_command_line_async("pkill wlsunset")
                }
            } catch (e) {
                console.error("wlsunset error:", e)
            }
        }}
        />
        </box>
        <box orientation={Gtk.Orientation.VERTICAL} spacing={16} class="sliders-container">
        {speaker && (
            <box spacing={12}>
            <image
            iconName={createBinding(speaker, "volume").as(v => getVolIcon(v, speaker.mute))}
            css="min-width: 24px;"
            />
            <slider
            class="qs-slider"
            hexpand
            onNotifyValue={({ value }) => speaker.volume = value}
            value={createBinding(speaker, "volume")}
            />
            <label
            css="min-width: 40px;"
            label={createBinding(speaker, "volume").as(v => `${Math.round(v * 100)}%`)}
            />
            </box>
        )}
        <box spacing={12}>
        <image iconName="display-brightness" css="min-width: 24px;" />
        <slider
        class="qs-slider"
        hexpand
        onNotifyValue={({ value }) => brightness.screen = value}
        value={createBinding(brightness, "screen")}
        />
        <label
        css="min-width: 40px;"
        label={createBinding(brightness, "screen").as(v => `${Math.round(v * 100)}%`)}
        />
        </box>
        </box>
        <box class="qs-separator" css="min-height: 1px; background: rgba(255,255,255,0.1);" />
        <box orientation={Gtk.Orientation.VERTICAL} spacing={12} vexpand class="notification-history">
        <box spacing={10}>
        <label label="Notifications" hexpand halign={Gtk.Align.START} css="font-weight: bold; font-size: 1.2em;" />
        <button
        class="notif-clear-all" label="Clear All"
        onClicked={() => notifd.get_notifications().forEach(n => n.dismiss())}
        visible={notifications.as(n => n.length > 0)}
        />
        </box>

        <scrolledwindow vexpand minContentHeight={300} hscrollbarPolicy={Gtk.PolicyType.NEVER}>
        <stack visibleChildName={notifications.as(n => n.length > 0 ? "list" : "empty")}>
        <box name="list" orientation={Gtk.Orientation.VERTICAL} spacing={8}>
        <For each={notifications}>
        {(n) => (
            <box class="notif-card" spacing={12} css="padding: 8px; border-radius: 8px;">
            {n.appIcon && <image iconName={n.appIcon} pixelSize={24} valign={Gtk.Align.START} />}
            <box orientation={Gtk.Orientation.VERTICAL} hexpand>
            <label class="summary" label={n.summary} halign={Gtk.Align.START} ellipsize={Pango.EllipsizeMode.END} css="font-weight: bold;" />
            <label class="body" label={n.body} halign={Gtk.Align.START} wrap lines={2} ellipsize={Pango.EllipsizeMode.END} />
            </box>
            <button class="notif-close-btn" onClicked={() => n.dismiss()} valign={Gtk.Align.START}>
            <image iconName="window-close-symbolic" />
            </button>
            </box>
        )}
        </For>
        </box>
        <box name="empty" orientation={Gtk.Orientation.VERTICAL} halign={Gtk.Align.CENTER} valign={Gtk.Align.CENTER} css="padding: 40px;">
        <label label="No Notifications" css="opacity: 0.4;" />
        </box>
        </stack>
        </scrolledwindow>
        </box>
        </box>
        </box>
        </window>
    )
}
