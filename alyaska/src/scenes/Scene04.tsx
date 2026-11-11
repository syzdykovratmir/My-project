import React from 'react';
import {AbsoluteFill, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Beats} from '../components/Beats';
import {BigText, Cards, Stamp} from '../components/Cards';
import {ChapterLabel, ModeLabel} from '../components/Overlay';
import {PhotoFrame} from '../components/PhotoFrame';
import {Timeline} from '../components/Timeline';
import {at, scene} from '../timeline';
import {C, montserrat, playfair} from '../theme';
import {Shell} from './common';

const ID = 's04';

const Myth: React.FC<{n: string; text: string}> = ({n, text}) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const e = spring({frame: f, fps, config: {damping: 14}});
	return (
		<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
			<div style={{transform: `translateY(${-80 + (1 - e) * 30}px)`, opacity: e, textAlign: 'center'}}>
				<div style={{fontFamily: montserrat, fontWeight: 800, fontSize: 34, color: C.gold, letterSpacing: 6}}>МИФ № {n}</div>
				<div style={{fontFamily: playfair, fontWeight: 900, fontSize: 78, color: C.white, maxWidth: 1500, marginTop: 20, lineHeight: 1.15}}>
					«{text}»
				</div>
			</div>
		</AbsoluteFill>
	);
};

export const Scene04: React.FC = () => {
	const s = scene(ID);
	const m1 = at(ID, 'Первый');
	const m2 = at(ID, 'Второй');
	return (
		<Shell>
			<Beats
				total={s.durationInFrames}
				beats={[
					{from: 0, render: () => <Title2 />},
					{
						from: m1,
						render: () => (
							<>
								<Myth n="1" text="Екатерина II сдала Аляску в аренду на 99 лет" />
								<Stamp text="НЕ ПОДТВЕРЖДАЕТСЯ" at={at(ID, 'подтверждается') - m1} y={700} />
							</>
						),
					},
					{
						from: at(ID, 'умерла'),
						render: () => (
							<Timeline
								from={1785}
								to={1880}
								title="Хронология против мифа"
								items={[
									{year: '1796', label: 'смерть Екатерины II', at: 5, color: C.red},
									{year: '1867', label: 'договор об уступке', at: 30, color: C.teal},
								]}
							/>
						),
					},
					{from: at(ID, 'договоре'), render: (life) => <PhotoFrame id="treaty" life={life} maxH={640} caption="Договор 1867 г.: уступка (cession), а не аренда" />},
					{
						from: m2,
						render: () => (
							<>
								<Myth n="2" text="Аляску продали за бесценок" />
								<Stamp text="УПРОЩЕНИЕ" at={at(ID, 'бесценок') - m2 + 15} y={700} color={C.gold} />
							</>
						),
					},
					{
						from: at(ID, 'получила'),
						render: () => (
							<Cards
								heading="Что получила Россия"
								cols={2}
								items={[
									{big: '+ $7,2 млн', title: 'деньги в казну', color: C.teal, at: 0},
									{big: '− убытки', title: 'убыточная колония, которую трудно защитить', color: C.red, at: at(ID, 'избавилась') - at(ID, 'получила')},
								]}
							/>
						),
					},
					{from: at(ID, 'Ценность'), render: () => <BigText kicker="позже" text="Золото — 1890-е · Нефть — 1968" color={C.gold} size={80} />},
					{from: at(ID, 'пришли'), render: (life) => <PhotoFrame id="check" life={life} maxW={1300} maxH={560} caption="Чек на 7,2 млн долларов, выписан 1 августа 1868 г." />},
				]}
			/>
			<ChapterLabel num="2" title="Мифы" sub="что не подтверждается" />
			<ModeLabel mode="R" />
		</Shell>
	);
};

const Title2: React.FC = () => <BigText kicker="глава 2" text="Два популярных мифа" size={100} />;
