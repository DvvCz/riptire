import { A } from "@solidjs/router";
import { formatNum, formatTime } from "../../lib/util";

export function VideoSmallSkeleton() {
	return (
		<div class="h-24 animate-pulse flex flex-row gap-2">
			<div class="rounded-lg w-5/12 max-w-48 bg-black/30" />

			<div class="flex flex-col gap-1 w-7/12">
				<div class="h-4 w-36 rounded-lg bg-black/20" />
				<div class="h-4 w-12 rounded-lg bg-black/10" />

				<div class="flex flex-row gap-2">
					<div class="h-4 w-12 rounded-lg bg-black/10" />
					<div class="h-4 w-16 rounded-lg bg-black/10" />
				</div>
			</div>
		</div>
	);
}

export default function VideoSmall(props: {
	onClick?: () => void;
	title: string;
	author: string;
	views: number;
	thumb: string;
	url: string;
	duration: number;
}) {
	return (
		<A href={props.url} class="h-24 flex flex-row rounded-lg hover:bg-black/10 gap-2">
			<div
				style={{ "background-image": `url(${props.thumb})` }}
				class="rounded-lg drop-shadow-2xl w-5/12 max-w-md flex justify-end items-end bg-cover"
			>
				<div class="rounded-lg bg-black/80 text-white font-semibold line-clamp-1 text-xs py-1 px-2 mr-1 mb-1">
					{formatTime(props.duration)}
				</div>
			</div>

			<div class="flex flex-col w-7/12">
				<div class="font-semibold text-sm line-clamp-2">{props.title}</div>

				<div class="text-xs">{props.author}</div>

				<div class="text-xs flex flex-row gap-2">
					<span>{`${formatNum(props.views)} views`}</span>
				</div>
			</div>
		</A>
	);
}
