import Gtk from "gi://Gtk?version=4.0"
import Gdk from "gi://Gdk?version=4.0"
import Adw from "gi://Adw"
import GLib from "gi://GLib"
import AstalNotifd from "gi://AstalNotifd"
import Pango from "gi://Pango"
import { createState, onMount } from "ags"

const isIcon = (icon?: string | null) => {
    const iconTheme = Gtk.IconTheme.get_for_display(Gdk.Display.get_default()!)
    return icon && iconTheme.has_icon(icon)
}

const fileExists = (path: string) => GLib.file_test(path, GLib.FileTest.EXISTS)

const time = (t: number, format = "%H:%M") =>
GLib.DateTime.new_from_unix_local(t).format(format)!

const urgency = (n: AstalNotifd.Notification) => {
    const { LOW, CRITICAL } = AstalNotifd.Urgency
    if (n.urgency === LOW) return "low"
        if (n.urgency === CRITICAL) return "critical"
            return "normal"
}

export default function Notification({ notification: n }: { notification: AstalNotifd.Notification }) {
    const [revealed, setRevealed] = createState(false)

    // Helper to animate out before destroying
    const dismiss = () => {
        setRevealed(false)
        GLib.timeout_add(GLib.PRIORITY_DEFAULT, 300, () => {
            n.dismiss()
            return GLib.SOURCE_REMOVE
        })
    }

    onMount(() => {
        // Slide in
        GLib.timeout_add(GLib.PRIORITY_DEFAULT, 10, () => {
            setRevealed(true)
            return GLib.SOURCE_REMOVE
        })

        // Auto-dismiss based on timeout
        const duration = n.expire_timeout > 0 ? n.expire_timeout : 5000
        if (duration > 0) {
            GLib.timeout_add(GLib.PRIORITY_DEFAULT, duration, () => {
                dismiss()
                return GLib.SOURCE_REMOVE
            })
        }
    })

    return (
        <revealer
        revealChild={revealed}
        transitionType={Gtk.RevealerTransitionType.SLIDE_LEFT}
        transitionDuration={300}>
        <Adw.Clamp maximumSize={400}>
        <box orientation={Gtk.Orientation.VERTICAL} class={`Notification ${urgency(n)}`}>
        <box class="header" spacing={8}>
        {(n.appIcon || isIcon(n.desktopEntry)) && (
            <image
            class="app-icon"
            iconName={n.appIcon || n.desktopEntry}
            />
        )}
        <label
        class="app-name"
        halign={Gtk.Align.START}
        ellipsize={Pango.EllipsizeMode.END}
        label={n.appName || "Unknown"}
        />
        <label
        class="time"
        hexpand
        halign={Gtk.Align.END}
        label={time(n.time)}
        />
        <button class="close-button" onClicked={dismiss}>
        <image iconName="window-close-symbolic" />
        </button>
        </box>

        <Gtk.Separator visible />

        <box class="content" spacing={12}>
        {n.image && fileExists(n.image) && (
            <image valign={Gtk.Align.START} class="image" file={n.image} />
        )}
        <box orientation={Gtk.Orientation.VERTICAL} hexpand>
        <label
        class="summary"
        halign={Gtk.Align.START}
        xalign={0}
        label={n.summary}
        ellipsize={Pango.EllipsizeMode.END}
        css="font-weight: bold;"
        />
        {n.body && (
            <label
            class="body"
            wrap
            useMarkup
            halign={Gtk.Align.START}
            xalign={0}
            label={n.body}
            />
        )}
        </box>
        </box>

        {n.actions.length > 0 && (
            <box class="actions" spacing={5}>
            {n.actions.map(({ label, id }) => (
                <button hexpand onClicked={() => n.invoke(id)}>
                <label label={label} />
                </button>
            ))}
            </box>
        )}
        </box>
        </Adw.Clamp>
        </revealer>
    )
}
