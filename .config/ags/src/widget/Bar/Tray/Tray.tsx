import Tray from 'gi://AstalTray';
import type { Gtk } from 'astal/gtk4';
import TrayItem from './TrayItem';

export default () => {
	function setup(self: Gtk.Box) {
		const tray = Tray.get_default();
		const items = new Map<string, Gtk.Widget>();

		const addItem = (id: string) => {
			const item = tray.get_item(id);
			if (item) {
				const trayItem = TrayItem({ item });
				items.set(id, trayItem);
				self.append(trayItem);
				trayItem.show();
			}
		};

		const removeItem = (id: string) => {
			const trayItem = items.get(id);
			if (trayItem) {
				self.remove(trayItem);
				trayItem.run_dispose();
				items.delete(id);
			}
		};

		for (const item of tray
			.get_items()
			.sort((a, b) => a.item_id.localeCompare(b.item_id))) {
			addItem(item.item_id);
		}
		tray.connect('item_added', (_, id) => addItem(id));
		tray.connect('item_removed', (_, id) => removeItem(id));
	}

	return (
		<box halign={CENTER}>
			<box cssClasses={['tray']}>
				<box halign={CENTER} setup={setup} />
			</box>
		</box>
	);
};
