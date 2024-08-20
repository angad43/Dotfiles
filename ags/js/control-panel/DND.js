import { SimpleToggleButton } from "./ToggleButton.js"
const n = await Service.import("notifications");
const dnd = n.bind("dnd");

export function DND() {
  return SimpleToggleButton({
    icon: dnd.as(function(dnd) {
      return dnd ? "notifications-disabled-symbolic" : "org.gnome.Settings-notifications-symbolic";
    }),
    label: dnd.as(function(dnd) {
      return dnd ? "Silent" : "Noisy";
    }),
    toggle: function() {
      n.dnd = !n.dnd;
    },
    connection: [n, function() {
      return n.dnd;
    }],
  });
}

