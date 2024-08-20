import { Globals } from "./UserVar.js";

const PopupRevealer = (windowName, transition, child) =>
  Widget.Box({
    css: "padding: 1px;",
    children: [
      Widget.Revealer({
        transition,
        child,
        transition_duration: Globals.DESKTOP_SESSION === "river" ? 300 : 250,
      }).hook(App, (revealer, name, visible) => {
        if (name === windowName) revealer.reveal_child = visible;
      }),
    ],
  });

export default ({ name, transition_type, child, ...rest }) =>
  Widget.Window({
    name,
    child: Widget.Box({
      children: [PopupRevealer(name, transition_type, child)],
    }),
    visible: false,
    ...rest,
  });

