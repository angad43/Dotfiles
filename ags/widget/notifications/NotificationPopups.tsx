import app from "ags/gtk4/app"
import { Astal, Gtk } from "ags/gtk4"
import AstalNotifd from "gi://AstalNotifd"
import Notification from "./Notification"
import { createBinding, For, createState, onCleanup } from "ags"

export default function NotificationPopups() {
    const monitors = createBinding(app, "monitors")
    const notifd = AstalNotifd.get_default()

    const [notifications, setNotifications] = createState(
        new Array<AstalNotifd.Notification>(),
    )

    // Capture new notifications
    const notifiedHandler = notifd.connect("notified", (_, id) => {
        const n = notifd.get_notification(id)
        if (n) {
            // Add new to top, remove old duplicate if it exists
            setNotifications((ns) => [n, ...ns.filter((i) => i.id !== id)])
        }
    })

    // Remove from state when dismissed
    const resolvedHandler = notifd.connect("resolved", (_, id) => {
        setNotifications((ns) => ns.filter((n) => n.id !== id))
    })

    onCleanup(() => {
        notifd.disconnect(notifiedHandler)
        notifd.disconnect(resolvedHandler)
    })

    return (
        <For each={monitors}>
        {(monitor) => {
            // Fix: monitor.get_connector() is the correct method in GTK4
            const monitorName = monitor.get_connector() || "default"

            return (
                <window
                name={`notifications-${monitorName}`}
                $={(self) => onCleanup(() => self.destroy())}
                class="NotificationWindow"
                gdkmonitor={monitor}
                visible={notifications((ns) => ns.length > 0)}
                exclusivity={Astal.Exclusivity.NONE}
                anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
                >
                <box orientation={Gtk.Orientation.VERTICAL} class="popup-container">
                <For each={notifications}>
                {(n) => <Notification key={n.id} notification={n} />}
                </For>
                </box>
                </window>
            )
        }}
        </For>
    )
}
