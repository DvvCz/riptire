import { A, useNavigate } from "@solidjs/router";
import { formatNum, formatTime, formatTimeElapsed } from "../../lib/util";

export function VideoLargeSkeleton() {
	return (
		<div class="h-40 w-8/12 max-w-screen-2xl flex flex-row gap-4 p-4 animate-pulse">
			<div class="rounded-lg h-32 w-3/12 bg-black/20" />

			<div class="flex flex-col gap-2 w-8/12">
				<div class="h-6 w-46 rounded-lg bg-black/30" />

				<div class="w-full flex flex-row items-center gap-2">
					<span class="w-24 h-4 rounded-lg bg-black/20" />
					<span class="w-20 h-4 rounded-lg bg-black/10" />
					<span class="w-20 h-4 rounded-lg bg-black/20" />
				</div>

				<div class="mt-2 h-10 w-5/6 rounded-lg bg-black/20" />
			</div>
		</div>
	);
}

export default function VideoLarge(props: {
	title: string;
	desc: string;
	author: string;
	authorurl: string;
	published: number;
	views: number;
	thumb: string;
	url: string;
	duration: number;
}) {
	const navigate = useNavigate();
	const elapsed = Math.floor(Date.now() / 1000) - props.published;

	return (
		<A
			href={props.url}
			class="h-40 w-8/12 max-w-screen-2xl flex flex-row gap-4 p-4 rounded-lg hover:bg-black/10"
		>
			<div class="relative w-56">
				<div class="absolute bottom-0 right-0 rounded-lg bg-black/80 text-white font-semibold line-clamp-1 text-xs py-1 px-2 mr-1 mb-1">
					{formatTime(props.duration)}
				</div>

				<img
					src={props.thumb}
					class="rounded-xl h-32 object-cover"
					loading="lazy"
				/>
			</div>

			<div class="flex flex-col w-8/12">
				<div class="font-bold text-md line-clamp-2">{props.title}</div>

				<div class="text-sm flex flex-row items-center gap-2">
					<span onClick={() => navigate(props.authorurl)}>
						{props.author}
					</span>
					<span>{`${formatNum(props.views)} views`}</span>·
					<span>{`${formatTimeElapsed(elapsed)}`}</span>
				</div>

				<div class="text-xs mt-4 flex flex-row gap-2">{props.desc}</div>
			</div>
		</A>
	);
}
