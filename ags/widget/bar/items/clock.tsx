import GLib from "gi://GLib";
import { createPoll } from "ags/time"

export function Clock({ format = "%I:%M %p" }) {
    const time = createPoll("", 1000, () => {
        return GLib.DateTime.new_now_local().format(format)!
    })

   return <box
       class="clock"
   >
     <label label={time} />
     </box>
}
