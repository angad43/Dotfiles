const systemTray = await Service.import("systemtray");

const tray = () =>
  Widget.Box({
    className: "tray",
    spacing: 4,
    children: systemTray.bind("items").as((items) => {
      return items.map((item) =>
        Widget.Button({
          child: Widget.Icon({ icon: item.bind("icon"),size: 20  }),
          tooltip_markup: item.bind("tooltip_markup"),
          on_primary_click: (_, event) => item.activate(event),
          on_secondary_click: (_, event) => item.openMenu(event),
        }),
      );
    }),
  });

export const SysTray = () => {
  return Widget.Box({
    spacing: 8,
    children: [tray()],
  });
};

