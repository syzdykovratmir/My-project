import React from 'react';
import {Beats} from '../components/Beats';
import {BigText, Cards} from '../components/Cards';
import {ChapterLabel, ModeLabel, Tag} from '../components/Overlay';
import {PhotoFrame} from '../components/PhotoFrame';
import {Timeline} from '../components/Timeline';
import {Title} from '../components/Title';
import {PLACES, VectorMap} from '../components/VectorMap';
import {at, scene} from '../timeline';
import {C} from '../theme';
import {RU, RU_DIM, Shell, UK, UK_DIM, US, US_DIM} from './common';

const ID = 's08';
const P = PLACES;
const ALSIB: [number, number][] = [P.fairbanks, P.nome, P.uelkal, [152.42, 62.92], P.yakutsk, [108.1, 57.78], P.krasnoyarsk];

export const Scene08: React.FC = () => {
	const s = scene(ID);
	return (
		<Shell tint="#1E1830">
			<Beats
				total={s.durationInFrames}
				beats={[
					{from: 0, render: () => <Title num="3" title="XX век" sub="здесь предположений больше всего" color={C.teal} />},
					{
						from: at(ID, 'Революция'),
						render: () => (
							<Timeline
								title="XX век: ключевые даты"
								from={1910}
								to={1995}
								items={[
									{year: '1917', label: 'Революция', at: 5, color: C.red},
									{year: '1918', label: 'интервенция на Дальнем Востоке', at: at(ID, 'высаживаются') - at(ID, 'Революция')},
									{year: '1942', label: 'ленд-лиз через Аляску', at: 70, color: C.gold},
									{year: '1962', label: 'Карибский кризис', at: 90, color: C.teal},
									{year: '1991', label: 'конец СССР', at: 110},
								]}
							/>
						),
					},
					{
						from: at(ID, 'могла'),
						render: () => (
							<>
								<Cards
									heading="Судьба Аляски в 1917–1922?"
									cols={2}
									items={[
										{title: 'Оплот белых', color: C.gold, at: 0},
										{title: 'Отдельное государство', color: C.teal, at: at(ID, 'отдельным') - at(ID, 'могла')},
										{title: 'Иностранный контроль', color: C.mute, at: at(ID, 'иностранным') - at(ID, 'могла')},
										{title: 'Советская Россия', color: C.red, at: at(ID, 'Советской') - at(ID, 'могла')},
									]}
								/>
								<Tag text="предположения" />
							</>
						),
					},
					{
						from: at(ID, 'ленд-лизу'),
						render: () => (
							<VectorMap
								view="alsib"
								fills={{alaska: US, '643': RU_DIM, '124': UK_DIM, usa48: US_DIM}}
								lines={[{coords: ALSIB, at: 10, dur: 150, color: C.gold, width: 4, arrow: true}]}
								labels={[
									{text: 'Фэрбанкс', lon: P.fairbanks[0], lat: P.fairbanks[1], at: 5},
									{text: 'Чукотка', lon: P.uelkal[0], lat: P.uelkal[1], at: 60, align: 'right'},
									{text: 'Якутск', lon: P.yakutsk[0], lat: P.yakutsk[1], at: 110},
									{text: 'Красноярск', lon: P.krasnoyarsk[0], lat: P.krasnoyarsk[1], at: 150},
									{text: 'АЛСИБ · ≈ 8000 самолётов', lon: 170, lat: 57, at: 120, dot: false, color: C.gold, size: 32, align: 'center'},
								]}
								note="реальный маршрут 1942–1945 · схема"
							/>
						),
					},
					{from: at(ID, 'перегнали'), render: (life) => <PhotoFrame id="laddfield" life={life} maxW={950} maxH={620} />},
					{
						from: at(ID, 'холодная'),
						render: () => (
							<VectorMap
								view="strait"
								fills={{alaska: US, '643': RU}}
								lines={[{coords: [[-168.98, 66.5], [-168.98, 65.0]], at: 20, dur: 50, color: C.white, width: 2}]}
								labels={[
									{text: 'Большой Диомид (Россия)', lon: P.bigDiomede[0], lat: P.bigDiomede[1] + 0.01, at: at(ID, 'Большой') - at(ID, 'холодная'), align: 'right', color: C.red, size: 28},
									{text: 'Малый Диомид (США)', lon: P.littleDiomede[0], lat: P.littleDiomede[1] - 0.01, at: at(ID, 'Малый') - at(ID, 'холодная'), color: C.teal, size: 28},
									{text: '< 4 км', lon: -168.99, lat: 65.71, at: at(ID, 'Малый') - at(ID, 'холодная') + 30, dot: false, color: C.gold, size: 34, align: 'center'},
									{text: 'граница', lon: -168.98, lat: 65.86, at: 50, dot: false, color: C.white, size: 20, align: 'center', italic: true},
								]}
								camera={{from: {k: 1}, to: {k: 3.2, lon: -168.99, lat: 65.77}, at: 10, dur: 160}}
								note="реальная граница · схема"
							/>
						),
					},
					{from: at(ID, 'Между', 2), render: (life) => <PhotoFrame id="diomede" life={life} maxW={950} maxH={640} caption="Острова Диомида из космоса (реальность, 2000)" />},
					{
						from: at(ID, 'сухопутная'),
						render: () => (
							<VectorMap
								view="bering"
								fills={{alaska: RU, '643': RU, '124': UK, usa48: US_DIM}}
								lines={[{coords: [[-141, 69.6], [-141, 60.3]], at: 10, dur: 50, color: C.white, width: 5}]}
								labels={[
									{text: 'граница СССР и Канады?', lon: -141, lat: 65, at: 40, color: C.white, size: 30},
									{text: 'СССР', lon: -152, lat: 64.5, dot: false, size: 40, align: 'center', at: 0},
								]}
								note="реконструкция · схема"
							/>
						),
					},
					{
						from: at(ID, 'изменились'),
						render: () => (
							<>
								<Cards
									cols={3}
									heading="Что изменилось бы?"
									items={[
										{title: 'Военные базы?', color: C.teal, at: 0},
										{title: 'Ракетная оборона?', color: C.teal, at: at(ID, 'ракетная') - at(ID, 'изменились')},
										{title: 'Карибский кризис?', color: C.teal, at: at(ID, 'Карибский') - at(ID, 'изменились')},
									]}
								/>
								<Tag text="чистые предположения" />
							</>
						),
					},
				]}
			/>
			<ChapterLabel num="6" title="Ветка 3: XX век" color={C.teal} />
			<ModeLabel mode="A" />
		</Shell>
	);
};
