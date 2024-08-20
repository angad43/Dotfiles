import { PopupWindow } from "../PopupWindow.js";
import  notification  from "./notification.js";
import { Media } from "./Media.js";
export const WINDOW_NAME = "NotificationMenu";
const BottomBox = () =>
  Widget.Box({
    spacing: 12,
    vertical: true,
    children: [Media(),notification()],
  });

export const NotificationMenu = PopupWindow({
  name: "NotificationMenu",
  transition: "slide_up",
  transition_duration: 300,
  anchor: ["top" ,"right"],
  margins: [4],
 
  keymode: "on-demand",
  child: Widget.Box({
    className: "noti-box",
    spacing: 12,
    vertical: true,
    children: [BottomBox()],
  }),
});
