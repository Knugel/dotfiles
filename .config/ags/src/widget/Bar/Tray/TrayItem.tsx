import type Tray from 'gi://AstalTray';
import type Gdk from 'gi://Gdk?version=4.0';
import type Gio from 'gi://Gio?version=2.0';
import { Variable, bind } from 'astal';
import { App, Gtk } from 'astal/gtk4';

type Props = {
	item: Tray.TrayItem;
};

function createMenu(model: Gio.MenuModel, actions: Gio.ActionGroup) {
	const menu = Gtk.PopoverMenu.new_from_model_full(
		model,
		Gtk.PopoverMenuFlags.NESTED,
	);
	menu.set_has_arrow(false);
	menu.set_offset(-8, 0);
	menu.insert_action_group('dbusmenu', actions);
	return menu;
}

export default function TrayItem({ item }: Props) {
	if (item.iconThemePath) App.add_icons(item.iconThemePath);

	const menu = Variable(createMenu(item.menuModel, item.actionGroup));

	menu((menu) => {
		menu.connect('notify::menu-model', () => {
			const newMenu = createMenu(item.menu_model, item.action_group);
			menu.run_dispose();
			menu.set(newMenu);
		});
	});

	menu((menu) => {
		menu.connect('notify::action-group', () => {
			const newMenu = createMenu(item.menu_model, item.action_group);
			menu.run_dispose();
			menu.set(newMenu);
		});
	});

	function onButtonReleased(self: Gtk.MenuButton, event: Gdk.ButtonEvent) {
		switch (event.get_button()) {
			case 1: {
				menu.get().hide();
				if (!menu.get()?.is_visible()) item.activate(0, 0);
				break;
			}
			case 2: {
				const [_, x, y] = event.get_position();
				item.secondary_activate(x, y);
				break;
			}
			case 3: {
				if (item.actionGroup.list_actions().length > 0)
					self.get_popover()?.show();
				break;
			}
		}
	}

	return (
		<menubutton
			onButtonReleased={(self, event) => onButtonReleased(self, event)}
			tooltipMarkup={bind(item, 'tooltipMarkup')}
			popover={bind(menu)}
			direction={Gtk.ArrowType.LEFT}
			halign={CENTER}
		>
			<image gicon={bind(item, 'gicon')} />
		</menubutton>
	);
}
