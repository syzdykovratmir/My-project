import React from 'react';
import {AbsoluteFill, Img, random, staticFile, useCurrentFrame} from 'remotion';
import {C, montserrat} from '../theme';

/** Film grain (pre-rendered noise tiles, jittered every 2 frames) + vignette. */
export const FilmGrain: React.FC<{opacity?: number}> = ({opacity = 0.07}) => {
	const frame = useCurrentFrame();
	const step = Math.floor(frame / 2);
	const tile = step % 4;
	const dx = Math.floor(random(`gx${step}`) * 512);
	const dy = Math.floor(random(`gy${step}`) * 512);
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			<AbsoluteFill
				style={{
					backgroundImage: `url(${staticFile(`fx/grain${tile}.png`)})`,
					backgroundPosition: `${dx}px ${dy}px`,
					opacity,
					mixBlendMode: 'overlay',
				}}
			/>
			<AbsoluteFill
				style={{
					background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)',
				}}
			/>
		</AbsoluteFill>
	);
};

/** Red "РЕАЛЬНОСТЬ" / teal "АЛЬТЕРНАТИВА" plate in the top-right corner. */
export const ModeLabel: React.FC<{mode: 'R' | 'A'; opacity?: number}> = ({mode, opacity = 1}) => (
	<div
		style={{
			position: 'absolute',
			top: 44,
			right: 56,
			padding: '10px 20px',
			background: mode === 'R' ? C.red : C.teal,
			color: mode === 'R' ? C.white : C.navyDeep,
			fontFamily: montserrat,
			fontWeight: 800,
			fontSize: 24,
			letterSpacing: 4,
			borderRadius: 6,
			boxShadow: '0 6px 20px rgba(0,0,0,0.35)',
			opacity,
		}}
	>
		{mode === 'R' ? 'РЕАЛЬНОСТЬ' : 'АЛЬТЕРНАТИВА'}
	</div>
);

/** Chapter label in the top-left corner (channel style). */
export const ChapterLabel: React.FC<{num: string; title: string; sub?: string; color?: string}> = ({
	num,
	title,
	sub,
	color = C.red,
}) => (
	<div style={{position: 'absolute', top: 44, left: 56, display: 'flex', gap: 14, fontFamily: montserrat}}>
		<div style={{width: 5, background: color, borderRadius: 2}} />
		<div>
			<div style={{color: C.white, fontWeight: 700, fontSize: 24, letterSpacing: 1.5}}>
				{num} · {title.toUpperCase()}
			</div>
			{sub ? <div style={{color: C.gold, fontWeight: 600, fontSize: 18, marginTop: 4}}>{sub}</div> : null}
		</div>
	</div>
);

/** Small tag: "реконструкция" / "схема" / "схематично". */
export const Tag: React.FC<{text: string; style?: React.CSSProperties}> = ({text, style}) => (
	<div
		style={{
			position: 'absolute',
			bottom: 40,
			left: 56,
			padding: '6px 12px',
			border: `1.5px solid ${C.mute}`,
			color: C.mute,
			fontFamily: montserrat,
			fontSize: 18,
			fontWeight: 600,
			letterSpacing: 2,
			borderRadius: 4,
			textTransform: 'uppercase',
			...style,
		}}
	>
		{text}
	</div>
);

export const Background: React.FC<{tint?: string}> = ({tint}) => (
	<AbsoluteFill
		style={{
			background: `radial-gradient(ellipse at 50% 40%, ${tint ?? '#16204A'} 0%, ${C.navy} 55%, ${C.navyDeep} 100%)`,
		}}
	/>
);

export const BlurredBg: React.FC<{src: string; opacity?: number}> = ({src, opacity = 0.35}) => (
	<AbsoluteFill style={{overflow: 'hidden'}}>
		<Img
			src={src}
			style={{
				position: 'absolute',
				inset: -60,
				width: 'calc(100% + 120px)',
				height: 'calc(100% + 120px)',
				objectFit: 'cover',
				filter: 'blur(28px) saturate(0.6) brightness(0.55)',
				opacity,
			}}
		/>
	</AbsoluteFill>
);
