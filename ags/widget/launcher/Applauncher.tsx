import { For, createState } from "ags"
import { Astal, Gtk, Gdk } from "ags/gtk4"
import AstalApps from "gi://AstalApps"
import Graphene from "gi://Graphene"

const { TOP, BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor
export default function Applauncher() {
    let contentbox: Gtk.Box
    let searchentry: Gtk.Entry
    let win: Astal.Window
    const apps = new AstalApps.Apps()
    const [searchText, setSearchText] = createState("")

    const filteredList = searchText((text) => {
        if (text === "") {
            return apps.get_list().slice(0, 50)
        }
        return apps.fuzzy_query(text).slice(0, 20)
    })
    function launch(app?: AstalApps.Application) {
        if (app) {
            win.hide()
            app.launch()
        }
    }
    function onKey(_e: Gtk.EventControllerKey, keyval: number, _: number, mod: number) {
        if (keyval === Gdk.KEY_Escape) {
            win.visible = false
            return
        }
        if (keyval === Gdk.KEY_Return || keyval === Gdk.KEY_KP_Enter) {
            const first = filteredList.get()[0]
            if (first) launch(first)
                return
        }
    }
    function onClick(_e: Gtk.GestureClick, _: number, x: number, y: number) {
        const [, rect] = contentbox.compute_bounds(win)
        const position = new Graphene.Point({ x, y })
        if (!rect.contains_point(position)) {
            win.visible = false
        }
    }
    return (
        <window
        $={(ref) => (win = ref)}
        name="launcher"
        anchor={TOP | BOTTOM | LEFT | RIGHT}
        exclusivity={Astal.Exclusivity.IGNORE}
        keymode={Astal.Keymode.EXCLUSIVE}
        onNotifyVisible={({ visible }) => {
            if (visible) {
                searchentry.grab_focus()
            } else {
                setSearchText("")
                searchentry.set_text("")
            }
        }}
        >
        <Gtk.EventControllerKey onKeyPressed={onKey} />
        <Gtk.GestureClick onPressed={onClick} />
        <box
        $={(ref) => (contentbox = ref)}
        class="launcher-content"
        valign={Gtk.Align.CENTER}
        halign={Gtk.Align.CENTER}
        orientation={Gtk.Orientation.VERTICAL}
        >
        <scrolledwindow
        class="launcher-scroll"
        hscrollbarPolicy={Gtk.PolicyType.NEVER}
        vscrollbarPolicy={Gtk.PolicyType.AUTOMATIC}
        minContentHeight={450}
        minContentWidth={400}
        >
        <box orientation={Gtk.Orientation.VERTICAL}>
        <For each={filteredList}>
        {(app) => (
            <button class="app-item" onClicked={() => launch(app)}>
            <box spacing={10}>
            <image iconName={app.iconName} pixelSize={32} />
            <label label={app.name} />
            </box>
            </button>
        )}
        </For>
        </box>
        </scrolledwindow>
        <entry
        $={(ref) => (searchentry = ref)}
        class="launcher-search"
        onNotifyText={({ text }) => setSearchText(text)}
        placeholderText="Search Apps..."
        />
        </box>
        </window>
    )
}
