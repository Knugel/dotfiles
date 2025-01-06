import { App, Astal } from 'astal/gtk4';
import { setWindowVisibility } from '../../utils';

export default function Trigger() {
	return (
		<window
			cssClasses={['trigger']}
			visible={true}
			exclusivity={Astal.Exclusivity.NORMAL}
			anchor={TOP}
			application={App}
			onHoverEnter={() => setWindowVisibility('bar', true)}
		/>
	);
}
