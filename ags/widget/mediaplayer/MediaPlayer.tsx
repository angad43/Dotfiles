import { Astal, Gtk, Gdk } from "ags/gtk4"
import Mpris from "gi://AstalMpris"
import { createBinding, With } from "ags"
import app from "ags/gtk4/app"
import Graphene from "gi://Graphene"

export default function MediaPlayer() {
    const mpris = Mpris.get_default()
    const players = createBinding(mpris, "players")

    let win: Astal.Window
    let contentbox: Gtk.Box

    function onKey(_e: Gtk.EventControllerKey, keyval: number) {
        if (keyval === Gdk.KEY_Escape) {
            win.visible = false
        }
    }

    function onClick(_e: Gtk.GestureClick, _: number, x: number, y: number) {
        const [, rect] = contentbox.compute_bounds(win)
        const position = new Graphene.Point({ x, y })
        if (!rect.contains_point(position)) {
            win.visible = false
        }
    }

    return (
        <window
        $={(ref) => (win = ref)}
        name="mediaplayer"
        anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.LEFT | Astal.WindowAnchor.RIGHT}
        visible={false}
        application={app}
        class="window-mediaplayer"
        keymode={Astal.Keymode.ON_DEMAND}
        exclusivity={Astal.Exclusivity.IGNORE}
        >
        <Gtk.EventControllerKey onKeyPressed={onKey} />
        <Gtk.GestureClick onPressed={onClick} />
        <box halign={Gtk.Align.END} valign={Gtk.Align.START}>
        <box
        $={(ref) => (contentbox = ref)}
        class="mediaplayer-content fixed-size-player"
        orientation={Gtk.Orientation.VERTICAL}
        overflow={Gtk.Overflow.HIDDEN}
        >
        <With value={players}>
        {(playerList) => {
            const p = playerList.find(pl => pl.playback_status === Mpris.PlaybackStatus.PLAYING) || playerList[0]
            if (!p) return (
                <box class="player-empty" orientation={Gtk.Orientation.VERTICAL} halign={Gtk.Align.CENTER} valign={Gtk.Align.CENTER}>
                <label label="🎵" css="font-size: 3rem; opacity: 0.2;" />
                <label label="No Media Detected" css="opacity: 0.5;" />
                </box>
            )
                return (
                    <box orientation={Gtk.Orientation.VERTICAL} spacing={10}>
                    <box
                    class="player-cover-art"
                    css={createBinding(p, "cover_art").as(cover => {
                        const bg = cover ? (cover.startsWith("/") ? `file://${cover}` : cover) : ""
                        return cover ? `background-image: url('${bg}');` : `background-color: #313244;`
                    })}
                    />

                    <box orientation={Gtk.Orientation.VERTICAL} class="player-info">
                    <label
                    class="title"
                    halign={Gtk.Align.CENTER}
                    maxWidthChars={25}
                    ellipsize={3}
                    label={createBinding(p, "title").as(t => String(t || "Unknown"))}
                    />
                    <label
                    class="artist"
                    halign={Gtk.Align.CENTER}
                    maxWidthChars={30}
                    ellipsize={3}
                    label={createBinding(p, "artist").as(a => String(a || "Unknown Artist"))}
                    />
                    </box>

                    <slider
                    class="media-slider"
                    hexpand
                    value={createBinding(p, "position").as(pos => {
                        if (p.length > 0) {
                            return Math.max(0, Math.min(1, pos / p.length))
                        }
                        return 0
                    })}
                    onNotifyValue={({ value }) => {
                        if (p && p.can_seek && p.length > 0) {
                            const current = p.position / p.length
                            if (Math.abs(current - value) > 0.05) {
                                p.position = value * p.length
                            }
                        }
                    }}
                    />

                    <box halign={Gtk.Align.CENTER} spacing={25} class="media-controls-vertical">
                    <button onClicked={() => p.previous()} label="⏮" />
                    <button
                    class="play-pause-btn"
                    onClicked={() => p.play_pause()}
                    label={createBinding(p, "playback_status").as(s =>
                        s === Mpris.PlaybackStatus.PLAYING ? "⏸" : "▶"
                    )}
                    />
                    <button onClicked={() => p.next()} label="⏭" />
                    </box>
                    </box>
                )
        }}
        </With>
        </box>
        </box>
        </window>
    )
}
