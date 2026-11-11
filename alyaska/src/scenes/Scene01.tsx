import React from 'react';
import {AbsoluteFill, Img, interpolate, interpolateColors, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Beats} from '../components/Beats';
import {BigText} from '../components/Cards';
import {ModeLabel} from '../components/Overlay';
import {PhotoFrame} from '../components/PhotoFrame';
import {PLACES, VectorMap} from '../components/VectorMap';
import {photoSrc} from '../components/assets';
import {at, scene} from '../timeline';
import {C, montserrat} from '../theme';
import {RU_DIM, Shell, UK_DIM, US_DIM} from './common';

const ID = 's01';

const HookMap: React.FC<{question?: boolean}> = ({question}) => {
	const f = useCurrentFrame();
	const fill = question
		? interpolateColors(Math.sin(f / 12), [-1, 1], [C.red, C.teal])
		: interpolateColors(f, [25, 70], ['#252B45', C.red]);
	return (
		<AbsoluteFill>
			{/* black & white Sitka photos behind the map */}
			<Img src={photoSrc('castlehill')} style={{position: 'absolute', left: -40, top: 0, width: 1100, opacity: 0.22, filter: 'grayscale(1) contrast(1.1)'}} />
			<Img src={photoSrc('sitka1880')} style={{position: 'absolute', right: -60, bottom: 0, width: 1150, opacity: 0.22, filter: 'grayscale(1) contrast(1.1)'}} />
			<VectorMap
				view="bering"
				sea={false}
				opacity={0.93}
				fills={{alaska: fill, '643': RU_DIM, '124': UK_DIM, usa48: US_DIM}}
				outline={interpolate(f, [0, 50], [0, 1], {extrapolateRight: 'clamp'})}
				outlineColor={C.gold}
				camera={{from: {k: 1.0}, to: {k: 1.12, lon: -152, lat: 63}, at: 0, dur: 600}}
				labels={[
					{text: 'АЛЯСКА', lon: -152, lat: 64.5, at: 40, size: 44, dot: false, align: 'center'},
					{text: 'Чукотка', lon: 172, lat: 66.5, at: 60, dot: false, color: C.mute, align: 'center'},
					{text: 'Берингов пролив', lon: -169, lat: 65.9, at: 75, size: 20, color: C.gold, dot: false, align: 'center', italic: true},
					{text: 'Ситка', lon: PLACES.sitka[0], lat: PLACES.sitka[1], at: 90, size: 22},
				]}
				note="схема · границы современные"
			/>
		</AbsoluteFill>
	);
};

const Disclaimer: React.FC = () => {
	const f = useCurrentFrame();
	const o = interpolate(f, [0, 12, 135, 150], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return (
		<div
			style={{
				position: 'absolute',
				left: 56,
				bottom: 60,
				padding: '12px 22px',
				background: 'rgba(7,12,32,0.85)',
				border: `1.5px solid ${C.gold}`,
				borderRadius: 8,
				color: C.white,
				fontFamily: montserrat,
				fontSize: 24,
				fontWeight: 600,
				opacity: o,
			}}
		>
			Это альтернативная реконструкция, основанная на исторических фактах
		</div>
	);
};

const Split: React.FC = () => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const e = spring({frame: f, fps, config: {damping: 14}});
	const e2 = spring({frame: f - 40, fps, config: {damping: 14}});
	const box = (c: string, t: string, s: string, k: number, dx: number) => (
		<div style={{width: 640, padding: '40px 30px', borderTop: `10px solid ${c}`, background: 'rgba(17,26,60,0.9)', borderRadius: 12, opacity: k, transform: `translateX(${(1 - k) * dx}px)`, textAlign: 'center', fontFamily: montserrat}}>
			<div style={{fontSize: 52, fontWeight: 800, color: c, letterSpacing: 3}}>{t}</div>
			<div style={{fontSize: 28, color: C.white, marginTop: 14}}>{s}</div>
		</div>
	);
	return (
		<AbsoluteFill style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 80}}>
			{box(C.red, 'РЕАЛЬНОСТЬ', 'как всё было', e, -80)}
			{box(C.teal, 'АЛЬТЕРНАТИВА', 'что могло бы быть', e2, 80)}
		</AbsoluteFill>
	);
};

export const Scene01: React.FC = () => {
	const s = scene(ID);
	return (
		<Shell>
			<Beats
				total={s.durationInFrames}
				beats={[
					{from: 0, render: () => <HookMap />},
					{
						from: at(ID, '7,2'),
						render: (life) => (
							<>
								<PhotoFrame id="check" x={960} y={430} maxW={1250} maxH={560} life={life} drift={[20, 0]} />
							</>
						),
					},
					{from: at(ID, 'Меньше'), render: () => <BigText kicker="цена сделки" text="< 2 центов за акр" sub="≈ 1,5 млн км² за 7,2 млн долларов" color={C.gold} />},
					{
						from: at(ID, 'нефть'),
						render: (life) => (
							<>
								<PhotoFrame id="pipeline" x={960} y={440} maxW={1150} maxH={600} life={life} />
							</>
						),
					},
					{from: at(ID, 'Была'), render: () => <><HookMap question /><BigText text="Ошибка?" size={130} y={-300} color={C.white} /></>},
					{from: at(ID, 'Сначала'), render: () => <Split />},
				]}
			/>
			<ModeLabel mode="R" />
			<Disclaimer />
		</Shell>
	);
};
