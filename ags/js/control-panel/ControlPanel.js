import { PowerBox } from "./PowerBox.js";
import { Speaker} from "./Sliders.js";
import { Calendar } from "./Calendar.js";
import { DND } from "./DND.js";
import { PopupWindow } from "../PopupWindow.js";
import { Row } from "./ToggleButton.js";
import { WifiSelection, NetworkToggle } from "./wifi.js";
import { ProfileSelector, ProfileToggle } from "./PowerProfile.js";
import { BluetoothDevices, BluetoothToggle } from "./bluetooth.js";
import Brightness from "./Brightness.js";

const MiddleBox = () =>
  Widget.Box({
    spacing: 12,
    vertical: true,
    children: [ 
       Row([NetworkToggle, BluetoothToggle], [WifiSelection, BluetoothDevices]),
       Row([ProfileToggle,DND],[ProfileSelector]),
       Row([Speaker],[Brightness]),
 ],
  });

const BottomBox = () =>
  Widget.Box({
    spacing: 12,
    vertical: true,
    children: [Calendar()],
  });

export const controlpanel = PopupWindow({
  name: "control_panel",
  transition: "slide_up",
  transition_duration: 300,
  anchor: ["top" ,"right"],
  margins: [4],
  keymode: "on-demand",
  child: Widget.Box({
    className: "control-box",
    spacing: 12,
    vertical: true,
    children: [ MiddleBox(), BottomBox()],
  }),
});
