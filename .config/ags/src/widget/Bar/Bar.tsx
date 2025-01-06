import { App, Astal } from 'astal/gtk4';
import { setWindowVisibility } from '../../utils';
import Time from './Time/Time';
import Tray from './Tray/Tray';
import Workspaces from './Workspaces/Workspaces';

let isPopupOpen = false;
let isHovered = false;
let timeout: number | undefined = undefined;

export function updateBarVisibility(popup?: boolean, hovered?: boolean) {
	if (popup !== undefined) {
		isPopupOpen = popup;
	}
	if (hovered !== undefined) {
		isHovered = hovered;
	}

	clearTimeout(timeout);
	timeout = window.setTimeout(() => {
		if (!isPopupOpen && !isHovered) {
			setWindowVisibility('bar', false);
		}
	}, 500);
}

export default function Bar() {
	return (
		<window
			name="bar"
			cssClasses={['bar']}
			exclusivity={Astal.Exclusivity.NORMAL}
			anchor={TOP}
			application={App}
			onHoverEnter={() => updateBarVisibility(true)}
			onHoverLeave={() => updateBarVisibility(false)}
		>
			<centerbox valign={FILL} vexpand cssClasses={['bar-container']}>
				<box valign={FILL}>
					<Time />
				</box>
				<box valign={FILL}>
					<Workspaces />
				</box>
				<box valign={FILL}>
					<Tray />
				</box>
			</centerbox>
		</window>
	);
}
