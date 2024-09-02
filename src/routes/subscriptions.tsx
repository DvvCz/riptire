import { createResource, Show } from "solid-js";

import { getSubscriptions, getSubscriptionsPage } from "../lib/subs";
import {
	VideoMedium,
	VideoMediumSkeleton,
} from "../components/videos/VideoMedium";

export default function Subscriptions() {
	const [subscriptions] = createResource(
		async () =>
			await getSubscriptionsPage(Object.keys(await getSubscriptions())),
	);

	return (
		<div class="flex flex-row flex-wrap gap-2 p-4">
			<Show
				when={!subscriptions.loading}
				fallback={"abracadabraabracadabra".split("").map((_) => (
					<VideoMediumSkeleton />
				))}
			>
				{(() => {
					const data = subscriptions()!.slice(0, 50);

					if (data.length === 0) {
						return (
							<div class="text-center mx-auto my-auto">
								There's nothing here.
							</div>
						);
					}

					return data.map((vid) => (
						<VideoMedium
							title={vid.title}
							thumb={vid.videoThumbnails?.[0].url}
							views={vid.viewCount}
							published={vid.published}
							url={`/watch?v=${vid.videoId}`}
							duration={vid.lengthSeconds}
							author={vid.author}
						/>
					));
				})()}
			</Show>
		</div>
	);
}
