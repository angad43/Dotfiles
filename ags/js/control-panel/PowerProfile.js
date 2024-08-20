import { ArrowToggleButton, Menu } from "./ToggleButton.js";

const powerProfiles = await Service.import("powerprofiles");
const activeProfile = powerProfiles.bind("active_profile");
const profiles = powerProfiles.profiles.map(p => p.Profile);

const profileIcons = {
    "power-saver": "power-profile-power-saver-symbolic",
    balanced: "power-profile-balanced-symbolic",
    performance: "power-profile-performance-symbolic",
};

const pretty = (str) => str
    .split("-")
    .map(str => `${str.charAt(0).toUpperCase()}${str.slice(1)}`)
    .join(" ");

const PowerProfileToggle = () => ArrowToggleButton({
    name: "power-profile",
    icon: activeProfile.as(p => profileIcons[p]),
    label: activeProfile.as(pretty),
    connection: [powerProfiles, () => powerProfiles.active_profile !== profiles[1]],
    activate: () => powerProfiles.active_profile = profiles[0],
    deactivate: () => powerProfiles.active_profile = profiles[1],
    activateOnArrow: false,
});

const PowerProfileSelector = () => Menu({
    name: "power-profile",
    icon: activeProfile.as(p => profileIcons[p]),
    title: "Profile Selector",
    content: [
        Widget.Box({
            vertical: true,
            hexpand: true,
            children: profiles.map(prof => Widget.Button({
                on_clicked: () => powerProfiles.active_profile = prof,
                child: Widget.Box({
                    children: [
                        Widget.Icon({
                            class_name: "power-profile-icon",
                            icon: profileIcons[prof],
                        }),
                        Widget.Label({
                            class_name: "power-profile-label",
                            label: pretty(prof),
                        }),
                    ],
                }),
            })),
        }),
    ],
});

export const ProfileToggle = PowerProfileToggle;

export const ProfileSelector = PowerProfileSelector;

