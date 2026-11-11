import React from 'react';
import {AbsoluteFill, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Beats} from '../components/Beats';
import {BigText, Cards} from '../components/Cards';
import {ChapterLabel, ModeLabel, Tag} from '../components/Overlay';
import {Title} from '../components/Title';
import {PLACES, VectorMap} from '../components/VectorMap';
import {at, scene} from '../timeline';
import {C, montserrat} from '../theme';
import {RU, RU_DIM, Shell, UK, UK_DIM, US, US_DIM} from './common';

const ID = 's06';

/** One of three scenario mini-maps. */
const Mini: React.FC<{n: string; title: string; sub: string; fills: Record<string, string>; x: number; delay: number; dots?: [number, number][]}> = ({
	n,
	title,
	sub,
	fills,
	x,
	delay,
	dots = [],
}) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const e = spring({frame: f - delay, fps, config: {damping: 14}});
	if (f < delay) return null;
	return (
		<div style={{position: 'absolute', left: x, top: 200, width: 560, opacity: e, transform: `translateY(${(1 - e) * 40}px)`}}>
			<div style={{width: 560, height: 420, overflow: 'hidden', borderRadius: 14, border: `3px solid ${C.teal}`, position: 'relative'}}>
				<div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: 'scale(0.42)', transformOrigin: '0 0', marginLeft: -120, marginTop: -60}}>
					<VectorMap
						view="bering"
						fills={fills}
						showScale={false}
						showCompass={false}
						camera={{from: {k: 1.25, lon: -150, lat: 62}, to: {k: 1.32, lon: -150, lat: 62}, at: delay, dur: 400}}
						pulse={dots.map(([lon, lat]) => ({lon, lat, at: delay + 20, color: C.gold}))}
					/>
				</div>
			</div>
			<div style={{fontFamily: montserrat, marginTop: 18}}>
				<div style={{fontSize: 30, fontWeight: 800, color: C.teal}}>
					{n}. {title}
				</div>
				<div style={{fontSize: 22, fontWeight: 500, color: '#C9CDE0', marginTop: 6}}>{sub}</div>
			</div>
		</div>
	);
};

const base = {'643': RU_DIM, '124': UK_DIM, usa48: US_DIM};

export const Scene06: React.FC = () => {
	const s = scene(ID);
	const c0 = at(ID, 'Финансы');
	const sc = at(ID, 'вероятных');
	return (
		<Shell tint="#0F2A3A">
			<Beats
				total={s.durationInFrames}
				beats={[
					{from: 0, render: () => <Title num="1" title="Удержала бы Россия Аляску?" color={C.teal} size={72} />},
					{
						from: at(ID, 'ограничения'),
						render: () => (
							<Cards
								heading="Ограничения"
								cols={2}
								items={[
									{title: 'Финансы', text: 'казна в долгах после Крымской войны, впереди — дорогие реформы', color: C.red, at: c0 - at(ID, 'ограничения')},
									{title: 'Флот', text: 'на Тихом океане — лишь несколько кораблей', color: C.gold, at: at(ID, 'Флот') - at(ID, 'ограничения')},
									{title: 'Население', text: 'сотни русских на территории > 1,5 млн км²', color: C.red, at: at(ID, 'Население') - at(ID, 'ограничения')},
									{title: 'Соседи', text: 'британская Канада и быстро растущие США', color: C.teal, at: at(ID, 'соседи') - at(ID, 'ограничения')},
								]}
							/>
						),
					},
					{
						from: at(ID, 'британские'),
						render: () => (
							<VectorMap
								view="bering"
								fills={{...base, alaska: RU, '124': UK, usa48: US}}
								camera={{from: {k: 0.9, lon: -140, lat: 58}, to: {k: 0.82, lon: -130, lat: 55}, at: 0, dur: 300}}
								labels={[
									{text: 'Русская Аляска', lon: -152, lat: 64.5, dot: false, size: 32, align: 'center', at: 0},
									{text: 'Доминион Канада (1867)', lon: -112, lat: 58, dot: false, size: 28, color: C.navyDeep, align: 'center', at: 15},
									{text: 'США', lon: -108, lat: 46, dot: false, size: 34, color: C.navyDeep, align: 'center', at: 40},
								]}
								lines={[
									{coords: [[-118, 58], [-136, 63]], at: 25, dur: 40, arrow: true, color: C.gold},
									{coords: [[-125, 50], [-134, 57.5]], at: 50, dur: 40, arrow: true, color: C.teal},
								]}
								note="реконструкция · границы схематично"
							/>
						),
					},
					{
						from: sc,
						render: () => (
							<AbsoluteFill>
								<div style={{position: 'absolute', top: 110, width: '100%', textAlign: 'center', fontFamily: montserrat, fontWeight: 800, fontSize: 48, color: C.white}}>
									Три вероятных сценария
								</div>
								<Mini n="1" title="Перепродажа позже" sub="через 20–30 лет, возможно дороже" fills={{...base, alaska: US}} x={60} delay={at(ID, 'Первый') - sc} />
								<Mini n="2" title="Потеря в конфликте" sub="давление Британии или США" fills={{...base, alaska: UK}} x={680} delay={at(ID, 'Второй') - sc} />
								<Mini n="3" title="Освоение" sub="порты, переселенцы — нужны деньги и люди" fills={{...base, alaska: RU}} x={1300} delay={at(ID, 'Третий') - sc} dots={[PLACES.sitka, PLACES.kodiak, PLACES.anchorage]} />
								<Tag text="схема · предположения" />
							</AbsoluteFill>
						),
					},
					{
						from: at(ID, 'Какой'),
						render: () => (
							<>
								<BigText kicker="вывод ветки" text="1 и 2 — реалистичнее, чем 3" sub="однозначного ответа нет" size={88} color={C.teal} />
								<Tag text="предположение" />
							</>
						),
					},
				]}
			/>
			<ChapterLabel num="4" title="Ветка 1: удержать Аляску" color={C.teal} />
			<ModeLabel mode="A" />
		</Shell>
	);
};
