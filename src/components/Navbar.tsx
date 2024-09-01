import { createSignal, type JSX } from "solid-js";
import { TextField } from "@kobalte/core/text-field";
import { Button } from "@kobalte/core/button";

import { NAME } from "../lib/info";

import { IoSearch, IoSettingsOutline } from "solid-icons/io";

function Logo() {
	return (
		<a
			href="/riptire/"
			class="text-lg text-primary font-bold bg-secondary [text-shadow:_0_1px_0_rgb(0_0_0_/_40%)] rounded-lg px-4 py-2 drop-shadow-lg"
		>
			{NAME}
		</a>
	);
}

function Search() {
	const [value, setValue] = createSignal("");

	const performSearch = () => {
		window.location.href = `/riptire/search?q=${value()}`;
	};

	const keyUp = (e: any) => {
		if (e.key == "Enter") {
			performSearch();
		}
	};

	return (
		<div class="flex flex-row drop-shadow-lg">
			<TextField value={value()} onChange={setValue} onKeyUp={keyUp}>
				<TextField.Input class="rounded-l-lg px-4 py-2 outline-none" />
			</TextField>

			<Button
				onClick={performSearch}
				class="rounded-r-lg bg-secondary px-6 py-2 text-xl text-white"
			>
				<IoSearch />
			</Button>
		</div>
	);
}

function Anchor(props: { href: string; children: JSX.Element }) {
	return (
		<a
			href={props.href}
			class="hover:border-b-4 transition-all duration-75 border-b-tertiary flex items-center h-full px-8"
		>
			{props.children}
		</a>
	);
}

export default function Navbar() {
	return (
		<div class="bg-nav/90 sticky top-0 z-10 drop-shadow-xl border-b border-b-black/20 text-secondary w-full flex flex-row justify-between items-center px-8 h-16">
			<Logo />

			<div class="hidden lg:flex flex-row h-full items-end">
				<Anchor href="/riptire/trending">Trending</Anchor>
				<Anchor href="/riptire/subscriptions">Subscriptions</Anchor>
			</div>

			<Search />

			<div class="flex flex-row h-full items-center">
				<Anchor href="/riptire/settings">
					<IoSettingsOutline class="text-2xl" />
				</Anchor>
			</div>
		</div>
	);
}
