// src/apps/mySettingsApp.ts
import { App } from "prozilla-os";
import { MySettingsApp } from "../components/MySettingsApp";

const name = "Settings"; // Keep the same name to replace the old one
const id = "my-custom-settings"; // A unique ID for your new settings app

const mySettingsApp = new App(name, id, MySettingsApp)
	.setDescription("Configure VoidOS system settings.")
 	// Using ProzillaOS's default settings icon for convenience
 	.setIconUrl("https://os.prozilla.dev/assets/icons/settings.svg");

export { mySettingsApp };