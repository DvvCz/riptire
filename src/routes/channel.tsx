import { useParams } from "@solidjs/router";
import { createResource, Show } from "solid-js";
import { INSTANCE } from "../lib/info";
import {
	VideoMedium,
	VideoMediumSkeleton,
} from "../components/videos/VideoMedium";
import { formatNum } from "../lib/util";
import { Button } from "@kobalte/core/button";
import { getSubscriptions, setSubscribed } from "../lib/subs";

async function getChannelInfo(id: string) {
	const res = await fetch(`https://${INSTANCE}/api/v1/channels/${id}`);
	if (!res.ok) throw "uh oh";

	const json: {
		author: string;
		authorId: string;
		authorVerified: boolean;
		authorBanners: { url: string }[];
		authorThumbnails: { url: string }[];
		subCount: number;
		description: string;
		latestVideos: {
			title: string;
			videoId: string;
			lengthSeconds: number;
			published: number;
			viewCount: number;
			videoThumbnails: { url: string }[];
		}[];
	} = await res.json();

	return json;
}

// todo: skeleton no longer fits the actual display.. for some reason
function ChannelSkeleton() {
	return (
		<div class="flex flex-col animate-pulse gap-6 px-32 py-4">
			<div class="rounded-xl bg-black/30 h-48 w-full" />

			<div class="flex flex-row gap-4 w-full">
				<div class="rounded-full bg-black/20 size-40" />
				<div class="flex flex-col gap-4 w-5/6">
					<div class="rounded-lg bg-black/20 h-8 w-1/3" />

					<div class="flex flex-row gap-2">
						<div class="rounded-lg bg-black/10 h-5 w-36" />
						<div class="rounded-lg bg-black/20 h-5 w-24" />
						<div class="rounded-lg bg-black/10 h-5 w-20" />
					</div>

					<div class="rounded-lg bg-black/10 h-8 w-2/3" />
				</div>
			</div>

			<div class="mt-16 p-8 flex flex-wrap">
				{[1, 2, 3, 4, 5, 6, 7, 8, 9].map((_) => (
					<VideoMediumSkeleton />
				))}
			</div>
		</div>
	);
}

function Channel(props: {
	name: string;
	desc: string;
	id: string;
	subs: number;
	banner: string;
	avatar: string;
	vids: {
		name: string;
		id: string;
		thumb: string;
		views: number;
		duration: number;
		published: number;
	}[];
}) {
	const [subs, { refetch }] = createResource(
		async () => await getSubscriptions(),
	);

	return (
		<div class="flex flex-col gap-6 px-32 py-4">
			<img src={props.banner} class="rounded-xl drop-shadow-lg h-48 w-full" />

			<div class="flex flex-row gap-4 w-full">
				<img
					src={props.avatar}
					class="rounded-full size-40 drop-shadow-md object-cover"
				/>

				<div class="flex flex-col gap-2 w-5/6">
					<div class="text-4xl font-bold w-1/3">{props.name}</div>

					<div class="flex flex-row text-sm text-black/60 items-center gap-2">
						<span>{props.name}</span>
						<span>{`${formatNum(props.subs)} subscribers`}</span>
						<span>{`${props.vids.length}+ videos`}</span>
					</div>

					<p class="text-sm text-black/60 line-clamp-2">
						{props.desc}
					</p>

					<Show when={!subs.loading}>
						{(() => {
							if (subs()![props.id]) {
								return (
									<Button
										onClick={async () => {
											await setSubscribed(
												props.id,
												false,
											);
											refetch();
										}}
										class="rounded-full w-36 py-3 bg-secondary hover:bg-secondary/90 text-white px-8"
									>
										Subscribed
									</Button>
								);
							} else {
								return (
									<Button
										onClick={async () => {
											await setSubscribed(props.id, true);
											refetch();
										}}
										class="rounded-full w-36 py-3 bg-neutral-800 hover:bg-neutral-800/90 text-white px-8"
									>
										Subscribe
									</Button>
								);
							}
						})()}
					</Show>
				</div>
			</div>

			<div class="mt-16 p-8 flex flex-wrap">
				{props.vids.map((v) => (
					<VideoMedium
						title={v.name}
						url={`/watch?v=${v.id}`}
						thumb={v.thumb}
						views={v.views}
						published={v.published}
						duration={v.duration}
					/>
				))}
			</div>
		</div>
	);
}

export default function Channels() {
	const params = useParams();
	const [data] = createResource(
		() => params.id,
		() => getChannelInfo(params.id),
	);

	return (
		<Show when={!data.loading} fallback={<ChannelSkeleton />}>
			{(() => {
				const channelData = data()!;
				console.log(channelData.authorThumbnails);
				return (
					<Channel
						name={channelData.author}
						id={channelData.authorId}
						desc={channelData.description}
						subs={channelData.subCount}
						banner={channelData.authorBanners?.[0]?.url}
						avatar={
							channelData.authorThumbnails[
								channelData.authorThumbnails.length - 1
							].url
						}
						vids={channelData.latestVideos.map((v) => ({
							name: v.title,
							id: v.videoId,
							thumb: v.videoThumbnails[0].url,
							views: v.viewCount,
							duration: v.lengthSeconds,
							published: v.published,
						}))}
					/>
				);
			})()}
		</Show>
	);
}
