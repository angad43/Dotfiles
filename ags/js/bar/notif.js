export const NotiButton = () =>
  Widget.Button({
    className: "noti-button",
    onClicked: () => App.toggleWindow("NotificationMenu"),
    child: Widget.Icon({
      className: "icon",
      icon: "notification",
      size:26,
    }),
  });
