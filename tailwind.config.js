// eslint-disable-next-line @typescript-eslint/no-var-requires
const plugin = require("tailwindcss/plugin");

const em = value => value / 16 + "em";
const rem = value => value / 16 + "rem";

/** @type {import("tailwindcss").Config} */
module.exports = {
	content: ["./src/**/*.{ts,tsx}"],
	theme: {
		screens: {
			sm: em(576),
			md: em(768),
			lg: em(992),
			xl: em(1280),
			xxl: em(1440),
		},
		container: {
			sm: "none",
			md: rem(688),
			lg: rem(912),
			xl: rem(1120),
			xxl: rem(1216),
		},
	},
	plugins: [
		plugin(function ({ addComponents, theme }) {
			const screens = theme("screens", {});
			const containers = theme("container", {});

			const mediaQueries = Object.entries(screens)
				.map(item => {
					const width = containers[item[0]];
					if (width) {
						return { [`@media (min-width: ${item[1]})`]: { ".container": { "max-width": width } } };
					}
				})
				.filter(Boolean);

			addComponents([
				{ ".container": { "margin-left": "auto", "margin-right": "auto", width: "100%" } },
				...mediaQueries,
			]);
		}),
		require("@tailwindcss/forms"),
	],
};
