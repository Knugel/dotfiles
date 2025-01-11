import AstalNotifd from 'gi://AstalNotifd?version=0.1';
import Pango from 'gi://Pango?version=1.0';
import { GLib, Variable, timeout } from 'astal';
import { App, Astal, Gdk, Gtk } from 'astal/gtk4';
import Button from '../../common/Button';

const time = (time: number, format = '%H:%M') =>
	GLib.DateTime.new_from_unix_local(time).format(format) ?? '';

const isIcon = (icon: string) => {
	const iconTheme = new Gtk.IconTheme();
	return iconTheme.has_icon(icon);
};

const fileExists = (path: string) => GLib.file_test(path, GLib.FileTest.EXISTS);

const urgency = (n: AstalNotifd.Notification) => {
	const { LOW, CRITICAL } = AstalNotifd.Urgency;

	switch (n.urgency) {
		case LOW:
			return 'low';
		case CRITICAL:
			return 'critical';
		default:
			return 'normal';
	}
};

function Notification({ n }: { n: AstalNotifd.Notification }) {
	return (
		<box
			name={n.id.toString()}
			cssClasses={['window-content', 'notification-container', urgency(n)]}
		>
			<box vertical>
				<box cssClasses={['header']}>
					{(n.appIcon || n.desktopEntry) && (
						<image
							cssClasses={['app-icon']}
							visible={!!(n.appIcon || n.desktopEntry)}
							iconName={n.appIcon || n.desktopEntry}
						/>
					)}
					<label
						cssClasses={['app-name']}
						halign={Gtk.Align.FILL}
						label={n.appName || 'Unknown'}
					/>
					<label
						cssClasses={['time']}
						hexpand
						halign={Gtk.Align.END}
						label={time(n.time)}
					/>
					<Button variant="text" onClicked={() => n.dismiss()}>
						<image iconName={'window-close-symbolic'} />
					</Button>
				</box>
				<Gtk.Separator visible orientation={Gtk.Orientation.HORIZONTAL} />
				<box cssClasses={['content']} spacing={10}>
					{n.image && fileExists(n.image) && (
						<box valign={Gtk.Align.START} cssClasses={['image']}>
							<image file={n.image} overflow={Gtk.Overflow.HIDDEN} />
						</box>
					)}
					{n.image && isIcon(n.image) && (
						<box cssClasses={['icon-image']} valign={Gtk.Align.START}>
							<image
								iconName={n.image}
								iconSize={Gtk.IconSize.LARGE}
								halign={Gtk.Align.CENTER}
								valign={Gtk.Align.CENTER}
							/>
						</box>
					)}
					<box vertical>
						<label
							ellipsize={Pango.EllipsizeMode.END}
							maxWidthChars={30}
							cssClasses={['summary']}
							halign={Gtk.Align.START}
							xalign={0}
							label={n.summary}
						/>
						{n.body && (
							<label
								ellipsize={Pango.EllipsizeMode.END}
								maxWidthChars={30}
								cssClasses={['body']}
								wrap
								useMarkup
								halign={Gtk.Align.START}
								xalign={0}
								justify={Gtk.Justification.FILL}
								label={n.body}
							/>
						)}
					</box>
				</box>
				{n.get_actions().length > 0 && (
					<box cssClasses={['actions']}>
						{n.get_actions().map(({ label, id }) => (
							<Button variant="text" hexpand onClicked={() => n.invoke(id)}>
								<label label={label} halign={Gtk.Align.CENTER} hexpand />
							</Button>
						))}
					</box>
				)}
			</box>
		</box>
	);
}

const notifs = Variable(0);
const notifd = AstalNotifd.get_default();

const updateNotif = () => {
	notifs.set([...map.values()].length);
};

const map = new Map();

const add = (
	box: Gtk.Box,
	key: number,
	val: ReturnType<typeof Notification>,
) => {
	if (map.has(key)) {
		box.remove(map.get(key));
	}

	box.append(val);
	map.set(key, val);
	updateNotif();
};

const close = (box: Gtk.Box, key: number) => {
	if (map.has(key)) {
		box.remove(map.get(key));
	}
	map.delete(key);
	updateNotif();
};

function NotificationList() {
	return (
		<box
			vertical
			spacing={6}
			setup={(self) => {
				notifd.connect('notified', (_, id) => {
					const notification = notifd.get_notification(id);
					add(self, id, <Notification n={notification} />);

					timeout(5000, () => {
						close(self, id);
					});
				});

				notifd.connect('resolved', (_, id) => {
					close(self, id);
				});
			}}
		/>
	);
}

export default function NotificationWindow() {
	const { TOP } = Astal.WindowAnchor;
	return (
		<window
			visible={notifs((n) => n > 0)}
			cssClasses={['notification-popup']}
			namespace={'notification-popup'}
			application={App}
			anchor={TOP | RIGHT}
		>
			<NotificationList />
		</window>
	);
}
