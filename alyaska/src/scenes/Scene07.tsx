import React from 'react';
import {Beats} from '../components/Beats';
import {BigText, Cards} from '../components/Cards';
import {Chart} from '../components/Chart';
import {Newspaper} from '../components/Newspaper';
import {ChapterLabel, ModeLabel, Tag} from '../components/Overlay';
import {PhotoFrame} from '../components/PhotoFrame';
import {Title} from '../components/Title';
import {PLACES, VectorMap} from '../components/VectorMap';
import {at, scene} from '../timeline';
import {C} from '../theme';
import {RU, RU_DIM, Shell, UK, UK_DIM, US_DIM} from './common';

const ID = 's07';
const P = PLACES;
const fills = {alaska: RU, '643': RU_DIM, '124': UK_DIM, usa48: US_DIM};
const realFills = {alaska: '#2B6F6A', '643': RU_DIM, '124': UK_DIM, usa48: US_DIM};
const CANADA = '#C99A3E';

const CHILKOOT: [number, number][] = [P.skagway, [-135.0, 59.7], [-134.99, 59.85], [-135.05, 60.72], [-136.6, 62.1], [-137.6, 62.9], [-139.0, 63.6], P.dawson];
const PIPE: [number, number][] = [P.prudhoe, [-149.2, 68.1], [-150.0, 66.6], [-147.6, 64.8], [-145.7, 63.3], [-145.4, 61.9], P.valdez];

export const Scene07: React.FC = () => {
	const s = scene(ID);
	return (
		<Shell tint="#2A2410">
			<Beats
				total={s.durationInFrames}
				beats={[
					{from: 0, render: () => <Title num="2" title="Золото и нефть" color={C.teal} />},
					{
						from: at(ID, 'Клондайк'),
						render: () => (
							<VectorMap
								view="alaska"
								fills={{...realFills, '124': CANADA}}
								labels={[
									{text: 'Клондайк · Доусон (Канада)', lon: P.dawson[0], lat: P.dawson[1], at: 10, color: C.gold, size: 28},
									{text: 'АЛЯСКА', lon: -153, lat: 65, at: 0, dot: false, size: 40, align: 'center'},
								]}
								pulse={[{lon: P.dawson[0], lat: P.dawson[1], at: 10}]}
								note="реальные границы · схема"
							/>
						),
					},
					{from: at(ID, 'Важная'), render: (life) => <PhotoFrame id="dawson" life={life} sepia maxW={1150} />},
					{
						from: at(ID, 'отправились'),
						render: () => (
							<Chart
								title="Клондайкская лихорадка, 1897–1898"
								max={100000}
								bars={[
									{label: 'Отправились на север', value: 100000, display: '≈ 100 000', color: C.gold, at: 5},
									{label: 'Добрались до Доусона', value: 35000, display: '30–40 тыс.', color: C.red, at: 40},
								]}
								note="оценки разнятся · округлено"
							/>
						),
					},
					{
						from: at(ID, 'путь'),
						render: () => (
							<VectorMap
								view="alaska"
								fills={{...realFills, '124': CANADA}}
								camera={{from: {k: 1.1, lon: -138, lat: 61.5}, to: {k: 1.6, lon: -137, lat: 61.5}, at: 0, dur: 300}}
								lines={[{coords: CHILKOOT, at: 15, dur: 90, color: C.gold, width: 4, arrow: true}]}
								labels={[
									{text: 'Скагуэй', lon: P.skagway[0], lat: P.skagway[1], at: 5, align: 'right'},
									{text: 'перевал Чилкут', lon: -135.0, lat: 59.7, at: 40, color: C.gold, size: 24, dy: -40},
									{text: 'Доусон (Канада)', lon: P.dawson[0], lat: P.dawson[1], at: 100, align: 'right'},
								]}
								note="маршрут схематично"
							/>
						),
					},
										{
						from: at(ID, 'вскоре'),
						render: () => (
							<VectorMap
								view="alaska"
								fills={{...realFills, '124': CANADA}}
								labels={[
									{text: 'Ном, 1899', lon: P.nome[0], lat: P.nome[1], at: at(ID, 'Номе') - at(ID, 'вскоре'), color: C.gold, size: 30},
									{text: 'Фэрбанкс, 1902', lon: P.fairbanks[0], lat: P.fairbanks[1], at: at(ID, 'Фэрбанксе') - at(ID, 'вскоре'), color: C.gold, size: 30},
								]}
								pulse={[
									{lon: P.nome[0], lat: P.nome[1], at: at(ID, 'Номе') - at(ID, 'вскоре')},
									{lon: P.fairbanks[0], lat: P.fairbanks[1], at: at(ID, 'Фэрбанксе') - at(ID, 'вскоре')},
								]}
								note="годы — начало добычи"
							/>
						),
					},
					{
						from: at(ID, 'альтернативной'),
						render: (life) => (
							<Newspaper
								life={life}
								name="Ново-Архангельскія Вѣдомости"
								date="1898 годъ"
								headline="Золото на Юконѣ: тысячи старателей идутъ черезъ Русскую Америку"
								lead="Губернская администрація проситъ подкрѣпленія. Въ Скагуэѣ и на перевалѣ Чилкутъ — толпы иностранцевъ. Хватитъ ли силъ удержать порядокъ?"
							/>
						),
					},
					{from: at(ID, 'Десятки'), render: (life) => (
						<>
							<PhotoFrame id="chilkoot" x={600} life={life} sepia maxW={760} maxH={560} tilt={-1.5} caption="Реальное фото: перевал Чилкут, 1898" />
							<PhotoFrame id="scales" x={1330} life={life} sepia maxW={760} maxH={560} tilt={1.5} delay={40} caption="Реальное фото: подъём к Чилкуту, 1898" />
						</>
					)},
					{
						from: at(ID, 'Сможет'),
						render: () => (
							<>
								<BigText kicker="вопрос" text="Удержит ли контроль небольшая администрация?" size={78} color={C.teal} />
								<Tag text="предположение" />
							</>
						),
					},
					{
						from: at(ID, 'нефтью'),
						render: () => (
							<VectorMap
								view="alaska"
								fills={fills}
								labels={[
									{text: 'Прудо-Бей, 1968', lon: P.prudhoe[0], lat: P.prudhoe[1], at: at(ID, 'Прудо') - at(ID, 'нефтью'), color: C.gold, size: 30},
									{text: 'Вальдез', lon: P.valdez[0], lat: P.valdez[1], at: at(ID, 'нефтепровод') - at(ID, 'нефтью') + 80},
									{text: '≈ 1300 км', lon: -151.2, lat: 66.2, at: at(ID, 'нефтепровод') - at(ID, 'нефтью') + 60, dot: false, color: C.gold, size: 30, align: 'right'},
								]}
								pulse={[{lon: P.prudhoe[0], lat: P.prudhoe[1], at: at(ID, 'Прудо') - at(ID, 'нефтью')}]}
								lines={[{coords: PIPE, at: at(ID, 'нефтепровод') - at(ID, 'нефтью'), dur: 90, color: C.gold, width: 5}]}
								note="реальный маршрут нефтепровода · схема"
							/>
						),
					},
					{from: at(ID, 'закончили'), render: (life) => <PhotoFrame id="pipeline2" life={life} maxW={1100} />},
					{
						from: at(ID, 'Получила'),
						render: () => (
							<>
								<Cards
									heading="Получила бы Россия эти богатства?"
									cols={2}
									items={[
										{title: 'Только если…', text: 'сохранила Аляску до второй половины XX века', color: C.teal, at: at(ID, 'сохранила') - at(ID, 'Получила')},
										{title: '…и если бы', text: 'смогла освоить месторождения', color: C.gold, at: at(ID, 'освоить') - at(ID, 'Получила')},
									]}
								/>
								<Tag text="предположение" />
							</>
						),
					},
				]}
			/>
			<ChapterLabel num="5" title="Ветка 2: золото и нефть" color={C.teal} />
			<ModeLabel mode="A" />
		</Shell>
	);
};
