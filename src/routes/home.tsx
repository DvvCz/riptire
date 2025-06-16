import { NAME } from "../lib/info";

export default function Home() {
	return (
		<>
			<div class="p-48 bg-(--color-primary) flex flex-col justify-center items-center">
				<div class="text-(--color-primary) font-bold text-6xl bg-(--color-secondary) p-8 rounded-lg [text-shadow:0_3px_0_rgb(0_0_0/40%)] text-center drop-shadow-xl">
					{NAME}
				</div>

				<div class="mt-8 text-(--color-secondary) text-2xl">
					A speedy invidious client for low end devices.
				</div>
			</div>
		</>
	)
}