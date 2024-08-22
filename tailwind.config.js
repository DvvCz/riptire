// Support custom colors like `bg-surface/50`
// https://github.com/tailwindlabs/tailwindcss/issues/9143#issuecomment-1946755547
function toRgba(variableName) {
  return ({ opacityValue }) => {
    return `color-mix(in srgb, var(${variableName}) calc(${opacityValue} * 100%), transparent)`
  }
}

/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				// Tailwind <alpha-value> breaks on hex values, or something like that
				// Frustrating to get working
				nav: toRgba("--color-nav"),
				primary: toRgba("--color-primary"),
				secondary: toRgba("--color-secondary"),
				tertiary: toRgba("--color-tertiary"),
			},
		}
	},
};
