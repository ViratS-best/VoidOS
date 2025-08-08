// src/main.ts
import { App } from "prozilla-os";
import { MyTerminalApp } from "./components/MyTerminalApp";

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
    // Use BASE_URL for correct path on GitHub Pages
    .setIconUrl(`${import.meta.env.BASE_URL}terminal.png`);

export { myTerminalApp };