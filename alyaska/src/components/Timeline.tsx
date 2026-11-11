import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {C, montserrat, playfair} from '../theme';

export type TLItem = {year: string; label: string; at: number; color?: string};

/** Horizontal timeline; the line grows and ticks pop in at their frames. */
export const Timeline: React.FC<{items: TLItem[]; from: number; to: number; y?: number; title?: string}> = ({
	items,
	from,
	to,
	y = 470,
	title,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const x0 = 170;
	const x1 = 1750;
	const pos = (yr: number) => x0 + ((yr - from) / (to - from)) * (x1 - x0);
	const grow = interpolate(frame, [0, 40], [0, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
	return (
		<div style={{position: 'absolute', inset: 0}}>
			{title ? (
				<div style={{position: 'absolute', top: 170, width: '100%', textAlign: 'center', fontFamily: playfair, fontWeight: 900, fontSize: 64, color: C.white}}>
					{title}
				</div>
			) : null}
			<div style={{position: 'absolute', left: x0, top: y, height: 4, width: (x1 - x0) * grow, background: C.red, borderRadius: 2}} />
			{items.map((it, i) => {
				const e = spring({frame: frame - it.at, fps, config: {damping: 13}});
				if (frame < it.at) return null;
				const x = pos(parseInt(it.year, 10));
				const up = i % 2 === 0;
				return (
					<div key={i} style={{position: 'absolute', left: x, top: y + 2, opacity: e}}>
						<div style={{position: 'absolute', left: -11, top: -11, width: 22, height: 22, borderRadius: 11, background: it.color ?? C.gold, border: `4px solid ${C.navyDeep}`, transform: `scale(${e})`}} />
						<div
							style={{
								position: 'absolute',
								left: -1,
								top: up ? -110 * e : 14,
								width: 2,
								height: 96 * e,
								background: 'rgba(255,246,229,0.35)',
							}}
						/>
						<div
							style={{
								position: 'absolute',
								transform: 'translateX(-50%)',
								top: up ? -190 : 120,
								textAlign: 'center',
								fontFamily: montserrat,
								width: 300,
							}}
						>
							<div style={{fontSize: 44, fontWeight: 800, color: it.color ?? C.gold}}>{it.year}</div>
							<div style={{fontSize: 22, fontWeight: 600, color: C.white, marginTop: 4}}>{it.label}</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};
