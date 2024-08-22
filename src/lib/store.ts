import { type Accessor, createSignal } from "solid-js";

export function createStoredSignal<T>(
	key: string,
	defaultValue: T
): [Accessor<T>, (t: Exclude<T, Function>) => void] {
	const initialValue = localStorage.getItem(key)
		? (JSON.parse(localStorage.getItem(key)!) as T)
		: defaultValue;

	const [value, setValue] = createSignal<T>(initialValue);

	const setValueAndStore = (v: Exclude<T, Function>) => {
		setValue(v);
		localStorage.setItem(key, JSON.stringify(v));
	};

	return [value, setValueAndStore];
}