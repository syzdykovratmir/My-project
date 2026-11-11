// Render preview stills for QA: node scripts/stills.mjs <outDir> <scale> <frame> [frame...]
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';

const [outDir, scale, ...frames] = process.argv.slice(2);
const browserExecutable = '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const comp = process.env.COMP ?? 'Video';
const composition = await selectComposition({serveUrl, id: comp, browserExecutable});
for (const f of frames) {
	await renderStill({
		serveUrl,
		composition,
		frame: Number(f),
		output: path.join(outDir, `${comp}-${String(f).padStart(5, '0')}.png`),
		scale: Number(scale),
		browserExecutable,
	});
	console.log('frame', f);
}
