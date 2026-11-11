import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Beats} from '../components/Beats';
import {BigText, Cards} from '../components/Cards';
import {ChapterLabel, ModeLabel, Tag} from '../components/Overlay';
import {PhotoFrame} from '../components/PhotoFrame';
import {Timeline} from '../components/Timeline';
import {Title} from '../components/Title';
import {PLACES, VectorMap} from '../components/VectorMap';
import {at, scene} from '../timeline';
import {C} from '../theme';
import {RU, RU_DIM, Shell, UK, UK_DIM, US_DIM, useSaleColor} from './common';

const ID = 's03';
const P = PLACES;

// before 1867: only Russian territories are coloured, the rest stays neutral
const baseFills = {alaska: RU, '643': RU_DIM};

const SaleMap: React.FC = () => {
	const fill = useSaleColor(40, 110);
	const f = useCurrentFrame();
	return (
		<>
			<VectorMap
				view="bering"
				fills={{...baseFills, alaska: fill, usa48: C.teal, '124': UK_DIM}}
				outline={interpolate(f, [0, 40], [0, 1], {extrapolateRight: 'clamp'})}
				camera={{from: {k: 1}, to: {k: 1.25, lon: -140, lat: 60}, at: 0, dur: 420}}
				labels={[
					{text: 'Ситка · 18.10.1867', lon: P.sitka[0], lat: P.sitka[1], at: 30, color: C.gold, size: 28},
					{text: 'передача Аляски США', lon: -152, lat: 65, at: 90, dot: false, size: 34, align: 'center'},
				]}
				pulse={[{lon: P.sitka[0], lat: P.sitka[1], at: 30}]}
				note="границы 1867 г. — схематично"
			/>
		</>
	);
};

export const Scene03: React.FC = () => {
	const s = scene(ID);
	const T = s.durationInFrames;
	return (
		<Shell>
			<Beats
				total={T}
				beats={[
					{from: 0, render: () => <Title num="1" title="Как это было на самом деле" sub="1741 — 1867" />},
					{
						from: at(ID, 'Русские'),
						render: () => (
							<VectorMap
								view="pacific"
								fills={{'643': RU, alaska: '#3A3F5C', '124': '#3A3F5C', usa48: '#3A3F5C'}}
								camera={{from: {k: 1}, to: {k: 1.1, lon: -170, lat: 57}, at: 0, dur: 400}}
								lines={[{coords: [P.petropavlovsk, [-170, 54], [-150, 57], [-140, 59]], at: 20, dur: 90, arrow: true}]}
								labels={[
									{text: 'Петропавловск', lon: P.petropavlovsk[0], lat: P.petropavlovsk[1], at: 10, align: 'right'},
									{text: 'Экспедиция Беринга и Чирикова, 1741', lon: -165, lat: 50.5, at: 60, dot: false, color: C.gold, size: 28, align: 'center'},
								]}
								note="маршрут схематично"
							/>
						),
					},
					{from: at(ID, 'промышленники'), render: (life) => <PhotoFrame id="seaotter" life={life} maxW={1100} />},
					{
						from: at(ID, 'Шелихов'),
						render: () => (
							<VectorMap
								view="bering"
								fills={{...baseFills, alaska: '#3A3F5C'}}
								camera={{from: {k: 1.1, lon: -155, lat: 60}, to: {k: 1.35, lon: -152, lat: 58}, at: 0, dur: 300}}
								labels={[{text: 'о. Кадьяк, 1784', lon: P.kodiak[0], lat: P.kodiak[1], at: 15, color: C.gold, size: 30}]}
								pulse={[{lon: P.kodiak[0], lat: P.kodiak[1], at: 15, color: C.red}]}
							/>
						),
					},
					{from: at(ID, 'Павел'), render: (life) => <PhotoFrame id="racflag" life={life} maxW={950} maxH={600} caption="Флаг Русско-американской компании (1806)" />},
					{from: at(ID, 'Баранов'), render: (life) => <PhotoFrame id="baranov" life={life} maxH={640} drift={[0, -20]} />},
					{from: at(ID, 'тлинкиты'), render: (life) => <PhotoFrame id="castlehill" life={life} sepia maxW={1150} />},
					{from: at(ID, 'Ново-Архангельск'), render: (life) => <PhotoFrame id="sitkawater" life={life} sepia maxW={1150} zoom={-1} />},
					{
						from: at(ID, 'Калифорнии'),
						render: () => (
							<VectorMap
								view="pacific"
								fills={{...baseFills, alaska: RU, '643': RU}}
								lines={[{coords: [P.sitka, [-130, 48], P.fortRoss], at: 10, dur: 60, arrow: true}]}
								labels={[
									{text: 'Ново-Архангельск (Ситка)', lon: P.sitka[0], lat: P.sitka[1], at: 5, align: 'right', size: 24},
									{text: 'Форт-Росс, 1812', lon: P.fortRoss[0], lat: P.fortRoss[1], at: 60, color: C.gold, size: 28},
								]}
								pulse={[{lon: P.fortRoss[0], lat: P.fortRoss[1], at: 60}]}
								note="схема"
							/>
						),
					},
					{from: at(ID, 'Форт-Росс', 1, -0.3), render: (life) => <PhotoFrame id="fortross" life={life} maxW={1300} maxH={560} />},
					{
						from: at(ID, 'выбили', 1, -0.6),
						render: () => (
							<Cards
								heading="Проблемы Русской Америки"
								cols={2}
								items={[
									{title: 'Калан выбит', text: 'доходы от меха падают', at: at(ID, 'выбили') - at(ID, 'выбили', 1, -0.6), color: C.red},
									{title: 'Очень далеко', text: 'грузы идут месяцами', at: at(ID, 'далеко') - at(ID, 'выбили', 1, -0.6), color: C.gold},
									{big: '≤ 800', title: 'русских поселенцев', text: 'по разным оценкам', at: at(ID, 'мало') - at(ID, 'выбили', 1, -0.6), color: C.red},
									{big: '≈ 10 000', title: 'коренных жителей', text: 'алеуты, тлинкиты и др.', at: at(ID, 'управлением') - at(ID, 'выбили', 1, -0.6), color: C.teal},
								]}
							/>
						),
					},
					{from: at(ID, 'убыток'), render: () => <BigText kicker="итог" text="Компания работает в убыток" color={C.red} size={88} />},
					{
						from: at(ID, 'Крымская'),
						render: () => (
							<Timeline
								title="Русская Америка: хронология"
								from={1735}
								to={1872}
								items={[
									{year: '1741', label: 'Беринг и Чириков', at: 5},
									{year: '1784', label: 'Кадьяк', at: 12},
									{year: '1799', label: 'Русско-американская компания', at: 19},
									{year: '1812', label: 'Форт-Росс', at: 26},
									{year: '1853', label: 'Крымская война', at: 40, color: C.red},
									{year: '1867', label: 'Договор с США', at: 55, color: C.teal},
								]}
							/>
						),
					},
					{from: at(ID, 'Петропавловск'), render: (life) => <PhotoFrame id="petropavlovsk" life={life} maxW={1150} />},
					{
						from: at(ID, 'Британия'),
						render: () => (
							<VectorMap
								view="bering"
								fills={{...baseFills, '124': UK}}
								camera={{from: {k: 0.95}, to: {k: 1.05, lon: -140, lat: 62}, at: 0, dur: 300}}
								lines={[
									{coords: [[-122, 54], [-133, 58.5]], at: 20, dur: 40, arrow: true, color: C.gold},
									{coords: [[-118, 60], [-138, 64]], at: 40, dur: 40, arrow: true, color: C.gold},
								]}
								labels={[
									{text: 'Британские владения', lon: -116, lat: 57, at: 10, dot: false, color: C.navyDeep, size: 30, align: 'center'},
									{text: 'Русская Америка', lon: -152, lat: 64.5, at: 0, dot: false, size: 32, align: 'center'},
								]}
								note="схема · не реальные маршруты"
							/>
						),
					},
					{from: at(ID, 'Константин'), render: (life) => <PhotoFrame id="konstantin" life={life} maxH={640} />},
					{from: at(ID, 'Второй'), render: (life) => <PhotoFrame id="alexander2" life={life} maxH={640} drift={[0, -20]} />},
					{
						from: at(ID, 'Стекль'),
						render: (life) => (
							<>
								<PhotoFrame id="stoeckl" x={600} life={life} maxH={600} maxW={600} tilt={-1.5} />
								<PhotoFrame id="seward" x={1320} life={life} maxH={600} maxW={600} tilt={1.5} delay={at(ID, 'американской') - at(ID, 'Стекль')} />
							</>
						),
					},
					{from: at(ID, 'Договор'), render: (life) => <PhotoFrame id="leutze" life={life} maxW={1200} />},
					{from: at(ID, 'старому'), render: (life) => <PhotoFrame id="treaty" life={life} maxH={660} zoom={1} drift={[0, -25]} />},
					{from: at(ID, 'октября', 1, -0.6), render: () => <SaleMap />},
				]}
			/>
			<ChapterLabel num="1" title="Как это было" sub="1741–1867" />
			<ModeLabel mode="R" />
		</Shell>
	);
};
