import assets from '../data/assets.json';
import {staticFile} from 'remotion';

export type Asset = {
	file: string;
	title: string;
	caption: string;
	author: string;
	date: string;
	license: string;
	source: string;
	width: number;
	height: number;
};

const A = assets as Record<string, Asset>;
export const asset = (id: string): Asset | undefined => A[id];
export const photoSrc = (id: string) => staticFile(`photos/${A[id]?.file ?? 'missing.jpg'}`);
