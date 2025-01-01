import './globals';

import { App } from 'astal/gtk4';
import { monitorStyleChanges, toggleWindow } from './src/utils';
import Bar from './src/widget/Bar/Bar';
import Launcher from './src/widget/Launcher/Launcher';
import './src/widget/Notfications/Notifications';
import Trigger from './src/widget/Bar/Trigger';
import NotificationWindow from './src/widget/Notfications/Notifications';
import style from './styles/index.scss';

function main() {
	Launcher();
	Bar();
	Trigger();
	NotificationWindow();

	monitorStyleChanges();
}

function requestHandler(request: string, res: (response: string) => void) {
	const args = request.split(' ');
	if (args[0] === 'toggle') {
		toggleWindow(args[1]);
		res('ok');
	} else {
		res('unknown command');
	}
}

App.start({
	css: style,
	main,
	requestHandler,
});
