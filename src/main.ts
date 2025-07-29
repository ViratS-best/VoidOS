// src/main.ts (or src/apps/myTerminal.ts)
import { App } from "prozilla-os";
import { MyTerminalApp } from "./components/MyTerminalApp"; // Adjust path if you put it in apps folder

/**
 * Change this to the name of your application
 * This is what users will see when they use your app
 */
const name = "Terminal"; // We'll name it "Terminal" to replace the old one

/**
 * Change this to the name of your application, but only use lower case letters and hyphens (-)
 * This won't be seen by users very often, but will be used by ProzillaOS to identify your app
 */
const id = "my-custom-terminal"; // A unique ID for your new terminal

const myTerminalApp = new App(name, id, MyTerminalApp)
	.setDescription("Your personalized terminal for VoidOS.")
 	// You'll need an icon. For now, you can use a placeholder or find a terminal icon SVG
 	// Example: .setIconUrl("https://raw.githubusercontent.com/prozilla-os/ProzillaOS/main/public/assets/icons/terminal.svg");
    .setIconUrl("public/terminal.png"); // Using ProzillaOS's default terminal icon for convenience

export { myTerminalApp };