import AstalApps from 'gi://AstalApps?version=0.1';
import type Gtk from 'gi://Gtk?version=4.0';
import { Variable } from 'astal';
import { App, Astal, hook } from 'astal/gtk4';
import { ScrolledWindow, SearchEntry } from '../../common';
import { groupBy, launch, toggleWindow } from '../../utils';
import AppGrid from './AppGrid';

const query = Variable<string>('');
const GROUP_APPS = false;

export default function Launcher() {
	const items = query((query) => {
		const apps = new AstalApps.Apps({
			showHidden: false,
			categoriesMultiplier: 0,
			descriptionMultiplier: 0,
			keywordsMultiplier: 0,
			executableMultiplier: 0,
			nameMultiplier: 10,
		});
		return apps.fuzzy_query(query).sort((a, b) => b.frequency - a.frequency);
	});

	function setup(self: Gtk.ScrolledWindow) {
		const grids: Gtk.Widget[] = [];

		const box = new Astal.Box({
			hexpand: true,
			vertical: true,
			halign: FILL,
			spacing: 16,
		});

		self.set_child(box);

		function setupGrid(items: AstalApps.Application[]) {
			for (const child of grids) {
				box.remove(child);
				child.run_dispose();
			}
			grids.length = 0;

			const groups: Record<string, AstalApps.Application[]> = {};
			for (const item of items) {
				const categories = item.categories;
				for (const category of categories) {
					const group = groups[category] ?? [];
					group.push(item);
					groups[category] = group;
				}
			}

			if (GROUP_APPS) {
				for (const [category, child] of Object.entries(groups)) {
					if (child.length === 0) continue;
					const grid = AppGrid(child);

					const container = (
						<box vertical halign={FILL} cssClasses={['category']}>
							<label halign={START}>{category}</label>
							<box>{grid}</box>
						</box>
					);

					box.append(container);
					grids.push(container);
				}
			} else {
				const grid = AppGrid(items);
				const container = (
					<box vertical halign={FILL} cssClasses={['category']}>
						<label halign={START}>Apps</label>
						<box>{grid}</box>
					</box>
				);
				box.append(container);
				grids.push(container);
			}
		}

		items.subscribe((items) => setupGrid(items));
		setupGrid(items.get());
	}

	const entry = (
		<SearchEntry
			onActivate={() => {
				const item = items.get()[0];
				if (item !== undefined) launch(item);
			}}
			onKeyPressed={(_, event, code) => {
				if (event && code === 9) {
					toggleWindow('launcher');
				}
			}}
			setup={(self) => {
				hook(self, self, 'notify::text', () => {
					query.set(self.get_text());
				});
			}}
		/>
	);

	return (
		<window
			application={App}
			layer={Astal.Layer.OVERLAY}
			keymode={Astal.Keymode.EXCLUSIVE}
			visible={false}
			exclusivity={Astal.Exclusivity.NORMAL}
			cssClasses={['launcher']}
			name="launcher"
			setup={(self) => {
				hook(self, self, 'notify::visible', () => {
					if (!self.get_visible()) {
						query.set('');
						entry.set({ text: '' });
					} else {
						query.set('');
						entry.grab_focus();
					}
				});
			}}
		>
			<box vertical>
				{entry}
				<ScrolledWindow
					width_request={900}
					height_request={500}
					cssClasses={['scroll-container']}
					setup={setup}
				/>
			</box>
		</window>
	);
}
