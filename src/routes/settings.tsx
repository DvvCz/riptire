import { Switch } from "@kobalte/core/switch";
import { createSignal, createResource, Show } from "solid-js";
import { createStoredSignal } from "../lib/store";
import { getSubscriptions } from "../lib/subs";
import { Button } from "@kobalte/core/button";

const SECTIONS = [
	"Appearance",
	"Performance",
	"Subscriptions",
	"Permissions",
] as const;

export default function Settings() {
	const [section, setSection] =
		createSignal<(typeof SECTIONS)[number]>("Appearance");

	return (
		<div class="flex flex-row gap-4 h-full p-8">
			<div class="w-64 p-8 min-h-max rounded-lg bg-black/10 drop-shadow-lg flex flex-col">
				{SECTIONS.map((s) => (
					<button
						class={`rounded-lg border-px border-black py-4 px-8 ${s == section() && "bg-black/20"}`}
						onClick={() => setSection(s)}
					>
						{s}
					</button>
				))}
			</div>

			<div class="w-full p-8 h-full rounded-lg bg-black/10">
				{(() => {
					switch (section()) {
						case "Appearance": {
							const [checked, setChecked] = createStoredSignal(
								"..test",
								true,
							);

							const [navColor, setNavColor] = createStoredSignal(
								"v1.theme.nav",
								"#FFFFFF",
							);
							const [primColor, setPrimColor] =
								createStoredSignal(
									"v1.theme.primary",
									"#FFFFFF",
								);
							const [secColor, setSecColor] = createStoredSignal(
								"v1.theme.secondary",
								"#000000",
							);
							const [terColor, setTerColor] = createStoredSignal(
								"v1.theme.tertiary",
								"#4F4F4F",
							);

							return (
								<div class="flex flex-row gap-4">
									<div class="flex flex-col items-center rounded-lg bg-black/10 w-1/3 p-4 gap-4">
										<span class="text-lg font-semibold mb-6">
											Theme
										</span>

										<div class="flex flex-row justify-between w-full items-center">
											<span id="color-nav">Navbar</span>
											<input
												aria-labelledby="color-nav"
												type="color"
												class="border-none size-12 bg-transparent"
												value={navColor()}
												onInput={(t) => {
													setNavColor(
														t.currentTarget.value,
													);
													document.documentElement.style.setProperty(
														"--color-nav",
														t.currentTarget.value,
													);
												}}
											/>
										</div>

										<div class="flex flex-row justify-between w-full items-center">
											<span id="color-prim">Primary</span>
											<input
												aria-labelledby="color-prim"
												type="color"
												class="border-none size-12 bg-transparent"
												value={primColor()}
												onInput={(t) => {
													setPrimColor(
														t.currentTarget.value,
													);
													document.documentElement.style.setProperty(
														"--color-primary",
														t.currentTarget.value,
													);
												}}
											/>
										</div>

										<div class="flex flex-row justify-between w-full items-center">
											<span id="color-sec">
												Secondary
											</span>
											<input
												aria-labelledby="color-sec"
												type="color"
												class="border-none size-12 bg-transparent"
												value={secColor()}
												onInput={(t) => {
													setSecColor(
														t.currentTarget.value,
													);
													document.documentElement.style.setProperty(
														"--color-secondary",
														t.currentTarget.value,
													);
												}}
											/>
										</div>

										<div class="flex flex-row justify-between w-full items-center">
											<span id="color-tert">
												Tertiary
											</span>
											<input
												aria-labelledby="color-tert"
												type="color"
												class="border-none size-12 bg-transparent"
												value={terColor()}
												onInput={(t) => {
													setTerColor(
														t.currentTarget.value,
													);
													document.documentElement.style.setProperty(
														"--color-tertiary",
														t.currentTarget.value,
													);
												}}
											/>
										</div>
									</div>

									<div class="flex flex-col items-center rounded-lg bg-black/10 w-1/3 p-4 gap-4">
										<span class="text-lg font-semibold mb-6">
											Switches
										</span>

										<Switch
											checked={checked()}
											onChange={setChecked}
											class="flex flex-row justify-between w-full items-center"
										>
											<Switch.Label>Switch</Switch.Label>
											<Switch.Input />
											<Switch.Control class="border-px bg-black/20 border-black data-[checked]:bg-green-500 rounded-full w-16">
												<Switch.Thumb class="transition-all duration-200 data-[checked]:translate-x-full bg-white size-8 rounded-full" />
											</Switch.Control>
										</Switch>
									</div>
								</div>
							);
						}

						case "Performance": {
							return "";
						}

						case "Subscriptions": {
							const [subs] = createResource(getSubscriptions);

							return (
								<div class="flex p-8 justify-center items-center">
									<div class="flex flex-col gap-10">
										<div class="flex flex-col gap-4">
											<div class="text-center font-bold text-xl">
												Current subscriptions{" "}
												{!subs.loading &&
													`(${Object.keys(subs()!).length})`}
											</div>

											<Show
												when={!subs.loading}
												fallback={
													<div> Loading... </div>
												}
											>
												{(() => {
													const data = subs()!;

													const ids =
														Object.keys(data);
													if (ids.length === 0) {
														return (
															<div class="text-center">
																Nothing here.
															</div>
														);
													}

													return (
														<div class="flex flex-col w-full gap-8 items-center">
															<textarea
																class="rounded-lg resize-none border-black drop-shadow-md outline-none p-4"
																value={ids.join(
																	"\n",
																)}
																rows={10}
																cols={60}
																readonly
															/>

															<div class="flex flex-row gap-8">
																<Button
																	class="bg-black/80 text-nowrap active:bg-black/70 py-2 px-8 text-white font-semibold rounded-lg"
																	onClick={async () =>
																		await navigator.clipboard.writeText(
																			ids.join(
																				"\n",
																			),
																		)
																	}
																>
																	Copy to
																	clipboard
																</Button>

																<Button class="bg-black/80 text-nowrap active:bg-black/70 py-2 px-8 text-white font-semibold rounded-lg">
																	Import
																</Button>
															</div>
														</div>
													);
												})()}
											</Show>
										</div>
									</div>
								</div>
							);
						}

						case "Permissions": {
							// "Family Friendly" lock w/ isFamilyFriendly
							// Disable comments
							return "tbd";
						}
					}
				})()}
			</div>
		</div>
	);
}
