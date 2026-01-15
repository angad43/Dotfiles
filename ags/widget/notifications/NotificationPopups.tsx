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

    const notifiedHandler = notifd.connect("notified", (_, id) => {
        const notification = notifd.get_notification(id)
        if (!notification) return

            setNotifications((ns) => [notification, ...ns.filter((n) => n.id !== id)])

            const duration = notification.expire_timeout > 0
            ? notification.expire_timeout
            : 5000

            if (duration > 0) {
                setTimeout(() => {
                    setNotifications((ns) => ns.filter((n) => n.id !== id))
                }, duration)
            }
    })

    const resolvedHandler = notifd.connect("resolved", (_, id) => {
        setNotifications((ns) => ns.filter((n) => n.id !== id))
    })

    onCleanup(() => {
        notifd.disconnect(notifiedHandler)
        notifd.disconnect(resolvedHandler)
    })

    return (
        <For each={monitors}>
        {(monitor) => (
            <window
            // REMOVED: key={...} property was causing the Gjs-CRITICAL error
            $={(self) => onCleanup(() => self.destroy())}
            class="NotificationPopups"
            gdkmonitor={monitor}
            visible={notifications((ns) => ns.length > 0)}
            anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
            >
            <box orientation={Gtk.Orientation.VERTICAL}>
            <For each={notifications}>
            {(notification) => (
                <Notification
                key={notification.id} // Key is still needed here for list items
                notification={notification}
                />
            )}
            </For>
            </box>
            </window>
        )}
        </For>
    )
}
