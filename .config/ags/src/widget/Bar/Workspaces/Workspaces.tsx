import Hyprland from 'gi://AstalHyprland?version=0.1';
import type Gtk from 'gi://Gtk?version=4.0';
import { hook } from 'astal/gtk4';

export default function Workspaces() {
	const hypr = Hyprland.get_default();

	function setup(self: Gtk.Box, index: number) {
		function toggleFocus() {
			if (hypr.focusedWorkspace?.id === index)
				self.add_css_class('workspace-focused');
			else self.remove_css_class('workspace-focused');
		}

		function toggleActive() {
			if (hypr.clients.filter((x) => x.workspace?.id === index).length > 0)
				self.add_css_class('workspace-active');
			else self.remove_css_class('workspace-active');
		}

		hook(self, hypr, 'notify::focused-workspace', () => toggleFocus());
		hook(self, hypr, 'notify::clients', () => toggleActive());
		toggleFocus();
		toggleActive();
	}

	return (
		<box halign={FILL} cssClasses={['workspaces']} spacing={4}>
			{Array.from({ length: 5 }, (_, i) => i + 1).map((i) => (
				<box
					halign={CENTER}
					cssClasses={['workspace-indicator']}
					setup={(self) => setup(self, i)}
					onButtonReleased={() => hypr.dispatch('workspace', i.toString())}
				>
					<label halign={CENTER} label="" />
				</box>
			))}
		</box>
	);
}
