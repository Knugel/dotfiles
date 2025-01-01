import Gtk from 'gi://Gtk?version=4.0';
import type { ButtonProps as AstalButtonProps } from 'astal/gtk4/widget';
import { combineClasses } from '../utils';

export type ButtonProps = {
	variant: 'tonal' | 'text';
} & AstalButtonProps;

export default function Button({
	variant = 'tonal',
	cssClasses,
	child,
	hexpand = false,
	vexpand = false,
	halign = Gtk.Align.CENTER,
	valign = Gtk.Align.CENTER,
	...props
}: Partial<ButtonProps>) {
	return (
		<button
			{...props}
			cssClasses={combineClasses(
				['mat-button', `mat-button-${variant}`],
				cssClasses,
			)}
			hexpand={hexpand}
			vexpand={vexpand}
			halign={halign}
			valign={valign}
		>
			{child}
		</button>
	);
}
