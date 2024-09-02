import { createResource, Show } from "solid-js";
import VideoLarge, {
	VideoLargeSkeleton,
} from "../components/videos/VideoLarge";
import { A, useSearchParams } from "@solidjs/router";

import { formatNum } from "../lib/util";
import { INSTANCE } from "../lib/info";

function Channel(props: {
	name: string;
	desc: string;
	subs: number;
	avatar: string;
	url: string;
}) {
	return (
		<A
			href={props.url}
			class="h-40 w-8/12 flex flex-row gap-4 p-4 rounded-lg hover:bg-black/10"
		>
			<img
				class="rounded-full drop-shadow-2xl w-2/12 mx-8 bg-black"
				src={props.avatar}
			/>

			<div class="flex flex-col w-8/12">
				<div class="font-bold text-md line-clamp-2">{props.name}</div>

				<div class="text-sm flex flex-row gap-2">
					<span>{`${formatNum(props.subs)} subscribers`}</span>
				</div>

				<div class="text-xs mt-4 flex flex-row gap-2">{props.desc}</div>
			</div>
		</A>
	);
}

function Playlist(props: {
	title: string;
	author: string;
	vids: number;
	thumb: string;
	url: string;
}) {
	return (
		<A
			href={props.url}
			class="h-40 w-8/12 flex flex-row gap-4 p-4 rounded-lg hover:bg-black/10"
		>
			<div
				style={{ "background-image": `url(${props.thumb})` }}
				class="rounded-lg drop-shadow-2xl flex flex-row w-4/12 bg-red-500 bg-cover"
			>
				<div class="flex text-white text-lg flex-col w-1/3 justify-center items-center bg-black/50 rounded-l-lg">
					{props.vids}
				</div>
			</div>

			<div class="flex flex-col w-8/12">
				<div class="font-bold text-md line-clamp-2">{props.title}</div>

				<div class="text-sm flex flex-row gap-2">
					<span>{props.author}</span>
					<span>{`${formatNum(props.vids)} videos`}</span>
				</div>
			</div>
		</A>
	);
}

async function search(query: string) {
	const res = await fetch(`https://${INSTANCE}/api/v1/search?q=${query}`);
	if (!res.ok) {
		throw new Error("uh oh");
	}

	let json: (
		| {
				type: "video";
				title: string;
				author: string;
				authorId: string;
				description: string;
				published: number;
				videoId: string;
				viewCount: number;
				lengthSeconds: number;
				videoThumbnails: { url: string }[];
		  }
		| {
				type: "channel";
				author: string;
				authorId: string;
				authorThumbnails: { url: string }[];
				description: string;
				subCount: number;
		  }
		| {
				type: "playlist";
				title: string;
				playlistThumbnail: string;
				author: string;
				videoCount: number;
				playlistId: string;
		  }
	)[] = await res.json();

	return json;
}

export default function Search() {
	const [searchParams] = useSearchParams();
	const [data] = createResource(() => search(searchParams.q!));

	return (
		<div class="flex flex-col">
			<div class="p-8 px-12 flex flex-col gap-2">
				<Show
					when={!data.loading}
					fallback={[1, 2, 3, 4, 5].map((_) => (
						<VideoLargeSkeleton />
					))}
				>
					{data()!.map(v => {
						if (v.type === "video") {
							return (
								<VideoLarge
									title={v.title}
									desc={v.description}
									author={v.author}
									authorurl={`/channel/${v.authorId}`}
									published={v.published}
									views={v.viewCount}
									thumb={v.videoThumbnails?.[0].url}
									url={`/watch?v=${v.videoId}`}
									duration={v.lengthSeconds}
								/>
							);
						} else if (v.type === "channel") {
							return (
								<Channel
									name={v.author}
									desc={v.description}
									subs={v.subCount}
									avatar={v.authorThumbnails?.[1].url}
									url={`/channel/${v.authorId}`}
								/>
							);
						} else {
							return (
								<Playlist
									title={v.title}
									author={v.author}
									thumb={v.playlistThumbnail}
									vids={v.videoCount}
									url={`/playlists?id=${v.playlistId}`}
								/>
							);
						}
					})}
				</Show>
			</div>
		</div>
	);
}
