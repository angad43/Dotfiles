import Niri from "gi://AstalNiri";
import { Astal, Gtk } from "ags/gtk4"
import { For, createBinding } from "ags";

export function Workspaces() {
    const niri = Niri.get_default();

    // 1. Create a reactive binding for the workspace list
    const workspaces = createBinding(niri, "workspaces").as(ws =>
    [...ws]
    .sort((a, b) => a.id - b.id)
    .slice(0, 11)
    );

    // 2. Create a reactive binding for the focused ID
    const focusedId = createBinding(niri, "focusedWorkspace").as(fws => fws?.id);

    return (
        <box class="workspaces-pill-container" valign={Gtk.Align.CENTER}>
        <box class="workspaces-list" spacing={5}>
        <For each={workspaces}>
        {(w) => (
            <button
            onClicked={() => {
                // Using the built-in focus method is more reliable than execAsync
                w.focus()
            }}
            // Use 'cssClasses' binding to reactively update the class list
            cssClasses={focusedId.as(id =>
                id === w.id ? ["workspace-dot", "active"] : ["workspace-dot"]
            )}
            valign={Gtk.Align.CENTER}
            halign={Gtk.Align.CENTER}
            />
        )}
        </For>
        </box>
        </box>
    );
}
