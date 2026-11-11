import React from 'react';
import {AbsoluteFill, Html5Audio, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {C, montserrat, playfair} from '../theme';
import {Shell} from './common';

/** Channel intro "Другая История": a red line splits into reality (gray) and alternative (teal). */
export const Scene02: React.FC = () => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const draw = interpolate(f, [5, 50], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
	const split = interpolate(f, [45, 95], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
	const t = spring({frame: f - 70, fps, config: {damping: 13}});
	const sub = spring({frame: f - 110, fps, config: {damping: 13}});
	return (
		<Shell tint="#1A1F45">
			<Html5Audio src={staticFile('sfx/whoosh.wav')} volume={0.5} />
			<AbsoluteFill>
				<svg width={1920} height={1080}>
					<line x1={160} y1={700} x2={160 + 800 * draw} y2={700} stroke={C.red} strokeWidth={8} strokeLinecap="round" />
					<path d={`M960 700 C 1150 700, 1250 ${700 - 120 * split}, ${960 + 800 * split} ${700 - 160 * split}`} stroke={C.mute} strokeWidth={8} fill="none" strokeLinecap="round" opacity={split > 0 ? 1 : 0} />
					<path d={`M960 700 C 1150 700, 1250 ${700 + 120 * split}, ${960 + 800 * split} ${700 + 160 * split}`} stroke={C.teal} strokeWidth={8} fill="none" strokeLinecap="round" opacity={split > 0 ? 1 : 0} />
					<circle cx={960} cy={700} r={16 * draw} fill={C.gold} />
				</svg>
				<div style={{position: 'absolute', top: 300, width: '100%', textAlign: 'center', fontFamily: playfair, fontWeight: 900, fontSize: 150, color: C.white, opacity: t, transform: `scale(${0.9 + 0.1 * t})`, letterSpacing: 2}}>
					Другая История
				</div>
				<div style={{position: 'absolute', top: 820, width: '100%', textAlign: 'center', fontFamily: montserrat, fontWeight: 600, fontSize: 40, color: C.gold, opacity: sub}}>
					Что если бы Россия не продала Аляску?
				</div>
			</AbsoluteFill>
		</Shell>
	);
};
