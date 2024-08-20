import GLib from "gi://GLib?version=2.0";
import PopupWindow from "./PopUpWindow.js";
import { speakerIcon, microphoneIcon } from "../Variables.js";
const audio = await Service.import("audio");
import { Speaker} from "../control-panel/Sliders.js";
import Brightness from "../control-panel/Brightness.js";
import brightness from "../../services/brightness.js";
const TIMEOUT_DESPAWN = 1000;
const WINDOW_NAME = "OSD";

const osd_types = {
  volume: 0,
  brightness: 1,
};

export default function OSD() {
  const SwitchOSD = Widget.Stack({
    children: {
      child1: Speaker(),
      child2: Brightness(),
      child_default: Widget.Label("Something went wrong!"),
    },
    shown: "child1",
  }).hook(audio.speaker, TriggerOSD(osd_types.volume), "notify::volume")
  .hook(brightness, TriggerOSD(osd_types.brightness), "notify::screen"); 

  let hideTimeoutId = null;

 function showOSDChild(type) {
  if (type === osd_types.volume) {
    SwitchOSD.shown = "child1";
  } else if (type === osd_types.brightness) { // Add this condition
    SwitchOSD.shown = "child2";
  } else {
    SwitchOSD.shown = "child_default";
  }
}

  function handleTimeout() {
    if (hideTimeoutId !== null) {
      GLib.source_remove(hideTimeoutId);
    }
    hideTimeoutId = Utils.timeout(TIMEOUT_DESPAWN, () => {
      window.visible = false;
    });
  }

  function TriggerOSD(type) {
    return () => {
      showOSDChild(type);
      window.visible = true;
      handleTimeout();
    };
  }

  const window = PopupWindow({
    name: WINDOW_NAME,
    class_name:"osd-vol",
    anchor: ["bottom"],
    layer: "overlay",
    transition_type: "slide_up",
    child: SwitchOSD,
  });

  return window;
}

