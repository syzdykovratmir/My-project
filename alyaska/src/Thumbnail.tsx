import React from 'react';
import {AbsoluteFill} from 'remotion';
import {VectorMap} from './components/VectorMap';
import {C, montserrat} from './theme';

/** 1280×720 YouTube thumbnail: sharp map with red Alaska + 5-word question. */
export const Thumbnail: React.FC = () => (
	<AbsoluteFill style={{background: C.navyDeep, overflow: 'hidden'}}>
		<div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: 'scale(0.6667)', transformOrigin: '0 0'}}>
			<VectorMap
				view="bering"
				fills={{alaska: C.red, '643': '#5A1E28', '124': '#3A3F5C', usa48: '#3A3F5C'}}
				outline={1}
				outlineColor={C.gold}
				camera={{from: {k: 1.3, lon: -160, lat: 62}, to: {k: 1.3, lon: -160, lat: 62}}}
				showScale={false}
				showCompass={false}
			/>
		</div>
		<AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(7,12,32,0.95) 0%, rgba(7,12,32,0.7) 35%, rgba(7,12,32,0) 55%)'}} />
		<div style={{position: 'absolute', left: 56, top: 120, width: 640, fontFamily: montserrat, fontWeight: 800, color: C.white, fontSize: 82, lineHeight: 1.02, textTransform: 'uppercase', textShadow: '0 4px 14px rgba(0,0,0,0.8)'}}>
			Что если <span style={{color: C.red}}>Аляска</span> осталась бы <span style={{color: C.gold}}>нашей?</span>
		</div>
		<div style={{position: 'absolute', left: 56, bottom: 50, padding: '8px 18px', background: C.teal, color: C.navyDeep, fontFamily: montserrat, fontWeight: 800, fontSize: 28, borderRadius: 6, letterSpacing: 3}}>
			АЛЬТЕРНАТИВА
		</div>
	</AbsoluteFill>
);
