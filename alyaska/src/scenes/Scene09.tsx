import React from 'react';
import {Beats} from '../components/Beats';
import {BigText, Cards} from '../components/Cards';
import {ChapterLabel, ModeLabel, Tag} from '../components/Overlay';
import {PhotoFrame} from '../components/PhotoFrame';
import {Title} from '../components/Title';
import {PLACES, VectorMap} from '../components/VectorMap';
import {at, scene} from '../timeline';
import {C} from '../theme';
import {RU_DIM, Shell, UK_DIM, US, US_DIM} from './common';

const ID = 's09';
const P = PLACES;
const realFills = {alaska: '#2B6F6A', '643': RU_DIM, '124': UK_DIM, usa48: US_DIM};

export const Scene09: React.FC = () => {
	const s = scene(ID);
	const n0 = at(ID, 'названия');
	return (
		<Shell tint="#14283A">
			<Beats
				total={s.durationInFrames}
				beats={[
					{from: 0, render: () => <Title num="4" title="Люди и культура" color={C.teal} />},
					{
						from: at(ID, 'приходы'),
						render: () => (
							<VectorMap
								view="bering"
								fills={realFills}
								camera={{from: {k: 1.05, lon: -150, lat: 59}, to: {k: 1.2, lon: -150, lat: 58}, at: 0, dur: 300}}
								labels={[
									{text: 'Ситка', lon: P.sitka[0], lat: P.sitka[1], at: at(ID, 'Ситке') - at(ID, 'приходы'), color: C.gold},
									{text: 'Кадьяк', lon: P.kodiak[0], lat: P.kodiak[1], at: 30, color: C.gold},
									{text: 'Уналашка', lon: P.unalaska[0], lat: P.unalaska[1], at: 50, color: C.gold, align: 'right'},
									{text: 'православные приходы', lon: -152, lat: 64.5, at: 10, dot: false, size: 32, align: 'center'},
								]}
								note="реальность · схема"
							/>
						),
					},
					{from: at(ID, 'Ситке'), render: (life) => <PhotoFrame id="sitka1880" life={life} sepia maxW={1200} />},
					{
						from: at(ID, 'Уналашке'),
						render: (life) => (
							<>
								<PhotoFrame id="unalaska" x={640} y={480} life={life} maxW={760} maxH={520} tilt={-1.5} />
								<PhotoFrame id="unalaskaicon" x={1300} y={520} life={life} maxW={700} maxH={480} tilt={1.5} delay={45} />
							</>
						),
					},
					{
						from: n0,
						render: () => (
							<VectorMap
								view="alaska"
								fills={realFills}
								labels={[
									{text: 'о. Баранова', lon: -135.0, lat: 57.2, at: 5, size: 22, color: C.gold},
									{text: 'о. Чичагова', lon: -135.8, lat: 57.95, at: 15, size: 22, color: C.gold, align: 'right'},
									{text: 'пролив Шелихова', lon: -154.5, lat: 57.6, at: 25, size: 22, color: C.gold, align: 'right'},
									{text: 'о-ва Прибылова', lon: -170.2, lat: 57.2, at: 35, size: 22, color: C.gold},
									{text: 'Коцебу', lon: -162.6, lat: 66.9, at: 45, size: 22, color: C.gold},
									{text: 'Врангель', lon: -132.4, lat: 56.47, at: 55, size: 22, color: C.gold, dy: 34},
								]}
								note="русские названия на карте Аляски"
							/>
						),
					},
					{from: at(ID, 'миссионерами'), render: (life) => <PhotoFrame id="veniaminov" life={life} maxH={640} />},
					{
						from: at(ID, 'альтернативной'),
						render: () => (
							<>
								<Cards
									heading="Что было бы иначе"
									cols={2}
									items={[
										{title: 'Больше переселенцев', color: C.teal, at: 0},
										{title: 'Русский — язык администрации', color: C.teal, at: at(ID, 'языком') - at(ID, 'альтернативной')},
										{title: 'Коренные народы', text: 'зависели бы от политики империи, затем, возможно, СССР', color: C.gold, at: at(ID, 'судьба') - at(ID, 'альтернативной')},
									]}
								/>
								<Tag text="предположения" />
							</>
						),
					},
					{
						from: at(ID, 'знаем'),
						render: (life) => (
							<>
								<PhotoFrame id="chukotka" x={560} y={470} life={life} maxW={760} maxH={500} tilt={-1.5} caption="Чукотка, 2018" />
								<PhotoFrame id="wonderlake" x={1360} y={470} life={life} maxW={760} maxH={500} tilt={1.5} caption="Аляска, Денали, 2010" delay={10} />
							</>
						),
					},
				]}
			/>
			<ChapterLabel num="7" title="Ветка 4: люди и культура" color={C.teal} />
			<ModeLabel mode="A" />
		</Shell>
	);
};
