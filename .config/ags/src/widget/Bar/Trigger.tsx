import { App, Astal } from 'astal/gtk4';

export default function Trigger() {
	return (
		<window
			cssClasses={['trigger']}
			visible={true}
			exclusivity={Astal.Exclusivity.NORMAL}
			anchor={TOP}
			application={App}
		/>
	);
}
