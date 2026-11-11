import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, montserrat, playfair} from '../theme';

export type CardItem = {title: string; text?: string; at?: number; color?: string; big?: string};

/** Grid of info cards popping in at their frames. */
export const Cards: React.FC<{items: CardItem[]; cols?: number; heading?: string; top?: number; tag?: string}> = ({
	items,
	cols = 2,
	heading,
	top = 190,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const w = cols === 4 ? 380 : cols === 3 ? 500 : 700;
	return (
		<div style={{position: 'absolute', left: 0, right: 0, top, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
			{heading ? (
				<div style={{fontFamily: playfair, fontWeight: 900, fontSize: 60, color: C.white, marginBottom: 40, textAlign: 'center'}}>{heading}</div>
			) : null}
			<div style={{display: 'flex', flexWrap: 'wrap', gap: 30, justifyContent: 'center', width: cols * (w + 30)}}>
				{items.map((it, i) => {
					const e = spring({frame: frame - (it.at ?? i * 12), fps, config: {damping: 14}});
					const drift = interpolate(frame, [0, 600], [0, -8]);
					return (
						<div
							key={i}
							style={{
								width: w,
								minHeight: 150,
								background: 'rgba(17, 26, 60, 0.92)',
								borderLeft: `8px solid ${it.color ?? C.gold}`,
								borderRadius: 12,
								padding: '24px 28px',
								boxShadow: '0 16px 40px rgba(0,0,0,0.4)',
								opacity: e,
								transform: `translateY(${(1 - e) * 40 + drift}px) scale(${0.95 + 0.05 * e})`,
								fontFamily: montserrat,
							}}
						>
							{it.big ? <div style={{fontSize: 54, fontWeight: 800, color: it.color ?? C.gold, lineHeight: 1}}>{it.big}</div> : null}
							<div style={{fontSize: 32, fontWeight: 800, color: C.white, marginTop: it.big ? 10 : 0}}>{it.title}</div>
							{it.text ? <div style={{fontSize: 24, fontWeight: 500, color: '#C9CDE0', marginTop: 10, lineHeight: 1.35}}>{it.text}</div> : null}
						</div>
					);
				})}
			</div>
		</div>
	);
};

/** Rubber stamp (e.g. "НЕ ПОДТВЕРЖДАЕТСЯ") slamming in. */
export const Stamp: React.FC<{text: string; at: number; color?: string; x?: number; y?: number; rot?: number}> = ({
	text,
	at,
	color = C.red,
	x = 960,
	y = 640,
	rot = -8,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	if (frame < at) return null;
	const e = spring({frame: frame - at, fps, config: {damping: 9, stiffness: 220}});
	return (
		<div
			style={{
				position: 'absolute',
				left: x,
				top: y,
				transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${2.2 - 1.2 * e})`,
				opacity: Math.min(1, e * 1.5),
				border: `7px solid ${color}`,
				color,
				padding: '12px 34px',
				borderRadius: 10,
				fontFamily: montserrat,
				fontWeight: 800,
				fontSize: 58,
				letterSpacing: 4,
				background: 'rgba(11,19,48,0.55)',
				whiteSpace: 'nowrap',
			}}
		>
			{text}
		</div>
	);
};

/** Large centred statement with optional kicker. */
export const BigText: React.FC<{kicker?: string; text: string; sub?: string; color?: string; size?: number; y?: number}> = ({
	kicker,
	text,
	sub,
	color = C.white,
	size = 96,
	y = 0,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const e = spring({frame, fps, config: {damping: 14}});
	const s = interpolate(frame, [0, 300], [1, 1.05], {extrapolateRight: 'clamp'});
	return (
		<div
			style={{
				position: 'absolute',
				inset: 0,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				transform: `translateY(${y}px) scale(${s})`,
				opacity: e,
			}}
		>
			{kicker ? (
				<div style={{fontFamily: montserrat, fontWeight: 700, fontSize: 30, color: C.gold, letterSpacing: 4, marginBottom: 18}}>
					{kicker.toUpperCase()}
				</div>
			) : null}
			<div
				style={{
					fontFamily: playfair,
					fontWeight: 900,
					fontSize: size,
					color,
					textAlign: 'center',
					lineHeight: 1.1,
					maxWidth: 1600,
					transform: `translateY(${(1 - e) * 30}px)`,
				}}
			>
				{text}
			</div>
			{sub ? <div style={{fontFamily: montserrat, fontWeight: 600, fontSize: 32, color: C.mute, marginTop: 24, textAlign: 'center', maxWidth: 1400}}>{sub}</div> : null}
		</div>
	);
};
