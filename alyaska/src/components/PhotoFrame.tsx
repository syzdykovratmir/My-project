import React from 'react';
import {Html5Audio, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {C, montserrat} from '../theme';
import {asset, photoSrc} from './assets';
import {SourceTag} from './SourceTag';

type Props = {
	id: string;
	/** centre of the card, px */
	x?: number;
	y?: number;
	/** max box for the image itself */
	maxW?: number;
	maxH?: number;
	/** slow zoom direction: 1 = in, -1 = out */
	zoom?: 1 | -1;
	/** parallax drift in px over the card lifetime */
	drift?: [number, number];
	tilt?: number;
	sepia?: boolean;
	caption?: string;
	delay?: number;
	/** frames the card is alive (for drift/zoom pacing) */
	life?: number;
	click?: boolean;
};

/**
 * Real archival photo in an "archive frame": white border, soft shadow,
 * caption + source line, slow Ken Burns zoom (≈6%) and parallax drift.
 */
export const PhotoFrame: React.FC<Props> = ({
	id,
	x = 960,
	y = 500,
	maxW = 1100,
	maxH = 640,
	zoom = 1,
	drift = [-30, 0],
	tilt = 0,
	sepia = false,
	caption,
	delay = 0,
	life = 300,
	click = true,
}) => {
	const frame = useCurrentFrame() - delay;
	const {fps} = useVideoConfig();
	const a = asset(id);
	const ratio = a ? a.width / a.height : 1.5;
	let w = maxW;
	let h = w / ratio;
	if (h > maxH) {
		h = maxH;
		w = h * ratio;
	}
	const pad = 16;
	const capH = 64;
	const enter = spring({frame, fps, config: {damping: 16, mass: 0.7}});
	const t = interpolate(frame, [0, life], [0, 1], {extrapolateRight: 'clamp', easing: Easing.inOut(Easing.sin)});
	const scale = zoom === 1 ? 1 + 0.06 * t : 1.06 - 0.06 * t;
	const dx = drift[0] * t;
	const dy = drift[1] * t;
	if (frame < 0) return null;
	return (
		<div
			style={{
				position: 'absolute',
				left: x - (w + pad * 2) / 2 + dx,
				top: y - (h + pad * 2 + capH) / 2 + dy,
				width: w + pad * 2,
				background: '#F7F1E3',
				padding: pad,
				paddingBottom: 0,
				boxShadow: '0 24px 60px rgba(0,0,0,0.55), 0 4px 12px rgba(0,0,0,0.4)',
				transform: `translateY(${(1 - enter) * 40}px) rotate(${tilt}deg) scale(${0.94 + 0.06 * enter})`,
				opacity: enter,
			}}
		>
			{click ? <Html5Audio src={staticFile('sfx/click.wav')} volume={0.35} /> : null}
			<div style={{width: w, height: h, overflow: 'hidden', background: '#222'}}>
				<Img
					src={photoSrc(id)}
					style={{
						width: '100%',
						height: '100%',
						objectFit: 'cover',
						transform: `scale(${scale})`,
						filter: sepia ? 'sepia(0.35) contrast(1.05)' : 'contrast(1.03)',
					}}
				/>
			</div>
			<div style={{height: capH, padding: '8px 4px 0', fontFamily: montserrat}}>
				<div style={{fontSize: 19, fontWeight: 700, color: '#1D1A16', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
					{caption ?? a?.caption ?? id}
				</div>
				<SourceTag id={id} style={{marginTop: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}} />
			</div>
		</div>
	);
};
