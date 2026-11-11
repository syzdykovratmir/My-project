import React from 'react';
import {interpolate, useCurrentFrame, Easing} from 'remotion';
import {C, montserrat, playfair} from '../theme';

export type Bar = {label: string; value: number; display: string; color?: string; at?: number};

/** Simple animated horizontal bar chart. */
export const Chart: React.FC<{title: string; bars: Bar[]; max: number; note?: string}> = ({title, bars, max, note}) => {
	const frame = useCurrentFrame();
	return (
		<div style={{position: 'absolute', left: 220, top: 230, width: 1480}}>
			<div style={{fontFamily: playfair, fontWeight: 900, fontSize: 56, color: C.white, marginBottom: 50}}>{title}</div>
			{bars.map((b, i) => {
				const p = interpolate(frame, [b.at ?? i * 20, (b.at ?? i * 20) + 40], [0, 1], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
					easing: Easing.out(Easing.cubic),
				});
				return (
					<div key={i} style={{marginBottom: 40, opacity: Math.min(1, p * 3)}}>
						<div style={{fontFamily: montserrat, fontSize: 28, fontWeight: 600, color: C.white, marginBottom: 10}}>{b.label}</div>
						<div style={{display: 'flex', alignItems: 'center', gap: 24}}>
							<div style={{height: 54, width: (b.value / max) * 1100 * p, background: b.color ?? C.gold, borderRadius: 6}} />
							<div style={{fontFamily: montserrat, fontSize: 40, fontWeight: 800, color: b.color ?? C.gold}}>{b.display}</div>
						</div>
					</div>
				);
			})}
			{note ? <div style={{fontFamily: montserrat, fontSize: 20, color: C.mute, marginTop: 10}}>{note}</div> : null}
		</div>
	);
};
