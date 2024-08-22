import { formatNum, formatTime, formatTimeElapsed } from "../../lib/util";

export function VideoMediumSkeleton() {
	return (
		<div class="flex flex-col gap-2 w-64 animate-pulse">
			<div class="rounded-xl h-32 w-64 bg-black/40" />

			<div class="flex flex-col gap-1 pb-4">
				<div class="rounded-lg h-4 w-56 bg-black/30 pr-4" />
				<div class="flex flex-row gap-2">
					<div class="rounded-lg h-4 w-16 bg-black/20" />
					<div class="rounded-lg h-4 w-16 bg-black/20" />
				</div>
			</div>
		</div>
	)
}

export function VideoMedium(props: {
	title: string;
	url: string;
	thumb: string;
	views: number;
	published: number;
	duration: number;

	author?: string;
}) {
	const elapsed = Math.floor(Date.now() / 1000) - props.published;

	return (
		<a href={props.url} class="flex flex-col drop-shadow-xl gap-2 w-64">
			<div class="relative w-full">
				<div class="absolute bottom-0 right-7 rounded-lg bg-black/80 text-white font-semibold line-clamp-1 text-xs py-1 px-2 mr-1 mb-1">
					{formatTime(props.duration)}
				</div>

				<img src={props.thumb} class="bg-black rounded-xl h-32 object-cover" />
			</div>

			<div class="flex flex-col gap-1 pb-4">
				<div class="text-md line-clamp-2 font-semibold pr-4">
					{props.title}
				</div>

				{(() => {
					if (props.author) {
						return (
							<div class="text-sm text-black/80">
								{props.author}
							</div>
						)
					}
				})()}

				<div class="flex flex-row text-sm text-black/80 gap-2">
					<span>{`${formatNum(props.views)} views`}</span>
					<span>{formatTimeElapsed(elapsed)}</span>
				</div>
			</div>
		</a>
	);
}