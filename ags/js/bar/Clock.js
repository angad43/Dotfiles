import { execAsync } from "resource:///com/github/Aylur/ags/utils.js";

export const Clock = () =>
  Widget.Box({
    class_name: "clock",
    spacing: 12,
    children: [
     
      Widget.Label({
        setup: (self) =>
          self.poll(1000, (self) =>
            execAsync(["date", "+%I:%M %p"]).then((date) => (self.label = date)),
          ),
      }),
    ],
  });
