import type AstalApps from 'gi://AstalApps?version=0.1';
import { type Binding, GLib, type Gio, exec, monitorFile } from 'astal';
import { App, type Gtk } from 'astal/gtk4';

export function monitorStyleChanges() {
	monitorFile(`${GLib.getenv('HOME')}/.config/ags/styles`, () => {
		const target = '/tmp/astal/style.css';
		exec(`sass ${GLib.getenv('HOME')}/.config/ags/styles/index.scss ${target}`);
		App.apply_css(target);
	});
}

export function toggleWindow(windowName: string) {
	const window = App.get_window(windowName);
	if (!window) return;
	window.visible = !window.visible;
}

export function setWindowVisibility(windowName: string, visible: boolean) {
	const window = App.get_window(windowName);
	if (!window) return;
	window.visible = visible;
}

export function combineClasses(
	self: string[],
	existing: string[] | Binding<string[]> | undefined,
) {
	if (existing === undefined) return self;

	if (Array.isArray(existing)) {
		return [...self, ...existing];
	}
	return existing?.as((value) => [...self, ...value]);
}

export function launch(item: AstalApps.Application) {
	const app = item.app as Gio.DesktopAppInfo;
	exec(`hyprctl dispatch exec uwsm app -- ${app.get_filename()}`);
	toggleWindow('launcher');
}

export function groupBy<T>(
	xs: T[],
	key: keyof T | ((value: T) => string),
): Record<string, T[]> {
	return xs.reduce<Record<string, T[]>>((rv, x) => {
		const group = typeof key === 'function' ? key(x) : x[key];
		const collection = rv[group as string] ?? [];
		collection.push(x);
		rv[group as string] = collection;
		return rv;
	}, {});
}

export function* children(widget: Gtk.Widget): IterableIterator<Gtk.Widget> {
	let child = widget.get_first_child();
	while (child !== null) {
		yield child;
		child = child.get_next_sibling();
	}
}
