import { type ConstructProps, Gtk, astalify } from 'astal/gtk4';
import { children } from '../../utils';

type FlowBoxWindowProps = ConstructProps<
	Gtk.FlowBox,
	Gtk.FlowBox.ConstructorProps
>;
export const FlowBox = astalify<Gtk.FlowBox, Gtk.FlowBox.ConstructorProps>(
	Gtk.FlowBox,
	{
		// if it is a container widget, define children setter and getter here
		getChildren(self) {
			return Array.from(children(self));
		},
		setChildren(self, children) {
			for (const child of children) self.append(child);
		},
	},
);
