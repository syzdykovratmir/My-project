import React from 'react';
import {montserrat} from '../theme';
import {asset} from './assets';

/** Small credit line: source + author + license. */
export const SourceTag: React.FC<{id: string; color?: string; style?: React.CSSProperties}> = ({id, color = '#6B6255', style}) => {
	const a = asset(id);
	if (!a) return null;
	const author = a.author && !/unknown/i.test(a.author) ? a.author.split(/[,;(]/)[0].trim() : 'автор неизвестен';
	return (
		<div style={{fontFamily: montserrat, fontSize: 14, color, lineHeight: 1.3, ...style}}>
			{author.slice(0, 60)} · Wikimedia Commons · {a.license || 'PD'}
		</div>
	);
};
