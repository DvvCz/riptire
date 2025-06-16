/* @refresh reload */
import { render } from "solid-js/web";
import type { JSXElement } from "solid-js";
import { Route, HashRouter } from "@solidjs/router";

import "./index.css";

import Navbar from "./components/Navbar";

function Layout(props: { children?: JSXElement }) {
	const [navbarColor] = createStoredSignal("v1.theme.nav", "#FFFFFF");
	const [primaryColor] = createStoredSignal("v1.theme.primary", "#FFFFFF");
	const [secondaryColor] = createStoredSignal("v1.theme.secondary", "#000000");
	const [tertiaryColor] = createStoredSignal("v1.theme.tertiary", "#737373");

	document.documentElement.style.setProperty("--color-nav", navbarColor());
	document.documentElement.style.setProperty("--color-primary", primaryColor());
	document.documentElement.style.setProperty("--color-secondary", secondaryColor());
	document.documentElement.style.setProperty("--color-tertiary", tertiaryColor());

	return (
		<div class="h-screen overflow-y-scroll">
			<Navbar />
			{props.children}
		</div>
	);
}

import Home from "./routes/home";
import FourOhFour from "./routes/404";
import Settings from "./routes/settings";
import Subscriptions from "./routes/subscriptions";
import Trending from "./routes/trending";
import Watch from "./routes/watch";
import Search from "./routes/search";
import Channel from "./routes/channel";
import { createStoredSignal } from "./lib/store";

render(
	() => (
		<HashRouter root={Layout}>
			<Route path="/" component={Home} />
			<Route path="/home" component={Home} />
			<Route path="/trending" component={Trending} />
			<Route path="/subscriptions" component={Subscriptions} />
			<Route path="/settings" component={Settings} />
			<Route path="/watch" component={Watch} />
			<Route path="/search" component={Search} />
			<Route path="/channel/:id" component={Channel} />
			<Route path="*" component={FourOhFour} />
		</HashRouter>
	),
	document.getElementById("root")!,
);
