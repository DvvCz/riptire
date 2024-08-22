export function formatNum(n: number) {
	if (n >= 1_000_000_000) {
		return `${Math.floor(n / 1_000_000_000)}B`;
	}

	if (n >= 1_000_000) {
		return `${Math.floor(n / 1_000_000)}M`;
	}

	if (n >= 1_000) {
		return `${Math.floor(n / 1_000)}K`;
	}

	return n.toString();
}

const intl = new Intl.RelativeTimeFormat("en");

export function formatTimeElapsed(elapsed: number) {
	if (elapsed >= (60 * 60 * 24 * 365)) {
		return intl.format(-Math.floor(elapsed / (60 * 60 * 24 * 365)), "years");
	}

	if (elapsed >= (60 * 60 * 24 * 30)) {
		return intl.format(-Math.floor(elapsed / (60 * 60 * 24 * 30)), "months");
	}

	if (elapsed >= (60 * 60 * 24)) {
		return intl.format(-Math.floor(elapsed / (60 * 60 * 24)), "days");
	}

	if (elapsed >= (60 * 60)) {
		return intl.format(-Math.floor(elapsed / (60 * 60)), "hours");
	}

	if (elapsed >= 60) {
		return intl.format(-Math.floor(elapsed / 60), "minutes");
	}

	return intl.format(-elapsed, "seconds");
}

export function formatTime(t: number) {
	if (t >= 60 * 60) {
		const sec = (t % 60).toString().padStart(2, '0');
		const min = (Math.floor(t / 60) % 60).toString().padStart(2, '0');
		const hour = Math.floor(t / (60 * 60));

		return `${hour}:${min}:${sec}`;
	}

	if (t >= 60) {
		const sec = (t % 60).toString().padStart(2, '0');
		const min = Math.floor(t / 60) % 60;

		return `${min}:${sec}`;
	}

	return `00:${t.toString().padStart(2, '0')}`;
}