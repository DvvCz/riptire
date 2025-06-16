import { useSearchParams } from "@solidjs/router";
import VideoSmall, { VideoSmallSkeleton } from "../components/videos/VideoSmall";

import { INSTANCE } from "../lib/info";
import { createResource, createSignal } from "solid-js";
import { Show } from "solid-js";
import { Button } from "@kobalte/core/button";
import { IoShare, IoThumbsDown, IoThumbsUp, IoThumbsUpOutline } from "solid-icons/io";
import { Separator } from "@kobalte/core/separator";

import { formatNum, formatTimeElapsed } from "../lib/util";
import { getSubscriptions, setSubscribed } from "../lib/subs";

function VideoInfoSkeleton() {
	return (
		<div class="flex flex-col w-full animate-pulse gap-2 min-h-64">
			<div class="rounded-lg bg-black/20 h-6 w-96" />

			<div class="flex flex-row gap-2 h-1/3">
				<div class="bg-black/30 rounded-full size-12" />
				<div class="flex flex-col gap-2">
					<div class="rounded-lg bg-black/20 h-4 w-20" />
					<div class="rounded-lg bg-black/20 h-4 w-24" />
				</div>
			</div>

			<div class="mt-4 rounded-xl bg-black/20 w-full h-24" />
		</div>
	);
}

function VideoInfo(props: {
	title: string;
	description: string;
	published: string;

	author: string;
	authorId: string;
	authorUrl: string;
	authorAvatar: string;

	likes: number;
	views: number;
	subs: string;
}) {
	const fmt = new Intl.NumberFormat("en");
	const [subs, { refetch }] = createResource(getSubscriptions);
	const [showDescription, setShowDescription] = createSignal(false);

	return (
		<div class="flex flex-col w-full gap-2 min-h-64">
			<div class="font-bold text-lg line-clamp-1">{props.title}</div>

			<div class="flex flex-row gap-4">
				<a href={props.authorUrl} class="flex flex-row gap-2 w-1/4 rounded-full h-1/3">
					<img src={props.authorAvatar} alt="author avatar" class="rounded-full drop-shadow-md size-10" />

					<div class="flex flex-col">
						<div class="font-semibold line-clamp-1">{props.author}</div>

						<div class="text-xs text-black/50">{`${props.subs} subscribers`}</div>
					</div>
				</a>

				<Show
					when={!subs.loading}
					fallback={
						<Button class="rounded-full bg-neutral-800 hover:bg-neutral-800/90 text-white px-8">Subscribe</Button>
					}
				>
					{(() => {
						if (subs()![props.authorId]) {
							return (
								<Button
									onClick={async () => {
										await setSubscribed(props.authorId, false);
										refetch();
									}}
									class="rounded-full bg-neutral-800 hover:bg-neutral-800/90 text-white px-8"
								>
									Subscribed
								</Button>
							);
						}

						return (
							<Button
								onClick={async () => {
									await setSubscribed(props.authorId, true);
									refetch();
								}}
								class="rounded-full bg-neutral-800 hover:bg-neutral-800/90 text-white px-8"
							>
								Subscribe
							</Button>
						);
					})()}
				</Show>

				<div class="ml-24 flex flex-row items-center rounded-full bg-tertiary text-white font-semibold">
					<Button class="rounded-l-full h-full items-center flex flex-row gap-4 px-4 hover:bg-tertiary/90">
						<IoThumbsUp class="text-xl" /> {formatNum(props.likes)}
					</Button>
					{/* todo: due to a ?bug?, separator has a white pixel at the top. so can't be any other color. */}
					<Separator class="bg-white h-2/3 w-px" orientation="vertical" />
					<Button class="rounded-r-full flex h-full items-center px-4 hover:bg-tertiary/90">
						<IoThumbsDown class="text-xl" />
					</Button>
				</div>

				<Button class="rounded-full flex flex-row justify-center items-center gap-2 bg-neutral-800 transition-all duration-75 hover:bg-neutral-800/90 text-white px-4">
					<IoShare class="text-xl" />
					Share
				</Button>
			</div>

			<div class="mt-4 rounded-xl drop-shadow-xl bg-secondary/10 w-full p-2">
				<div class="flex flex-row items-center gap-4 text-base font-medium">
					<span>{`${fmt.format(props.views)} views`}</span>
					<span>{props.published}</span>
				</div>

				<div class="mb-4 flex flex-col">
					<div class={`${!showDescription() ? "line-clamp-2" : ""} text-sm`}>{props.description}</div>

					<Button onClick={() => setShowDescription((t) => !t)}>{showDescription() ? "Show less" : "Show more"}</Button>
				</div>
			</div>
		</div>
	);
}

async function getVideoInfo(id: string) {
	const res = await fetch(`https://${INSTANCE}/api/v1/videos/${id}`);
	if (!res.ok) {
		throw "Uh oh";
	}

	const json: {
		title: string;
		description: string;
		publishedText: string;

		author: string;
		authorId: string;
		authorThumbnails: { url: string }[];
		authorUrl: string;

		viewCount: number;
		likeCount: number;
		dislikeCount: number;
		subCountText: string;
		lengthSeconds: number;

		recommendedVideos: {
			title: string;
			author: string;
			videoId: string;
			lengthSeconds: number;
			viewCount: number;
			viewCountText: string;
			videoThumbnails: { url: string }[];
		}[];
	} = await res.json();

	return json;
}

function CommentSkeleton() {
	return (
		<div class="animate-pulse flex flex-row gap-2 w-full">
			<div class="rounded-full bg-black/20 size-10" />
			<div class="flex flex-col gap-1 w-full">
				<div class="flex flex-row gap-4">
					<div class="rounded-full bg-black/10 h-3 w-24" />
					<div class="rounded-full bg-black/30 h-3 w-12" />
				</div>

				<div class="rounded-full bg-black/20 h-4 w-5/6" />
				<div class="rounded-full bg-black/10 h-4 w-36" />
			</div>
		</div>
	);
}

function Comment(props: {
	author: string;
	content: string;
	published: number;
	likes: number;
	avatar: string;
}) {
	const elapsed = Math.floor(Date.now() / 1000) - props.published;

	return (
		<div class="flex flex-row gap-4">
			<img src={props.avatar} alt="avatar" class="rounded-full drop-shadow-md object-cover size-10" />

			<div class="flex flex-col gap-1">
				<div class="flex flex-row gap-4">
					<div class="text-xs font-semibold">{props.author}</div>

					<div class="text-xs text-black/50">{formatTimeElapsed(elapsed)}</div>
				</div>

				<div class="text-sm">{props.content}</div>

				<div class="flex flex-row gap-2 items-center text-black/70 text-xs font-semibold">
					<IoThumbsUpOutline class="text-lg" />
					{formatNum(props.likes)}
				</div>
			</div>
		</div>
	);
}

async function getComments(id: string) {
	const res = await fetch(`https://${INSTANCE}/api/v1/comments/${id}`);
	if (!res.ok) {
		throw "Failed to fetch comments";
	}

	const json: {
		commentCount: number;
		comments: {
			author: string;
			authorThumbnails: { url: string }[];
			published: number;
			content: string;
			likeCount: number;
		}[];
	} = await res.json();

	return json;
}

export default function Watch() {
	const [searchParams, setSearchParams] = useSearchParams();

	const [videoData, { refetch: refetchVideoInfo }] = createResource(
		() => searchParams.v,
		() => getVideoInfo(searchParams.v! as string),
	);

	const [commentData, { refetch: refetchComments }] = createResource(
		() => searchParams.v,
		() => getComments(searchParams.v! as string),
	);

	const swapVideo = (id: string) => {
		setSearchParams({ v: id });
		refetchVideoInfo();
		refetchComments();
	};

	return (
		<div class="p-8 flex flex-row justify-center gap-2">
			<div class="flex flex-col w-8/12 max-w-6xl gap-4 h-full rounded-lg">
				<video class="outline-hidden rounded-lg bg-black/80 drop-shadow-xl" controls autoplay>
					<source src={`https://${INSTANCE}/latest_version?id=${searchParams.v!}&itag=18`} type="video/mp4" />
					<track kind="captions" src="" lang="en" label="English captions" />
				</video>

				<Show when={!videoData.loading} fallback={<VideoInfoSkeleton />}>
					{(() => {
						const json = videoData()!;
						return (
							<VideoInfo
								title={json.title}
								description={json.description}
								published={json.publishedText}
								author={json.author}
								authorId={json.authorId}
								authorUrl={json.authorUrl}
								authorAvatar={json.authorThumbnails[0].url}
								likes={json.likeCount}
								views={json.viewCount}
								subs={json.subCountText}
							/>
						);
					})()}
				</Show>

				<div class="flex flex-col gap-12 min-h-96 rounded-xl">
					<div class="text-lg font-bold">
						<Show when={!commentData.loading} fallback={"Comments"}>
							{`${commentData()!.commentCount} Comments`}
						</Show>
					</div>

					<div class="flex flex-col gap-6">
						<Show when={!commentData.loading} fallback={[1, 2, 3, 4, 5, 6].map((_) => <CommentSkeleton />)}>
							{(() => {
								const json = commentData()!;
								return json.comments.map((c) => (
									<Comment
										author={c.author}
										content={c.content}
										published={c.published}
										likes={c.likeCount}
										avatar={c.authorThumbnails?.[0].url}
									/>
								));
							})()}
						</Show>
					</div>
				</div>
			</div>

			<div class="rounded-lg w-4/12 max-w-3xl flex flex-col gap-2 p-8">
				<Show when={!videoData.loading} fallback={[1, 2, 3, 4, 5, 6].map(() => <VideoSmallSkeleton />)}>
					{(() => {
						const json = videoData()!;
						return json.recommendedVideos.map((v) => (
							<VideoSmall
								onClick={() => swapVideo(v.videoId)}
								title={v.title}
								author={v.author}
								views={v.viewCount}
								thumb={v.videoThumbnails[0].url}
								url={`/watch?v=${v.videoId}`}
								duration={v.lengthSeconds}
							/>
						));
					})()}
				</Show>
			</div>
		</div>
	);
}
