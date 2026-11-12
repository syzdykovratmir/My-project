import React from 'react';
import {AbsoluteFill, Html5Audio, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Subtitles} from './components/Subtitles';
import {Background, FilmGrain} from './components/Overlay';
import {CAPTIONS, FPS, scene} from './timeline';
import {C, montserrat, playfair} from './theme';
import {Scene01} from './scenes/Scene01';
import {Scene04} from './scenes/Scene04';
import {Scene07} from './scenes/Scene07';
import {Scene08} from './scenes/Scene08';

const SCENE_COMPONENTS: Record<string, React.FC> = {s01: Scene01, s04: Scene04, s07: Scene07, s08: Scene08};
const MUSIC: Record<string, {file: string; gain: number}> = {
	dreams: {file: 'audio/dreams_become_real.mp3', gain: 0.17},
	americana: {file: 'audio/americana.mp3', gain: 0.075},
	immersed: {file: 'audio/immersed.mp3', gain: 0.12},
};

export type Segment = {scene: string; fromMs: number; toMs: number};
export type ShortDef = {id: string; kicker: string; title: string; music: string; segments: Segment[]};

const GAP = 12; // frames of silence between segments
const END = 2 * FPS; // end card

const segFrames = (s: Segment) => Math.ceil(((s.toMs - s.fromMs) / 1000) * FPS) + GAP;
export const shortDuration = (d: ShortDef) => d.segments.reduce((a, s) => a + segFrames(s), 0) + END;

const FadeIn: React.FC<{children: React.ReactNode}> = ({children}) => {
	const f = useCurrentFrame();
	return <AbsoluteFill style={{opacity: interpolate(f, [0, 10], [0, 1], {extrapolateRight: 'clamp'})}}>{children}</AbsoluteFill>;
};

const Header: React.FC<{kicker: string; title: string}> = ({kicker, title}) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const e = spring({frame: f, fps, config: {damping: 14}});
	return (
		<div style={{position: 'absolute', top: 150, left: 60, right: 60, textAlign: 'center', opacity: e, transform: `translateY(${(1 - e) * 30}px)`}}>
			<div style={{fontFamily: montserrat, fontWeight: 800, fontSize: 34, color: C.gold, letterSpacing: 6}}>{kicker.toUpperCase()}</div>
			<div style={{fontFamily: playfair, fontWeight: 900, fontSize: 86, color: C.white, lineHeight: 1.08, marginTop: 18}}>{title}</div>
		</div>
	);
};

const EndCard: React.FC = () => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const e = spring({frame: f, fps, config: {damping: 14}});
	return (
		<AbsoluteFill style={{background: 'rgba(7,12,32,0.92)', alignItems: 'center', justifyContent: 'center', opacity: e}}>
			<div style={{fontFamily: montserrat, fontWeight: 700, fontSize: 40, color: C.gold, letterSpacing: 4}}>ПОЛНОЕ ВИДЕО — НА КАНАЛЕ</div>
			<div style={{fontFamily: playfair, fontWeight: 900, fontSize: 110, color: C.white, marginTop: 24}}>Другая История</div>
			<div style={{width: 360, height: 6, background: C.red, marginTop: 24}} />
		</AbsoluteFill>
	);
};

/** 1080×1920 YouTube Short: header, the 16:9 scene in the middle, big karaoke subtitles below. */
export const Short: React.FC<{def: ShortDef}> = ({def}) => {
	const total = shortDuration(def);
	let offset = 0;
	const items = def.segments.map((seg, i) => {
		const from = offset;
		const len = segFrames(seg);
		offset += len;
		const sc = scene(seg.scene);
		const Comp = SCENE_COMPONENTS[seg.scene];
		const sceneFrame0 = sc.leadFrames + Math.round((seg.fromMs / 1000) * FPS);
		const words = CAPTIONS[seg.scene].words
			.filter((w) => w.startMs >= seg.fromMs - 20 && w.endMs <= seg.toMs + 20)
			.map((w) => ({...w, startMs: w.startMs - seg.fromMs, endMs: w.endMs - seg.fromMs}));
		return (
			<Sequence key={i} from={from} durationInFrames={len}>
				<FadeIn>
					<div style={{position: 'absolute', left: 0, top: 640, width: 1080, height: 608, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.6)'}}>
						<div style={{width: 1920, height: 1080, transform: 'scale(0.5625)', transformOrigin: '0 0'}}>
							<Sequence from={-sceneFrame0}>
								<Comp />
							</Sequence>
						</div>
					</div>
				</FadeIn>
				<Html5Audio
					src={staticFile(`audio/narration/${seg.scene}.mp3`)}
					trimBefore={Math.round((seg.fromMs / 1000) * FPS)}
					trimAfter={Math.round((seg.toMs / 1000) * FPS) + 6}
				/>
				<Subtitles words={words} maxChars={24} fontSize={62} bottom={420} />
			</Sequence>
		);
	});
	const m = MUSIC[def.music];
	return (
		<AbsoluteFill style={{overflow: 'hidden'}}>
			<Background />
			<Header kicker={def.kicker} title={def.title} />
			{items}
			<Html5Audio
				src={staticFile(m.file)}
				volume={(f) =>
					m.gain *
					interpolate(f, [0, 30], [0, 1], {extrapolateRight: 'clamp'}) *
					interpolate(f, [total - END, total], [1, 2.2], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) *
					interpolate(f, [total - 20, total], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})
				}
			/>
			<Sequence from={total - END}>
				<EndCard />
			</Sequence>
			<FilmGrain opacity={0.05} />
		</AbsoluteFill>
	);
};

export const SHORTS: ShortDef[] = [
	{
		id: 'Short1',
		kicker: 'Другая История · мифы',
		title: 'Аляску сдали в аренду на 99 лет?',
		music: 'dreams',
		segments: [
			{scene: 's01', fromMs: 0, toMs: 7600},
			{scene: 's04', fromMs: 2400, toMs: 38560},
		],
	},
	{
		id: 'Short2',
		kicker: 'Другая История · что если',
		title: 'Если бы Аляска стала советской',
		music: 'immersed',
		segments: [{scene: 's08', fromMs: 26160, toMs: 68720}],
	},
	{
		id: 'Short3',
		kicker: 'Другая История · что если',
		title: 'Золото Клондайка и русская Аляска',
		music: 'americana',
		segments: [{scene: 's07', fromMs: 3280, toMs: 47840}],
	},
];
