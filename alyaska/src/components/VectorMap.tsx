import React, {useMemo} from 'react';
import {geoAzimuthalEqualArea, geoGraticule10, geoPath, GeoProjection} from 'd3-geo';
import {feature} from 'topojson-client';
import type {Feature, FeatureCollection, Geometry, MultiPolygon, Polygon} from 'geojson';
import {interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import world50 from 'world-atlas/countries-50m.json';
import world10 from 'world-atlas/countries-10m.json';
import {C, montserrat} from '../theme';

/* ---------- geography ---------- */

type F = Feature<Geometry, {name: string}>;
const ID = {russia: '643', usa: '840', canada: '124'};

const splitAlaska = (usa: F) => {
	const g = usa.geometry as MultiPolygon;
	const isAk = (poly: number[][][]) => {
		const [lon, lat] = poly[0][0];
		return (lon < -129 && lat > 50) || lon > 170;
	};
	const ak: F = {...usa, id: 'alaska', geometry: {type: 'MultiPolygon', coordinates: g.coordinates.filter(isAk)}};
	const rest: F = {...usa, id: 'usa48', geometry: {type: 'MultiPolygon', coordinates: g.coordinates.filter((p) => !isAk(p))}};
	return {ak, rest};
};

const cache: Record<string, F[]> = {};
const countries = (res: '50m' | '10m'): F[] => {
	if (!cache[res]) {
		const topo = (res === '50m' ? world50 : world10) as any;
		const fc = feature(topo, topo.objects.countries) as unknown as FeatureCollection<Geometry, {name: string}>;
		const out: F[] = [];
		for (const f of fc.features) {
			if (String(f.id) === ID.usa) {
				const {ak, rest} = splitAlaska(f as F);
				out.push(ak, rest);
			} else out.push(f as F);
		}
		cache[res] = out;
	}
	return cache[res];
};

/* ---------- views ---------- */

export type View = {rotate: [number, number]; scale: number; res: '50m' | '10m'};
export const VIEWS: Record<string, View> = {
	// Chukotka + Alaska + NW Canada, Bering Strait in the middle
	bering: {rotate: [158, -60], scale: 1650, res: '50m'},
	// North Pacific: Kamchatka - Alaska - California (Fort Ross)
	pacific: {rotate: [155, -50], scale: 1050, res: '50m'},
	// Bering Strait close-up (Diomede islands)
	strait: {rotate: [169, -65.8], scale: 14000, res: '10m'},
	// Alaska + Yukon (gold, oil, pipeline)
	alaska: {rotate: [148, -62], scale: 2600, res: '50m'},
	// Alaska - Siberia (ALSIB route)
	alsib: {rotate: [-152.5, -63], scale: 1250, res: '50m'},
};

const makeProj = (v: View): GeoProjection =>
	geoAzimuthalEqualArea().rotate(v.rotate).scale(v.scale).translate([960, 540]).clipAngle(80);

/* ---------- props ---------- */

export type MapLabel = {
	text: string;
	lon: number;
	lat: number;
	at?: number;
	dx?: number;
	dy?: number;
	size?: number;
	color?: string;
	dot?: boolean;
	italic?: boolean;
	align?: 'left' | 'right' | 'center';
};
export type MapLine = {
	coords: [number, number][];
	at?: number;
	dur?: number;
	color?: string;
	width?: number;
	arrow?: boolean;
	dashed?: boolean;
};
export type Camera = {k: number; lon?: number; lat?: number};

type Props = {
	view: keyof typeof VIEWS;
	/** fills by feature id: 'alaska', 'usa48', '643' (Russia), '124' (Canada)… */
	fills?: Record<string, string>;
	defaultFill?: string;
	labels?: MapLabel[];
	lines?: MapLine[];
	/** stroke-draw progress (0..1) of the Alaska outline highlight */
	outline?: number;
	outlineColor?: string;
	camera?: {from: Camera; to: Camera; at?: number; dur?: number};
	note?: string;
	showScale?: boolean;
	showCompass?: boolean;
	pulse?: {lon: number; lat: number; color?: string; at?: number}[];
	opacity?: number;
};

const NEUTRAL = '#252B45';

export const VectorMap: React.FC<Props & {sea?: boolean}> = ({
	sea = true,
	view,
	fills = {},
	defaultFill = NEUTRAL,
	labels = [],
	lines = [],
	outline = 0,
	outlineColor = C.gold,
	camera,
	note,
	showScale = true,
	showCompass = true,
	pulse = [],
	opacity = 1,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const v = VIEWS[view];
	const proj = useMemo(() => makeProj(v), [view]);
	const path = useMemo(() => geoPath(proj), [proj]);
	const feats = countries(v.res);
	const paths = useMemo(
		() => feats.map((f) => ({id: String(f.id), d: path(f) ?? ''})).filter((p) => p.d),
		[path],
	);
	const alaskaD = useMemo(() => paths.find((p) => p.id === 'alaska')?.d ?? '', [paths]);
	const grat = useMemo(() => path(geoGraticule10()) ?? '', [path]);

	// camera (zoom/pan) in projected pixel space
	let k = 1;
	let cx = 960;
	let cy = 540;
	if (camera) {
		const t = interpolate(frame, [camera.at ?? 0, (camera.at ?? 0) + (camera.dur ?? 90)], [0, 1], {
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
			easing: Easing.inOut(Easing.cubic),
		});
		const c = (cam: Camera) => (cam.lon !== undefined ? (proj([cam.lon, cam.lat!]) as [number, number]) : [960, 540]);
		const [ax, ay] = c(camera.from);
		const [bx, by] = c(camera.to);
		k = camera.from.k + (camera.to.k - camera.from.k) * t;
		cx = ax + (bx - ax) * t;
		cy = ay + (by - ay) * t;
	}
	const toScreen = (lon: number, lat: number) => {
		const p = proj([lon, lat]);
		if (!p) return null;
		return [(p[0] - cx) * k + 960, (p[1] - cy) * k + 540];
	};
	const G = `translate(960 540) scale(${k}) translate(${-cx} ${-cy})`;

	// scale bar: pick a nice distance ≈ 220px
	const center = proj.invert!([cx, cy]) ?? [0, 60];
	const kmPerPx = (() => {
		const lat = center[1];
		const dLon = 100 / (111.32 * Math.cos((lat * Math.PI) / 180));
		const a = proj(center as [number, number])!;
		const b = proj([center[0] + dLon, lat])!;
		return 100 / (Math.hypot(b[0] - a[0], b[1] - a[1]) * k);
	})();
	const nice = [1, 2, 5, 10, 20, 50, 100, 200, 250, 500, 1000, 2000];
	const km = nice.reduce((best, n) => (Math.abs(n / kmPerPx - 220) < Math.abs(best / kmPerPx - 220) ? n : best), 500);
	const barPx = km / kmPerPx;

	return (
		<div style={{position: 'absolute', inset: 0, opacity}}>
			<svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
				<defs>
					<radialGradient id="sea" cx="50%" cy="45%" r="75%">
						<stop offset="0%" stopColor="#10204A" />
						<stop offset="100%" stopColor="#070C20" />
					</radialGradient>
					<marker id="arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
						<path d="M0,0 L10,5 L0,10 z" fill={C.gold} />
					</marker>
				</defs>
				{sea ? <rect width={1920} height={1080} fill="url(#sea)" /> : null}
				<g transform={G}>
					<path d={grat} fill="none" stroke="#1E2C5A" strokeWidth={1} vectorEffect="non-scaling-stroke" />
					{paths.map((p) => (
						<path
							key={p.id + p.d.length}
							d={p.d}
							fill={fills[p.id] ?? defaultFill}
							stroke="#E8E2D0"
							strokeOpacity={0.85}
							strokeWidth={2}
							strokeLinejoin="round"
							vectorEffect="non-scaling-stroke"
						/>
					))}
					{outline > 0 ? (
						<path
							d={alaskaD}
							fill="none"
							stroke={outlineColor}
							strokeWidth={3}
							pathLength={1}
							strokeDasharray="1 1"
							strokeDashoffset={1 - outline}
							vectorEffect="non-scaling-stroke"
						/>
					) : null}
					{lines.map((l, i) => {
						const d = path({type: 'LineString', coordinates: l.coords}) ?? '';
						const p = interpolate(frame, [l.at ?? 0, (l.at ?? 0) + (l.dur ?? 45)], [0, 1], {
							extrapolateLeft: 'clamp',
							extrapolateRight: 'clamp',
							easing: Easing.inOut(Easing.quad),
						});
						if (p <= 0) return null;
						return (
							<path
								key={i}
								d={d}
								fill="none"
								stroke={l.color ?? C.gold}
								strokeWidth={l.width ?? 3}
								strokeLinecap="round"
								pathLength={1}
								strokeDasharray={l.dashed && p >= 1 ? '0.012 0.01' : '1 1'}
								strokeDashoffset={l.dashed && p >= 1 ? 0 : 1 - p}
								markerEnd={l.arrow && p > 0.97 ? 'url(#arrow)' : undefined}
								vectorEffect="non-scaling-stroke"
							/>
						);
					})}
				</g>
				{pulse.map((pp, i) => {
					const s = toScreen(pp.lon, pp.lat);
					if (!s) return null;
					const f = frame - (pp.at ?? 0);
					if (f < 0) return null;
					const ph = (f % 45) / 45;
					return (
						<g key={i}>
							<circle cx={s[0]} cy={s[1]} r={8 + ph * 36} fill="none" stroke={pp.color ?? C.gold} strokeWidth={3} opacity={1 - ph} />
							<circle cx={s[0]} cy={s[1]} r={8} fill={pp.color ?? C.gold} />
						</g>
					);
				})}
			</svg>
			{labels.map((l, i) => {
				const s = toScreen(l.lon, l.lat);
				if (!s) return null;
				const e = spring({frame: frame - (l.at ?? 0), fps, config: {damping: 14}});
				if (e <= 0.001) return null;
				const align = l.align ?? 'left';
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: s[0],
							top: s[1],
							transform: `translate(${align === 'left' ? 0 : align === 'right' ? -100 : -50}%, -50%)`,
							opacity: e,
							display: 'flex',
							alignItems: 'center',
							gap: 10,
							flexDirection: align === 'right' ? 'row-reverse' : 'row',
						}}
					>
						{l.dot !== false ? (
							<div
								style={{
									width: 14,
									height: 14,
									borderRadius: 7,
									background: l.color ?? C.white,
									border: `2px solid ${C.navyDeep}`,
									transform: `scale(${e})`,
									flexShrink: 0,
								}}
							/>
						) : null}
						<div
							style={{
								fontFamily: montserrat,
								fontWeight: 700,
								fontSize: l.size ?? 26,
								fontStyle: l.italic ? 'italic' : 'normal',
								color: l.color ?? C.white,
								marginLeft: l.dx ?? 0,
								marginTop: l.dy ?? 0,
								whiteSpace: 'nowrap',
								textShadow: '0 2px 6px rgba(0,0,0,0.9), 0 0 2px rgba(0,0,0,1)',
								letterSpacing: 0.5,
								transform: `translateY(${(1 - e) * 10}px)`,
							}}
						>
							{l.text}
						</div>
					</div>
				);
			})}
			{showScale ? (
				<div style={{position: 'absolute', left: 60, bottom: 96, fontFamily: montserrat, color: C.white}}>
					<div style={{fontSize: 18, fontWeight: 600, marginBottom: 6}}>{km} км</div>
					<div style={{width: barPx, height: 10, border: `2px solid ${C.white}`, borderTop: 'none'}} />
				</div>
			) : null}
			{showCompass ? (
				<svg width={70} height={90} style={{position: 'absolute', right: 70, bottom: 110}} viewBox="0 0 70 90">
					<polygon points="35,6 47,48 35,40 23,48" fill={C.white} />
					<polygon points="35,74 47,48 35,56 23,48" fill="none" stroke={C.white} strokeWidth={2} />
					<text x={35} y={90} fill={C.white} fontFamily={montserrat} fontWeight={800} fontSize={16} textAnchor="middle">
						С
					</text>
				</svg>
			) : null}
			{note ? (
				<div
					style={{
						position: 'absolute',
						right: 60,
						bottom: 60,
						fontFamily: montserrat,
						fontSize: 17,
						fontWeight: 600,
						color: C.mute,
						letterSpacing: 1.5,
						textTransform: 'uppercase',
					}}
				>
					{note}
				</div>
			) : null}
		</div>
	);
};

export const PLACES = {
	sitka: [-135.33, 57.05] as [number, number],
	kodiak: [-152.4, 57.79] as [number, number],
	fortRoss: [-123.24, 38.51] as [number, number],
	petropavlovsk: [158.65, 53.02] as [number, number],
	anchorage: [-149.9, 61.22] as [number, number],
	fairbanks: [-147.72, 64.84] as [number, number],
	nome: [-165.41, 64.5] as [number, number],
	skagway: [-135.31, 59.46] as [number, number],
	dawson: [-139.43, 64.06] as [number, number],
	prudhoe: [-148.34, 70.25] as [number, number],
	valdez: [-146.35, 61.13] as [number, number],
	unalaska: [-166.54, 53.87] as [number, number],
	chukotka: [172, 66.5] as [number, number],
	uelkal: [-179.3, 65.53] as [number, number],
	yakutsk: [129.7, 62.03] as [number, number],
	krasnoyarsk: [92.87, 56.01] as [number, number],
	bigDiomede: [-169.05, 65.78] as [number, number],
	littleDiomede: [-168.93, 65.75] as [number, number],
	washington: [-77.04, 38.9] as [number, number],
	stPetersburg: [30.3, 59.94] as [number, number],
};
