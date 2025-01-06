import type Tray from 'gi://AstalTray';
import type Gdk from 'gi://Gdk?version=4.0';
import type Gio from 'gi://Gio?version=2.0';
import { GObject, Variable, bind } from 'astal';
import { App, Gtk, hook } from 'astal/gtk4';
import { updateBarVisibility } from '../Bar';

type Props = {
	item: Tray.TrayItem;
};

function createMenu(model: Gio.MenuModel, actions: Gio.ActionGroup) {
	const menu = Gtk.PopoverMenu.new_from_model_full(
		model,
		Gtk.PopoverMenuFlags.NESTED,
	);
	menu.set_has_arrow(false);
	menu.insert_action_group('dbusmenu', actions);
	return menu;
}

export default function TrayItem({ item }: Props) {
	if (item.iconThemePath) App.add_icons(item.iconThemePath);

	const menu = Variable(createMenu(item.menuModel, item.actionGroup));

	function listenToMenuModelChange(menu: Gtk.PopoverMenu) {
		hook(menu, menu, 'notify::menu-model', () => {
			const newMenu = createMenu(item.menu_model, item.action_group);
			menu.run_dispose();
			menu.set(newMenu);
		});
	}

	menu((menu) => listenToMenuModelChange(menu));
	listenToMenuModelChange(menu.get());

	function listenToActionGroupChange(menu: Gtk.PopoverMenu) {
		hook(menu, menu, 'notify::action-group', () => {
			const newMenu = createMenu(item.menu_model, item.action_group);
			menu.run_dispose();
			menu.set(newMenu);
		});
	}

	menu((menu) => listenToActionGroupChange(menu));
	listenToActionGroupChange(menu.get());

	function listenToVisibilityChange(menu: Gtk.PopoverMenu) {
		hook(menu, menu, 'notify::visible', () => {
			updateBarVisibility(undefined, menu.visible);
		});
	}

	menu((menu) => {
		listenToVisibilityChange(menu);
	});
	listenToVisibilityChange(menu.get());

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
			direction={Gtk.ArrowType.DOWN}
			halign={CENTER}
		>
			<image gicon={bind(item, 'gicon')} />
		</menubutton>
	);
}
