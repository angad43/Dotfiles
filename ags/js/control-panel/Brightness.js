import brightness from "../../services/brightness.js";

const formatBrightness = (value) => `${Math.round(value * 100)}%`;

export default () => {
  return Widget.Box({
    spacing: 6,
    vpack: "center",
    class_name: "brightness-slider",
    children: [
      Widget.Icon({ 
        class_name: "icon",
        icon: "brightness-display-symbolic", 
         size: 24 }),
      Widget.Box({
        spacing: 6,
        vpack: "center",
        children: [
          Widget.Slider({
            class_name: "brightness-slider",
            draw_value: false,
            hexpand: true,
            value: brightness.bind("screen"),
            on_change: ({ value }) => (brightness.screen = value),
          }),
          Widget.Label({
            css: "min-width: 3.2rem;", 
            justification: "center",
          }).hook(
            brightness,
            (self) => {
              self.label = formatBrightness(brightness.screen);
            },
          ),
        ],
      }),
    ],
  });
};

