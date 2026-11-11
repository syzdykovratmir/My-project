import React from 'react';
import {AbsoluteFill, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Beats} from '../components/Beats';
import {BigText} from '../components/Cards';
import {BlurredBg, ChapterLabel} from '../components/Overlay';
import {photoSrc} from '../components/assets';
import {at, scene} from '../timeline';
import {C, montserrat, playfair} from '../theme';
import {Shell} from './common';

const ID = 's10';

const Col: React.FC<{title: string; text: string; color: string; delay: number; x: number}> = ({title, text, color, delay, x}) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const e = spring({frame: f - delay, fps, config: {damping: 14}});
	if (f < delay) return null;
	return (
		<div
			style={{
				position: 'absolute',
				left: x,
				top: 270,
				width: 520,
				height: 520,
				background: 'rgba(17,26,60,0.92)',
				borderTop: `12px solid ${color}`,
				borderRadius: 14,
				padding: '36px 34px',
				opacity: e,
				transform: `translateY(${(1 - e) * 50}px)`,
				boxShadow: '0 20px 50px rgba(0,0,0,0.45)',
			}}
		>
			<div style={{fontFamily: montserrat, fontWeight: 800, fontSize: 40, color}}>{title}</div>
			<div style={{fontFamily: montserrat, fontWeight: 600, fontSize: 32, color: C.white, marginTop: 26, lineHeight: 1.35}}>{text}</div>
		</div>
	);
};

const Columns: React.FC<{d: [number, number, number]}> = ({d}) => (
	<AbsoluteFill>
		<div style={{position: 'absolute', top: 140, width: '100%', textAlign: 'center', fontFamily: playfair, fontWeight: 900, fontSize: 72, color: C.white}}>Итог</div>
		<Col x={110} title="Почти наверняка" text="Удерживать Аляску было бы очень трудно и дорого" color={C.red} delay={d[0]} />
		<Col x={700} title="Возможно" text="Перепродажа позже или конфликт с Британией / США" color={C.gold} delay={d[1]} />
		<Col x={1290} title="Неизвестно" text="Судьба региона в XX веке: революция, войны, холодная война" color={C.teal} delay={d[2]} />
	</AbsoluteFill>
);

export const Scene10: React.FC = () => {
	const s = scene(ID);
	return (
		<Shell>
			<Beats
				total={s.durationInFrames}
				beats={[
					{from: 0, render: () => <Columns d={[at(ID, 'наверняка'), at(ID, 'Возможно'), at(ID, 'Неизвестно')]} />},
					{
						from: at(ID, 'главное'),
						render: () => (
							<>
								<BlurredBg src={photoSrc('denaliriver')} opacity={0.6} />
								<BigText text="В 1867 году никто не знал ни про золото, ни про нефть" sub="решали задачи своего времени" size={76} />
							</>
						),
					},
				]}
			/>
			<ChapterLabel num="8" title="Итог" sub="факты и предположения" color={C.gold} />
		</Shell>
	);
};
