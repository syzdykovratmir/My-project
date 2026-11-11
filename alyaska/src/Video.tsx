import React, {useMemo} from 'react';
import {AbsoluteFill, Html5Audio, interpolate, Sequence, staticFile} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {slide} from '@remotion/transitions/slide';
import {wipe} from '@remotion/transitions/wipe';
import {Subtitles} from './components/Subtitles';
import {CAPTIONS, FPS, SCENES, TOTAL_FRAMES, TRANSITION} from './timeline';
import {Scene01} from './scenes/Scene01';
import {Scene02} from './scenes/Scene02';
import {Scene03} from './scenes/Scene03';
import {Scene04} from './scenes/Scene04';
import {Scene05} from './scenes/Scene05';
import {Scene06} from './scenes/Scene06';
import {Scene07} from './scenes/Scene07';
import {Scene08} from './scenes/Scene08';
import {Scene09} from './scenes/Scene09';
import {Scene10} from './scenes/Scene10';
import {Scene11} from './scenes/Scene11';

const COMPONENTS: Record<string, React.FC> = {
	s01: Scene01, s02: Scene02, s03: Scene03, s04: Scene04, s05: Scene05, s06: Scene06,
	s07: Scene07, s08: Scene08, s09: Scene09, s10: Scene10, s11: Scene11,
};

// transition style per boundary (all 0.5 s)
const PRESENTATIONS = [fade(), slide({direction: 'from-right'}), fade(), wipe({direction: 'from-left'}), fade(), slide({direction: 'from-bottom'}), wipe({direction: 'from-right'}), slide({direction: 'from-right'}), fade(), fade()];

/* ---- music: gain so that music sits 22 dB under the voice (-20.6 LUFS) during speech ---- */
const MUSIC = {
	dreams: {file: 'audio/dreams_become_real.mp3', duck: 0.123},
	americana: {file: 'audio/americana.mp3', duck: 0.052},
	immersed: {file: 'audio/immersed.mp3', duck: 0.088},
};
const OPEN = 3.16; // +10 dB when nobody is speaking

/** Global speech intervals [startFrame, endFrame] built from word timings. */
const speechIntervals = (): [number, number][] => {
	const out: [number, number][] = [];
	for (const s of SCENES) {
		const c = CAPTIONS[s.id];
		if (!c || s.narrationFrom === null) continue;
		for (const w of c.words) {
			const a = s.narrationFrom + (w.startMs / 1000) * FPS;
			const b = s.narrationFrom + (w.endMs / 1000) * FPS;
			const last = out[out.length - 1];
			if (last && a - last[1] < 0.7 * FPS) last[1] = Math.max(last[1], b);
			else out.push([a, b]);
		}
	}
	return out;
};

const duckAmount = (f: number, iv: [number, number][]) => {
	// 0 = full duck (speech), 1 = open. Ramps 0.35 s before/after speech.
	const ramp = 0.35 * FPS;
	let d = Infinity;
	for (const [a, b] of iv) {
		if (f >= a && f <= b) return 0;
		d = Math.min(d, f < a ? a - f : f - b);
		if (a > f + ramp) break;
	}
	return Math.min(1, d / ramp);
};

export const Video: React.FC = () => {
	const iv = useMemo(speechIntervals, []);
	const musicBlocks = useMemo(() => {
		const blocks: {key: keyof typeof MUSIC; from: number; to: number}[] = [];
		for (const s of SCENES) {
			const key = s.music as keyof typeof MUSIC;
			const last = blocks[blocks.length - 1];
			if (last && last.key === key) last.to = s.from + s.durationInFrames;
			else blocks.push({key, from: s.from, to: s.from + s.durationInFrames});
		}
		return blocks;
	}, []);

	return (
		<AbsoluteFill style={{background: '#070C20'}}>
			<TransitionSeries>
				{SCENES.flatMap((s, i) => {
					const Comp = COMPONENTS[s.id];
					const items = [
						<TransitionSeries.Sequence key={s.id} durationInFrames={s.durationInFrames}>
							<Comp />
						</TransitionSeries.Sequence>,
					];
					if (i < SCENES.length - 1)
						items.push(
							<TransitionSeries.Transition
								key={s.id + 't'}
								presentation={PRESENTATIONS[i] as any}
								timing={linearTiming({durationInFrames: TRANSITION})}
							/>,
						);
					return items;
				})}
			</TransitionSeries>

			{/* narration + karaoke subtitles */}
			{SCENES.filter((s) => s.narrationFrom !== null).map((s) => (
				<Sequence key={'n' + s.id} from={s.narrationFrom!} durationInFrames={s.audioFrames + FPS}>
					<Html5Audio src={staticFile(`audio/narration/${s.id}.mp3`)} />
					<Subtitles words={CAPTIONS[s.id].words} />
				</Sequence>
			))}

			{/* whoosh on every transition */}
			{SCENES.slice(1).map((s) => (
				<Sequence key={'w' + s.id} from={Math.max(0, s.from - 6)} durationInFrames={30}>
					<Html5Audio src={staticFile('sfx/whoosh.wav')} volume={0.35} />
				</Sequence>
			))}

			{/* music with ducking, fade in at start, crossfades, fade out at the end */}
			{musicBlocks.map((b, i) => {
				const from = Math.max(0, b.from - (i === 0 ? 0 : 30));
				const dur = b.to - from + (i === musicBlocks.length - 1 ? 0 : 30);
				const m = MUSIC[b.key];
				return (
					<Sequence key={'m' + i} from={from} durationInFrames={dur}>
						<Html5Audio
							src={staticFile(m.file)}
							volume={(f) => {
								const g = from + f;
								const edgeIn = interpolate(f, [0, i === 0 ? 2 * FPS : FPS], [0, 1], {extrapolateRight: 'clamp'});
								const fadeOutLen = i === musicBlocks.length - 1 ? 5 * FPS : FPS;
								const edgeOut = interpolate(f, [dur - fadeOutLen, dur], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
								const open = duckAmount(g, iv);
								return m.duck * (1 + (OPEN - 1) * open) * edgeIn * edgeOut;
							}}
						/>
					</Sequence>
				);
			})}
		</AbsoluteFill>
	);
};

export const VIDEO_FRAMES = TOTAL_FRAMES;
