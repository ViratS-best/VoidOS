// src/config/desktopConfig.ts
import { DesktopConfig } from "prozilla-os";

export const desktopConfig = new DesktopConfig({
    defaultWallpaper: "https://os.prozilla.dev/assets/wallpapers/vibrant-wallpaper-blue-purple-red.png",
    // Add the items array to define desktop icons/shortcuts
    items: [
        {
            type: "file", // This indicates it's a file shortcut
            name: "Corrupted Log", // The name displayed under the icon
            path: "/system_log.txt", // The actual path to the file in your public directory
            icon: "/icons/corrupted_file.png", // Path to the icon image (you need to create this)
            shortcut: true, // Set to true to make it appear as a desktop shortcut
            x: 50, // X-coordinate for placement on the desktop
            y: 50, // Y-coordinate for placement on the desktop
        },
        // You can add more desktop items here if needed,
        // for example, shortcuts to your Terminal or Text Editor apps.
        // Example for a shortcut to an app:
        /*
        {
            type: "app",
            appId: "my-custom-terminal-app", // Use the 'id' defined in appsConfig.ts
            name: "Terminal",
            icon: "/icons/terminal.png", // Icon for the terminal app
            shortcut: true,
            x: 150,
            y: 50,
        },
        */
    ],
});