import React from 'react';
import {AbsoluteFill, interpolateColors, useCurrentFrame} from 'remotion';
import {C} from '../theme';
import {Background, FilmGrain} from '../components/Overlay';

/** Standard scene shell: background, content, grain + vignette. */
export const Shell: React.FC<{children: React.ReactNode; tint?: string}> = ({children, tint}) => (
	<AbsoluteFill style={{overflow: 'hidden'}}>
		<Background tint={tint} />
		{children}
		<FilmGrain />
	</AbsoluteFill>
);

/** Alaska fill red → teal between two frames (the sale). */
export const useSaleColor = (from: number, to: number) => {
	const f = useCurrentFrame();
	return interpolateColors(f, [from, to], [C.red, C.teal]);
};

export const RU = C.red;
export const RU_DIM = '#8E2732';
export const US = C.teal;
export const US_DIM = '#1D7F76';
export const UK = C.gold;
export const UK_DIM = '#A8843A';
