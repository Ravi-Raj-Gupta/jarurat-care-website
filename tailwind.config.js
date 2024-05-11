/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			gridTemplateColumns: { one_three: '1fr 3fr' }
		}
	},
	plugins: [require('@tailwindcss/typography')]
};
