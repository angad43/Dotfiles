import GObject from "gi://GObject";
import { monitorFile } from "ags/file";
import { exec, execAsync } from "ags/process";

class BrightnessService extends GObject.Object {
    static instance: BrightnessService;
    static get_default() {
        if (!this.instance) this.instance = new BrightnessService();
        return this.instance;
    }

    // Private state
    _screen = 0;
    _interface = "";
    _max = 0;

    get screen() { return this._screen; }
    set screen(value) {
        if (value < 0) value = 0;
        if (value > 1) value = 1;

        // Only update if changed
        if (this._screen !== value) {
            execAsync(`brightnessctl set ${Math.floor(value * 100)}% -q`).then(() => {
                this._screen = value;
                this.notify("screen");
            }).catch(print);
        }
    }

    constructor() {
        super();

        // Setup initial values
        this._setup();
    }

    _setup() {
        try {
            // 1. Find Interface
            this._interface = exec(`bash -c "ls -w1 /sys/class/backlight | head -1"`).trim();

            // 2. Get Max Brightness
            this._max = Number(exec("brightnessctl max")) || 1;

            // 3. Get Current Brightness
            const current = Number(exec("brightnessctl get"));
            this._screen = current / this._max;

            // 4. Start Monitor
            if (this._interface) {
                const path = `/sys/class/backlight/${this._interface}/brightness`;
                monitorFile(path, () => {
                    const updated = Number(exec("brightnessctl get"));
                    this._screen = updated / this._max;
                    this.notify("screen");
                });
            }
        } catch (e) {
            console.error("BrightnessService: Setup failed", e);
        }
    }
}

// REGISTER THE CLASS EXPLICITLY
// This bypasses the decorator and ensures the property exists in C-land
const Brightness = GObject.registerClass({
    GTypeName: "Brightness",
    Properties: {
        "screen": GObject.ParamSpec.double(
            "screen", "Screen Brightness", "Screen brightness 0.0-1.0",
            GObject.ParamFlags.READWRITE,
            0, 1, 0 // min, max, default
        ),
    },
}, BrightnessService);

export default Brightness;
