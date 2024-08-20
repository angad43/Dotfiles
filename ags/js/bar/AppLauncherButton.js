export const AppLauncherButton = () =>
  Widget.Button({
    className: "app-l-button",
    onClicked: () => App.toggleWindow("app_launcher"),
    child: Widget.Icon({
      className: "icon",
      size:26,
      icon: "system-search-symbolic",
    }),
  });
