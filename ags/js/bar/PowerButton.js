export const PowerButton = () =>
  Widget.Button({
    className: "power-button",
    on_primary_click: () => Utils.execAsync(["pkill", "wlogout"])
            .catch(() => Utils.execAsync(["wlogout"]))
            .catch(() => undefined),
    child: Widget.Icon({
      className: "icon",
      icon: "system-shutdown-symbolic",
      size:20,
    }),
  });
