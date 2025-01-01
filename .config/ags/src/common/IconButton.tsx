import type Gio from 'gi://Gio?version=2.0';
import Gtk from 'gi://Gtk?version=4.0';
import { combineClasses } from '../utils';
import Button, { type ButtonProps } from './Button';

export type IconButtonProps = {
	gicon: Gio.Icon;
} & ButtonProps;

export default function IconButton({
	variant = 'text',
	cssClasses,
	...props
}: Partial<IconButtonProps>) {
	return (
		<Button
			variant={variant}
			{...props}
			cssClasses={combineClasses(['mat-icon-button'], cssClasses)}
		>
			<image
				iconName={props.iconName}
				gicon={props.gicon}
				iconSize={Gtk.IconSize.LARGE}
			/>
		</Button>
	);
}
