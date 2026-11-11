import React from 'react';
import {Composition} from 'remotion';
import {Video} from './Video';
import {Thumbnail} from './Thumbnail';
import {TOTAL_FRAMES} from './timeline';

export const RemotionRoot: React.FC = () => (
	<>
		<Composition id="Video" component={Video} durationInFrames={TOTAL_FRAMES} fps={30} width={1920} height={1080} />
		<Composition id="Thumbnail" component={Thumbnail} durationInFrames={1} fps={30} width={1280} height={720} />
	</>
);
