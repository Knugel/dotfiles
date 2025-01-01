import { App, Astal } from 'astal/gtk4';
import IconButton from '../../common/IconButton';
import PowerMenu from '../../services/PowerMenu';
import Time from './Time/Time';
import Tray from './Tray/Tray';
import Workspaces from './Workspaces/Workspaces';

export default function Bar() {
	return (
		<window
			cssClasses={['bar']}
			exclusivity={Astal.Exclusivity.NORMAL}
			anchor={BOTTOM}
			application={App}
		>
			<centerbox halign={CENTER} cssClasses={['bar-container']}>
				<box halign={CENTER}>
					<Time />
				</box>
				<Workspaces />
				<box halign={CENTER}>
					<Tray />
					<IconButton
						onClicked={() => PowerMenu.action('logout')}
						halign={FILL}
						iconName="system-shutdown-symbolic"
						cssClasses={['shutdown']}
					/>
				</box>
			</centerbox>
		</window>
	);
}
