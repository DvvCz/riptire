/* @refresh reload */
import { render } from "solid-js/web";
import { Route, Router } from "@solidjs/router";

import "./index.css";

import Navbar from "./components/Navbar";

function Layout(props: any) {
	const [navColor] = createStoredSignal("v1.theme.nav", "#FFFFFF");
	const [primColor] = createStoredSignal("v1.theme.primary", "#FFFFFF");
	const [secColor] = createStoredSignal("v1.theme.secondary", "#000000");
	const [terColor] = createStoredSignal("v1.theme.tertiary", "#737373");

	document.documentElement.style.setProperty("--color-nav", navColor());
	document.documentElement.style.setProperty("--color-primary", primColor());
	document.documentElement.style.setProperty("--color-secondary", secColor());
	document.documentElement.style.setProperty("--color-tertiary", terColor());

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
		<Router base="/riptire/" root={Layout}>
			<Route path="/" component={Home} />
			<Route path="/home" component={Home} />
			<Route path="/trending" component={Trending} />
			<Route path="/subscriptions" component={Subscriptions} />
			<Route path="/settings" component={Settings} />
			<Route path="/watch" component={Watch} />
			<Route path="/search" component={Search} />
			<Route path="/channel/:id" component={Channel} />
			<Route path="*" component={FourOhFour} />
		</Router>
	),
	document.getElementById("root")!,
);
