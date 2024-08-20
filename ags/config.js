import { Bar } from "./js/bar/Bar.js";
import NotificationPopupWindow from "./js/notifs/PopupWindow.js";
import { controlpanel } from "./js/control-panel/ControlPanel.js";
import { forMonitors } from "./js/utils.js";
import { applauncher } from "./js/app-launcher/AppLauncher.js";
import { NotificationMenu } from "./js/notification/NotificationMenu.js";
import OSD from "./js/Osd/OSD.js";


App.config({
    style: "./css/style.css",
  closeWindowDelay: {
    control_panel: 300,
    app_launcher: 300,
  },
  windows: [
    ...forMonitors(Bar),
  NotificationPopupWindow(),
    controlpanel,
    OSD(),
    NotificationMenu,
    applauncher,
  ],
});
