import { Variable, bind } from 'astal';
import { Gtk } from 'astal/gtk4';

export default function Time() {
	const time = Variable('').poll(1000, 'date +%H:%M');
	const date = Variable('').poll(60000, 'date "+%a, %b %d"');

	return (
		<box vertical cssClasses={['date-time']} valign={FILL}>
			<box vertical valign={CENTER}>
				<label
					cssClasses={['time']}
					valign={CENTER}
					justify={Gtk.Justification.CENTER}
					label={bind(time)}
				/>
				<label
					cssClasses={['date']}
					valign={CENTER}
					justify={Gtk.Justification.CENTER}
					label={bind(date)}
				/>
			</box>
		</box>
	);
}
