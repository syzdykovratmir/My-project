import React, {useMemo} from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, montserrat} from '../theme';
import type {Word} from '../timeline';

const MAX = 42;
const fits = (txt: string[]) => {
	if (txt.join(' ').length <= MAX) return true;
	for (let k = 1; k < txt.length; k++) {
		if (Math.max(txt.slice(0, k).join(' ').length, txt.slice(k).join(' ').length) <= MAX) return true;
	}
	return false;
};

/** Same paging rules as scripts/build_timeline.py (SRT export). */
export const makePages = (words: Word[]): Word[][] => {
	const res: Word[][] = [];
	let cur: Word[] = [];
	for (const w of words) {
		if (cur.length && !fits([...cur, w].map((x) => x.text))) {
			res.push(cur);
			cur = [];
		}
		cur.push(w);
		const len = cur.map((x) => x.text).join(' ').length;
		if (w.paraEnd || (/[.?!]$/.test(w.text) && len > 38)) {
			res.push(cur);
			cur = [];
		}
	}
	if (cur.length) res.push(cur);
	return res;
};

const splitLines = (ws: Word[]): Word[][] => {
	const txt = ws.map((w) => w.text);
	if (txt.join(' ').length <= MAX) return [ws];
	let best = 1;
	let bestScore = Infinity;
	for (let k = 1; k < txt.length; k++) {
		const sc = Math.max(txt.slice(0, k).join(' ').length, txt.slice(k).join(' ').length);
		if (sc < bestScore) {
			bestScore = sc;
			best = k;
		}
	}
	return [ws.slice(0, best), ws.slice(best)];
};

/**
 * Karaoke subtitles, bottom centre. Current word gold, numbers/dates red & bold,
 * dark rounded backing, spring entrance per page. Frame 0 = narration start.
 */
export const Subtitles: React.FC<{words: Word[]}> = ({words}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const pages = useMemo(() => makePages(words), [words]);
	const ms = (frame / fps) * 1000;
	let idx = -1;
	for (let i = 0; i < pages.length; i++) {
		const start = pages[i][0].startMs;
		const next = pages[i + 1]?.[0].startMs ?? Infinity;
		const end = Math.min(pages[i][pages[i].length - 1].endMs + 700, next);
		if (ms >= start - 60 && ms < end) idx = i;
	}
	if (idx < 0) return null;
	const page = pages[idx];
	const enterFrame = frame - Math.round(((page[0].startMs - 60) / 1000) * fps);
	const e = spring({frame: enterFrame, fps, config: {damping: 15, stiffness: 180, mass: 0.6}});
	return (
		<div style={{position: 'absolute', left: 0, right: 0, bottom: 56, display: 'flex', justifyContent: 'center'}}>
			<div
				style={{
					background: 'rgba(7, 12, 32, 0.82)',
					borderRadius: 18,
					padding: '14px 30px 16px',
					boxShadow: '0 10px 30px rgba(0,0,0,0.45)',
					transform: `translateY(${(1 - e) * 26}px) scale(${0.92 + 0.08 * e})`,
					opacity: Math.min(1, e * 1.4),
					maxWidth: 1500,
				}}
			>
				{splitLines(page).map((line, li) => (
					<div key={li} style={{textAlign: 'center', lineHeight: 1.28, whiteSpace: 'nowrap'}}>
						{line.map((w, wi) => {
							const active = ms >= w.startMs - 40 && ms < w.endMs + 80;
							const color = w.em ? C.red : active ? C.gold : C.white;
							return (
								<span
									key={wi}
									style={{
										fontFamily: montserrat,
										fontSize: 46,
										fontWeight: w.em ? 800 : 700,
										color,
										display: 'inline-block',
										marginRight: wi < line.length - 1 ? '0.34em' : 0,
										transform: active ? 'scale(1.04)' : 'scale(1)',
										textShadow: active && w.em ? '0 0 6px rgba(255,200,87,0.55)' : '0 2px 4px rgba(0,0,0,0.6)',
									}}
								>
									{w.text}
								</span>
							);
						})}
					</div>
				))}
			</div>
		</div>
	);
};
