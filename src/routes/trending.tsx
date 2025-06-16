import { Button } from "@kobalte/core/button";
import { createResource, createSignal, Show } from "solid-js";
import VideoLarge, { VideoLargeSkeleton } from "../components/videos/VideoLarge";

import { INSTANCE } from "../lib/info";

const MODES = ["Now", "Music", "Gaming", "Movies"] as const;

async function search(mode: (typeof MODES)[number]) {
	const m = {
		Now: "default",
		Music: "music",
		Gaming: "gaming",
		Movies: "movies",
	}[mode];

	const res = await fetch(`https://${INSTANCE}/api/v1/trending?type=${m}`);
	if (!res.ok) {
		throw new Error("Uh oh");
	}

	const json: {
		title: string;
		author: string;
		authorId: string;
		description: string;
		published: number;
		videoId: string;
		viewCount: number;
		videoThumbnails: { url: string }[];
		lengthSeconds: number;
	}[] = await res.json();

	return json;
}

export default function Trending() {
	const [mode, setMode] = createSignal<(typeof MODES)[number]>("Now");
	const [data, { refetch }] = createResource(() => search(mode()));

	return (
		<div class="flex flex-col w-full items-center">
			<div class="border-b border-b-black/50 items-center flex flex-col gap-4 pt-8 px-8 w-full">
				<div class="flex flex-col gap-4 max-w-(--breakpoint-2xl) w-full">
					<div class="text-4xl font-bold">Trending</div>

					<div class="flex flex-row h-12">
						{MODES.map((m) => {
							return (
								<Button
									onClick={() => {
										setMode(m);
										refetch();
									}}
									class={`${m === mode() && "border-b-black border-b-2"} hover:border-b-2 transition-all duration-100 border-b-secondary flex items-center h-full px-8`}
								>
									{m}
								</Button>
							);
						})}
					</div>
				</div>
			</div>

			<div class="p-8 px-12 flex w-full flex-col max-w-(--breakpoint-2xl) gap-2">
				<Show when={!data.loading} fallback={[1, 2, 3, 4, 5].map((_) => <VideoLargeSkeleton />)}>
					{data()!.map((v) => (
						<VideoLarge
							title={v.title}
							desc={v.description}
							published={v.published}
							author={v.author}
							authorurl={`/channel/${v.authorId}`}
							views={v.viewCount}
							thumb={v.videoThumbnails?.[0].url}
							url={`/watch?v=${v.videoId}`}
							duration={v.lengthSeconds}
						/>
					))}
				</Show>
			</div>
		</div>
	);
}
