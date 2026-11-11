import {continueRender, delayRender, staticFile} from 'remotion';
import fonts from './data/fonts.json';

export const C = {
	navy: '#0B1330',
	navyDeep: '#070C20',
	red: '#E63946',
	gold: '#FFC857',
	teal: '#2EC4B6',
	white: '#FFF6E5',
	gray: '#2A3150',
	grayLine: '#4A5276',
	mute: '#9AA0B8',
};

// Montserrat + Playfair Display (Google Fonts, OFL), bundled locally in public/fonts
// so rendering works offline. Cyrillic + Latin subsets.
let loaded = false;
const loadFonts = () => {
	if (loaded || typeof document === 'undefined') return;
	loaded = true;
	const handle = delayRender('Loading local fonts');
	Promise.all(
		fonts.map((f) => {
			const face = new FontFace(f.family, `url(${staticFile(f.file)}) format('woff2')`, {
				weight: f.weight,
				unicodeRange: f.unicodeRange,
				display: 'block',
			});
			document.fonts.add(face);
			return face.load();
		}),
	)
		.then(() => continueRender(handle))
		.catch((e) => {
			console.error(e);
			continueRender(handle);
		});
};
loadFonts();

export const montserrat = 'Montserrat, sans-serif';
export const playfair = '"Playfair Display", serif';
