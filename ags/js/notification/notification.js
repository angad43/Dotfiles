import Notification from "../notifs/notifications.js";
const notifications = await Service.import("notifications");
const notifs = notifications.bind("notifications");

const transitionDuration = 200;

const Animated = (n) => Widget.Revealer({
    transition_duration: transitionDuration,
    transition: "slide_down",
    child: Notification(n),
    setup: (self) => Utils.timeout(transitionDuration, () => {
        if (!self.is_destroyed)
            self.reveal_child = true;
    }),
});

const ClearButton = () => Widget.Button({
    on_clicked: notifications.clear,
    sensitive: notifs.as(n => n.length > 0),
    child: Widget.Box({
        children: [
            Widget.Label("Clear "),
            Widget.Icon({
                icon: notifs.as(n => `user-trash-${n.length > 0 ? "full-" : ""}symbolic`),
            }),
        ],
    }),
});

const Header = () => Widget.Box({
    class_name: "header",
    children: [
        Widget.Label({ label: "Notifications", hexpand: true, xalign: 0 }),
        ClearButton(),
    ],
});

const NotificationList = () => {
    const map = new Map();
    const box = Widget.Box({
        vertical: true,
        children: notifications.notifications.map(n => {
            const w = Animated(n);
            map.set(n.id, w);
            return w;
        }),
        visible: notifs.as(n => n.length > 0),
    });

    function remove(_, id) {
        const n = map.get(id);
        if (n) {
            n.reveal_child = false;
            Utils.timeout(transitionDuration, () => {
                n.destroy();
                map.delete(id);
            });
        }
    }

    return box
        .hook(notifications, remove, "closed")
        .hook(notifications, (_, id) => {
            if (id !== undefined) {
                if (map.has(id))
                    remove(null, id);

                const n = notifications.getNotification(id);

                const w = Animated(n);
                map.set(id, w);
                box.children = [w, ...box.children];
            }
        }, "notified");
}

const Placeholder = () => Widget.Box({
    class_name: "placeholder",
    vertical: true,
    vpack: "center",
    hpack: "center",
    vexpand: true,
    hexpand: true,
    visible: notifs.as(n => n.length === 0),
    children: [
        Widget.Icon("notifications-disabled-symbolic"),
        Widget.Label("Your inbox is empty"),
    ],
});

export default () => Widget.Box({
    class_name: "notifications",
    css: `min-width: 250px`,
    vertical: true,
    children: [
        Header(),
        Widget.Scrollable({
            vexpand: true,
            hscroll: "never",
            class_name: "notification-scrollable",
            child: Widget.Box({
                class_name: "notification-list-vertical",
                vertical: true,
                children: [
                    NotificationList(),
                    Placeholder(),
                ],
            }),
        }),
    ],
});
