import React from 'react';
import {AbsoluteFill, interpolate, Sequence, useCurrentFrame} from 'remotion';

export type Beat = {from: number; render: (life: number) => React.ReactNode};

/**
 * Sequential visual blocks inside a scene. Each beat lasts until the next one
 * starts (+ a short overlap) and cross-fades in.
 */
export const Beats: React.FC<{beats: Beat[]; total: number; fade?: number}> = ({beats, total, fade = 12}) => {
	const sorted = [...beats].sort((a, b) => a.from - b.from);
	return (
		<>
			{sorted.map((b, i) => {
				const end = i + 1 < sorted.length ? sorted[i + 1].from + fade : total;
				const life = end - b.from;
				return (
					<Sequence key={i} from={b.from} durationInFrames={Math.max(1, life)} layout="none">
						<FadeIn fade={fade} life={life} last={i === sorted.length - 1}>
							{b.render(life)}
						</FadeIn>
					</Sequence>
				);
			})}
		</>
	);
};

const FadeIn: React.FC<{fade: number; life: number; last: boolean; children: React.ReactNode}> = ({fade, children}) => {
	const f = useCurrentFrame();
	const o = interpolate(f, [0, fade], [0, 1], {extrapolateRight: 'clamp'});
	return <AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill>;
};
