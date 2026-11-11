import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Beats} from '../components/Beats';
import {BigText} from '../components/Cards';
import {BlurredBg} from '../components/Overlay';
import {photoSrc} from '../components/assets';
import {at, scene} from '../timeline';
import {C, montserrat, playfair} from '../theme';
import {Shell} from './common';

const ID = 's11';

const Next: React.FC = () => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const e = spring({frame: f, fps, config: {damping: 14}});
	return (
		<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
			<div style={{fontFamily: montserrat, fontWeight: 700, fontSize: 32, color: C.gold, letterSpacing: 4, opacity: e}}>В СЛЕДУЮЩЕМ ВИДЕО</div>
			<div style={{marginTop: 30, padding: '40px 60px', border: `4px solid ${C.teal}`, borderRadius: 16, background: 'rgba(17,26,60,0.9)', transform: `scale(${0.9 + 0.1 * e})`, opacity: e}}>
				<div style={{fontFamily: playfair, fontWeight: 900, fontSize: 76, color: C.white, textAlign: 'center', lineHeight: 1.1}}>
					Что если бы Германия
					<br />
					взяла Москву в 1941?
				</div>
			</div>
		</AbsoluteFill>
	);
};

const Outro: React.FC = () => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const e = spring({frame: f, fps, config: {damping: 14}});
	const c = interpolate(f, [40, 70], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
			<div style={{fontFamily: playfair, fontWeight: 900, fontSize: 140, color: C.white, opacity: e, transform: `scale(${0.92 + 0.08 * e})`}}>Другая История</div>
			<div style={{width: 400, height: 5, background: C.red, marginTop: 20, transform: `scaleX(${e})`}} />
			<div style={{position: 'absolute', bottom: 70, fontFamily: montserrat, fontSize: 22, color: C.mute, opacity: c, textAlign: 'center', lineHeight: 1.6}}>
				Озвучка: ElevenLabs (синтезированный голос) · Музыка: Kevin MacLeod (incompetech.com), CC BY 4.0
				<br />
				Фото: Wikimedia Commons, Library of Congress, NARA, Univ. of Washington — источники в описании
			</div>
		</AbsoluteFill>
	);
};

export const Scene11: React.FC = () => {
	const s = scene(ID);
	return (
		<Shell>
			<BlurredBg src={photoSrc('wonderlake')} opacity={0.45} />
			<Beats
				total={s.durationInFrames}
				beats={[
					{from: 0, render: () => <BigText text="Продажа Аляски была ошибкой?" sub="Пишите в комментариях" size={96} />},
					{from: at(ID, 'следующем'), render: () => <Next />},
					{from: at(ID, 'Другая'), render: () => <Outro />},
				]}
			/>
		</Shell>
	);
};
