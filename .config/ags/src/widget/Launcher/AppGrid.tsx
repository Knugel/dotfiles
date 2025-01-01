import type AstalApps from 'gi://AstalApps?version=0.1';
import Pango from 'gi://Pango?version=1.0';
import { bind } from 'astal';
import { Gdk, Gtk } from 'astal/gtk4';
import Button from '../../common/Button';
import { FlowBox } from '../../common/gtk/FlowBox';
import { children, launch } from '../../utils';

export default function AppGrid(items: AstalApps.Application[]) {
	function setup(self: Gtk.FlowBox) {
		for (const child of Array.from(children(self))) {
			child.set_focusable(false);
		}
	}

	return (
		<FlowBox columnSpacing={16} rowSpacing={16} homogeneous setup={setup}>
			{items.map((item) => (
				<box halign={FILL} hexpand>
					<Button
						variant="text"
						cssClasses={['application-item']}
						hexpand
						halign={FILL}
						onClicked={() => launch(item)}
						tooltipText={item.name}
					>
						<box vertical hexpand halign={FILL} spacing={4}>
							<image
								iconName={bind(item, 'iconName')}
								iconSize={Gtk.IconSize.LARGE}
							/>
							<label
								singleLineMode
								maxWidthChars={12}
								ellipsize={Pango.EllipsizeMode.END}
							>
								{item.name}
							</label>
						</box>
					</Button>
				</box>
			))}
		</FlowBox>
	);
}
