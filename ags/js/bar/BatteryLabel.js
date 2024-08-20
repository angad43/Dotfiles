const battery = await Service.import("battery");

export const BatteryLabel = () => {
  return Widget.Box({
    className: battery
      .bind("charging")
      .as((ch) => (ch ? "battery-label charging" : "battery-label")),
    visible: battery.bind("available"),
    children: [
      Widget.Icon({
        className: "battery-icon",
        size: 26,
        hexpand: false,
        icon: battery.bind("percent", "charging").as((p, ch) => {
          if (battery.charging) {
            return "battery-full-charging-symbolic";
          } else if (p >= 80) {
            return "battery-full-symbolic";
          } else if (p >= 50) {
            return "battery-good-symbolic";
          } else if (p >= 20) {
            return "battery-low-symbolic";
          } else {
            return "battery-empty-symbolic";
          }
        }),
      }),
      Widget.Label({
        label: battery.bind("percent").as((p) => `${p}%`),
      }),
    ],
  });
};

