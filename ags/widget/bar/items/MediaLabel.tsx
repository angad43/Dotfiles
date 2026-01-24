import { Gtk } from "ags/gtk4"
import Mpris from "gi://AstalMpris"
import app from "ags/gtk4/app"

export function MediaLabel() {
    const mpris = Mpris.get_default()
    return (
        <button
        class="media-bar-label"
        onClicked={() => {
            const win = app.get_window("mediaplayer")
            if (win) win.visible = !win.visible
        }}
        >
        <box spacing={8} valign={Gtk.Align.CENTER}>
        <image iconName="audio-x-generic-symbolic" />
        <label
        maxWidthChars={25}
        ellipsize={3}
        $={self => {
            let playerHandler: number | null = null
            let activePlayer: Mpris.Player | null = null
            const updateLabel = () => {
                const p = mpris.players.find(pl =>
                pl.playback_status === Mpris.PlaybackStatus.PLAYING
                ) || mpris.players[0]
                if (p !== activePlayer) {
                    if (activePlayer && playerHandler) {
                        activePlayer.disconnect(playerHandler)
                    }
                    activePlayer = p

                    if (p) {
                        playerHandler = p.connect("notify::title", updateLabel)
                    }
                }
                if (p) {
                    self.label = p.title || "Unknown Track"
                } else {
                    self.label = "Stopped"
                }
            }
            const mprisHandler = mpris.connect("notify::players", updateLabel)
            updateLabel()
            self.connect("destroy", () => {
                mpris.disconnect(mprisHandler)
                if (activePlayer && playerHandler) {
                    activePlayer.disconnect(playerHandler)
                }
            })
        }}
        ></label>
        </box>
        </button>
    )
}
