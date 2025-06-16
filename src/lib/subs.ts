import { getInstanceUrl } from "./info";

// These functions are all async to be future proof.

export async function getSubscriptions(): Promise<Record<string, true>> {
	const raw = localStorage.getItem("v1-subscriptions");
	if (raw === null) return {};

	return JSON.parse(raw);
}

async function setSubscriptions(subs: Record<string, true>) {
	localStorage.setItem("v1-subscriptions", JSON.stringify(subs));
}

export async function setSubscribed(id: string, subbed: boolean) {
	const subs = await getSubscriptions();

	if (subbed) {
		subs[id] = true;
	} else {
		delete subs[id];
	}

	await setSubscriptions(subs);
}

/// Given array of subscribed channel ids
/// Returns most recent videos posted.
export async function getSubscriptionsPage(subscribed: string[]) {
	const promises = subscribed.map(async (id) => {
		const res = await fetch(`${getInstanceUrl()}/api/v1/channels/${id}/videos`);
		if (!res.ok) throw "Uh oh";

		const json: {
			videos: {
				title: string;
				videoId: string;
				description: string;
				published: number;
				publishedText: string;

				videoThumbnails: { url: string }[];
				lengthSeconds: number;

				author: string;
				authorThumbnails: { url: string }[];
				authorUrl: string;

				viewCount: number;
				likeCount: number;
				dislikeCount: number;
				subCountText: string;
			}[];
		} = await res.json();

		return json.videos;
	});

	return (await Promise.allSettled(promises))
		.filter((r) => r.status === "fulfilled")
		.flatMap((r) => r.value)
		.sort((a, b) => b.published - a.published);
}
