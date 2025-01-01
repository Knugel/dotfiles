import { type ConstructProps, Gtk, astalify } from 'astal/gtk4';

type SearchEntryProps = ConstructProps<
	Gtk.SearchEntry,
	Gtk.SearchEntry.ConstructorProps
>;
export const SearchEntry = astalify<
	Gtk.SearchEntry,
	Gtk.SearchEntry.ConstructorProps
>(Gtk.SearchEntry, {});
