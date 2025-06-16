import { createSignal, type JSX } from "solid-js";
import { A, useNavigate } from "@solidjs/router";
import { TextField } from "@kobalte/core/text-field";
import { Button } from "@kobalte/core/button";
import { IoSearch, IoSettingsOutline } from "solid-icons/io";

import { NAME } from "../lib/info";

function Logo() {
	return (
		<A
			href="/"
			class="text-lg text-primary font-bold bg-secondary [text-shadow:0_1px_0_rgb(0_0_0/40%)] rounded-lg px-4 py-2 drop-shadow-lg"
		>
			{NAME}
		</A>
	);
}

function Search() {
	const [value, setValue] = createSignal("");
	const navigate = useNavigate();

	const performSearch = () => {
		navigate(`/search?q=${value()}`);
	};

	const keyUp = (e: KeyboardEvent) => {
		if (e.key === "Enter") {
			performSearch();
		}
	};

	return (
		<div class="flex flex-row drop-shadow-2xl rounded-lg shadow-lg shadow-black/30">
			<TextField value={value()} onChange={setValue} onKeyUp={keyUp}>
				<TextField.Input class="rounded-l-lg px-4 py-2 outline-hidden shadow-inner" />
			</TextField>

			<Button
				onClick={performSearch}
				class="rounded-r-lg bg-secondary px-6 py-2 text-xl hover:cursor-pointer text-white shadow-md"
			>
				<IoSearch />
			</Button>
		</div>
	);
}

function Anchor(props: { href: string; children: JSX.Element }) {
	return (
		<A
			href={props.href}
			class="hover:border-b-4 transition-all duration-75 border-b-secondary flex items-center h-full px-8"
		>
			{props.children}
		</A>
	);
}

export default function Navbar() {
	return (
		<div class="bg-nav/90 sticky top-0 z-10 drop-shadow-xl border-b border-b-black/20 text-secondary w-full flex flex-row justify-between items-center px-8 h-16">
			<Logo />

			<div class="hidden lg:flex flex-row h-full items-end">
				<Anchor href="/trending">Trending</Anchor>
				<Anchor href="/subscriptions">Subscriptions</Anchor>
			</div>

			<Search />

			<div class="flex flex-row h-full items-center">
				<Anchor href="/settings">
					<IoSettingsOutline class="text-2xl" />
				</Anchor>
			</div>
		</div>
	);
}
