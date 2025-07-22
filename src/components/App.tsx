import { Desktop, ModalsView, ProzillaOS, Taskbar, WindowsView } from "prozilla-os";
import { appsConfig } from "../config/appsConfig";
import { desktopConfig } from "../config/desktopConfig";

export function App() {
	return (
		<ProzillaOS
			systemName="VoidOS"
			tagLine="Powered by ProzillaOS"
			config={{
				apps: appsConfig,
				desktop: desktopConfig,
			}}
		>
			<Taskbar/>
			<WindowsView/>
			<ModalsView/>
			<Desktop/>
		</ProzillaOS>
	);
}
