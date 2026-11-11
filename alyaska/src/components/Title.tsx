import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, montserrat, playfair} from '../theme';

/** Big chapter title card: red number, title, sub-line (channel style). */
export const Title: React.FC<{num?: string; title: string; sub?: string; color?: string; size?: number}> = ({
	num,
	title,
	sub,
	color = C.red,
	size = 84,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const e = spring({frame, fps, config: {damping: 14}});
	const e2 = spring({frame: frame - 8, fps, config: {damping: 14}});
	const line = interpolate(frame, [6, 30], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return (
		<div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
			{num ? (
				<div style={{fontFamily: playfair, fontWeight: 900, fontSize: 150, color, lineHeight: 1, transform: `scale(${e})`}}>{num}</div>
			) : null}
			<div
				style={{
					fontFamily: montserrat,
					fontWeight: 800,
					fontSize: size,
					color: C.white,
					letterSpacing: 2,
					textAlign: 'center',
					marginTop: 16,
					opacity: e2,
					transform: `translateY(${(1 - e2) * 30}px)`,
					maxWidth: 1600,
				}}
			>
				{title.toUpperCase()}
			</div>
			<div style={{width: 360 * line, height: 4, background: color, marginTop: 26, borderRadius: 2}} />
			{sub ? (
				<div style={{fontFamily: montserrat, fontWeight: 600, fontSize: 32, color: C.gold, marginTop: 22, opacity: e2}}>{sub}</div>
			) : null}
		</div>
	);
};
