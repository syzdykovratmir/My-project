import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {Beats} from '../components/Beats';
import {BigText, Cards} from '../components/Cards';
import {ChapterLabel, ModeLabel, Tag} from '../components/Overlay';
import {VectorMap} from '../components/VectorMap';
import {at, scene} from '../timeline';
import {C, montserrat, playfair} from '../theme';
import {RU, RU_DIM, Shell, UK_DIM, US_DIM} from './common';

const ID = 's05';

/** Calendar page 1867 flipping over. */
const Calendar: React.FC = () => {
	const f = useCurrentFrame();
	const flip = interpolate(f, [25, 60], [0, 180], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
	const page = (front: boolean, month: string, sub: string) => (
		<div
			style={{
				position: 'absolute',
				inset: 0,
				background: '#F4EEDF',
				borderRadius: 14,
				backfaceVisibility: 'hidden',
				transform: front ? 'none' : 'rotateX(180deg)',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				boxShadow: '0 30px 70px rgba(0,0,0,0.5)',
			}}
		>
			<div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 90, background: C.red, borderRadius: '14px 14px 0 0'}} />
			<div style={{fontFamily: montserrat, fontWeight: 800, fontSize: 40, color: C.white, position: 'absolute', top: 22}}>1867</div>
			<div style={{fontFamily: playfair, fontWeight: 900, fontSize: 112, color: '#1D1A16', marginTop: 60}}>{month}</div>
			<div style={{fontFamily: montserrat, fontWeight: 700, fontSize: 36, color: '#5A5246'}}>{sub}</div>
		</div>
	);
	return (
		<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', perspective: 1600}}>
			<div style={{position: 'relative', width: 560, height: 560, marginTop: -80}}>
				{page(true, 'АПРЕЛЬ', 'сделка сорвалась?')}
				<div style={{position: 'absolute', inset: 0, transformOrigin: 'top center', transform: `rotateX(${flip}deg)`, transformStyle: 'preserve-3d', opacity: flip > 120 ? 0 : 1}}>
					{page(true, 'МАРТ', 'переговоры')}
					{page(false, '', '')}
				</div>
			</div>
		</AbsoluteFill>
	);
};

/** The red time-line splits into grey reality and coloured alternative. */
const Fork: React.FC = () => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const draw = interpolate(f, [0, 35], [0, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
	const split = interpolate(f, [30, 80], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
	const l1 = spring({frame: f - 70, fps, config: {damping: 14}});
	const l2 = spring({frame: f - 85, fps, config: {damping: 14}});
	return (
		<AbsoluteFill>
			<svg width={1920} height={1080}>
				<line x1={140} y1={520} x2={140 + 760 * draw} y2={520} stroke={C.red} strokeWidth={10} strokeLinecap="round" />
				<path d={`M900 520 C 1100 520, 1200 ${520 - 170 * split}, ${900 + 880 * split} ${520 - 200 * split}`} stroke="#6E7390" strokeWidth={10} fill="none" strokeLinecap="round" opacity={split > 0 ? 1 : 0} />
				<path d={`M900 520 C 1100 520, 1200 ${520 + 170 * split}, ${900 + 880 * split} ${520 + 200 * split}`} stroke={C.teal} strokeWidth={10} fill="none" strokeLinecap="round" opacity={split > 0 ? 1 : 0} />
				<circle cx={900} cy={520} r={22 * draw} fill={C.gold} />
			</svg>
			<div style={{position: 'absolute', left: 140, top: 430, fontFamily: montserrat, fontWeight: 800, fontSize: 40, color: C.gold}}>1867</div>
			<div style={{position: 'absolute', left: 1330, top: 220, opacity: l1, fontFamily: montserrat, fontWeight: 800, fontSize: 36, color: '#A7ABC2'}}>
				РЕАЛЬНОСТЬ<div style={{fontSize: 24, fontWeight: 600}}>Аляска продана США</div>
			</div>
			<div style={{position: 'absolute', left: 1330, top: 760, opacity: l2, fontFamily: montserrat, fontWeight: 800, fontSize: 36, color: C.teal}}>
				АЛЬТЕРНАТИВА<div style={{fontSize: 24, fontWeight: 600, color: C.white}}>сделки нет</div>
			</div>
			<div style={{position: 'absolute', top: 150, width: '100%', textAlign: 'center', fontFamily: playfair, fontWeight: 900, fontSize: 80, color: C.white}}>Точка развилки</div>
		</AbsoluteFill>
	);
};

const Formula: React.FC = () => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const parts = [
		{t: 'ЕСЛИ А', c: C.white},
		{t: '→', c: C.gold},
		{t: 'ВЕРОЯТНО Б', c: C.teal},
		{t: 'ПОТОМУ ЧТО В', c: C.gold},
	];
	return (
		<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 40}}>
			{parts.map((p, i) => {
				const e = spring({frame: f - i * 10, fps, config: {damping: 13}});
				return (
					<div key={i} style={{fontFamily: montserrat, fontWeight: 800, fontSize: 64, color: p.c, opacity: e, transform: `translateY(${(1 - e) * 30}px)`}}>
						{p.t}
					</div>
				);
			})}
		</AbsoluteFill>
	);
};

export const Scene05: React.FC = () => {
	const s = scene(ID);
	const f = useCurrentFrame();
	const switchAt = at(ID, 'Представим');
	const toA = interpolate(f, [switchAt, switchAt + 15], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return (
		<Shell>
			<Beats
				total={s.durationInFrames}
				beats={[
					{from: 0, render: () => <Calendar />},
					{from: at(ID, 'Представим'), render: () => <Fork />},
					{
						from: at(ID, 'Например'),
						render: () => (
							<>
								<Cards
									heading="Как это могло случиться"
									cols={2}
									items={[
										{title: 'Сенат США голосует против', text: 'договор не ратифицирован', color: C.teal, at: 0},
										{title: 'Петербург передумал', text: 'сделку отзывают', color: C.teal, at: at(ID, 'Петербурге') - at(ID, 'Например')},
									]}
								/>
								<Tag text="гипотеза" />
							</>
						),
					},
					{
						from: at(ID, 'осталась'),
						render: () => (
							<VectorMap
								view="bering"
								fills={{alaska: RU, '643': RU_DIM, '124': UK_DIM, usa48: US_DIM}}
								labels={[{text: '1867: сделки нет', lon: -152, lat: 64.5, dot: false, size: 40, align: 'center', at: 10}]}
								outline={1}
								note="реконструкция · схема"
							/>
						),
					},
					{from: at(ID, 'оговорка'), render: () => <BigText kicker="оговорка" text="Это не значит «навсегда»" color={C.gold} size={92} />},
					{
						from: at(ID, 'четыре'),
						render: () => (
							<Cards
								heading="Четыре ветки"
								cols={4}
								items={[
									{big: '1', title: 'Удержать?', color: C.teal, at: 0},
									{big: '2', title: 'Золото и нефть', color: C.teal, at: 8},
									{big: '3', title: 'XX век', color: C.teal, at: 16},
									{big: '4', title: 'Люди и культура', color: C.teal, at: 24},
								]}
							/>
						),
					},
					{from: at(ID, 'схеме'), render: () => <Formula />},
					{from: at(ID, 'Где'), render: () => <BigText text="Факты ≠ предположения" sub="будем говорить, где что" size={96} />},
				]}
			/>
			<ChapterLabel num="3" title="Точка развилки" sub="1867" color={C.teal} />
			<ModeLabel mode="R" opacity={1 - toA} />
			<ModeLabel mode="A" opacity={toA} />
		</Shell>
	);
};
