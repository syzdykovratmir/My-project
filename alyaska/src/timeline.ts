import timeline from './data/timeline.json';
import captions from './data/captions.json';

export type Word = {text: string; startMs: number; endMs: number; em: boolean; paraEnd: boolean};
export type SceneInfo = (typeof timeline.scenes)[number];

export const FPS = timeline.fps;
export const TRANSITION = timeline.transition;
export const TOTAL_FRAMES = timeline.totalFrames;
export const SCENES = timeline.scenes;
export const CAPTIONS = captions as Record<string, {durationMs: number; words: Word[]}>;

export const scene = (id: string): SceneInfo => {
	const s = SCENES.find((x) => x.id === id);
	if (!s) throw new Error('No scene ' + id);
	return s;
};

/**
 * Frame (relative to the scene start) where the n-th word containing `needle` starts.
 * Used to sync visuals to the narration.
 */
export const at = (id: string, needle: string, n = 1, shiftSec = 0): number => {
	const s = scene(id);
	const words = CAPTIONS[id]?.words ?? [];
	const low = needle.toLowerCase();
	let count = 0;
	for (const w of words) {
		if (w.text.toLowerCase().includes(low)) {
			count++;
			if (count === n) return s.leadFrames + Math.round((w.startMs / 1000 + shiftSec) * FPS);
		}
	}
	throw new Error(`Anchor "${needle}" #${n} not found in ${id}`);
};

export const sec = (s: number) => Math.round(s * FPS);
