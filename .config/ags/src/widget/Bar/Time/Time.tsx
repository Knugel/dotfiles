import { Variable, bind } from 'astal';
import { Gtk } from 'astal/gtk4';

export default function Time() {
	const time = Variable('').poll(1000, 'date +%H:%M');
	const date = Variable('').poll(60000, 'date "+%A, %d %B"');

	return (
		<label
			cssClasses={['time']}
			halign={FILL}
			justify={Gtk.Justification.CENTER}
			wrap
			tooltipText={bind(date)}
			label={bind(time).as((time) => time.split(':').join('\n'))}
		/>
	);
}
