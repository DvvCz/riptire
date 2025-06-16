export const NAME = "Riptire";

export function validateInstanceUrl(instance: string): boolean {
	if (!instance.startsWith("https://")) {
		return false;
	}

	return true;
}

export function getInstanceUrl() {
	const instance = localStorage.getItem("v1.instance");
	if (instance === null || !validateInstanceUrl(instance)) {
		return "https://invidious.jing.rocks";
	}

	return instance;
}

export function setInstanceUrl(instance: string) {
	if (!validateInstanceUrl(instance)) {
		throw new Error("Invalid instance URL");
	}

	localStorage.setItem("v1.instance", instance);
}
