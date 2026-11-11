import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {montserrat, playfair} from '../theme';
import {Tag} from './Overlay';

/** Mock newspaper "from the other reality". Always labelled as reconstruction. */
export const Newspaper: React.FC<{name: string; date: string; headline: string; lead: string; life?: number}> = ({
	name,
	date,
	headline,
	lead,
	life = 240,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const e = spring({frame, fps, config: {damping: 12, mass: 0.8}});
	const rot = interpolate(e, [0, 1], [-14, -2.5]);
	const zoom = interpolate(frame, [0, life], [1, 1.07], {extrapolateRight: 'clamp'});
	return (
		<>
			<div
				style={{
					position: 'absolute',
					left: 460,
					top: 140,
					width: 1000,
					height: 700,
					background: 'linear-gradient(160deg, #EFE6CF 0%, #E2D6B6 100%)',
					boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
					transform: `rotate(${rot}deg) scale(${(0.6 + 0.4 * e) * zoom})`,
					opacity: e,
					padding: '36px 48px',
					color: '#1E1A14',
				}}
			>
				<div style={{fontFamily: playfair, fontWeight: 900, fontSize: 72, textAlign: 'center', letterSpacing: 2}}>{name}</div>
				<div style={{borderTop: '3px solid #1E1A14', borderBottom: '1px solid #1E1A14', margin: '10px 0 20px', padding: '6px 0', display: 'flex', justifyContent: 'space-between', fontFamily: montserrat, fontSize: 20, fontWeight: 600}}>
					<span>{date}</span>
					<span>Ново-Архангельскъ</span>
					<span>Цѣна 5 коп.</span>
				</div>
				<div style={{fontFamily: playfair, fontWeight: 900, fontSize: 64, lineHeight: 1.05, textAlign: 'center', margin: '20px 0'}}>{headline}</div>
				<div style={{fontFamily: playfair, fontSize: 30, lineHeight: 1.45, textAlign: 'center', padding: '0 30px'}}>
					{lead}
				</div>
			</div>
			<Tag text="Реконструкция · вымышленная газета" />
		</>
	);
};
