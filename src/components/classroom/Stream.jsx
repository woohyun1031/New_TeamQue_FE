import Hls from 'hls.js';
import { useEffect, useRef } from 'react';
import ReackHlsPlayer from 'react-hls-player';

const Stream = () => {
	const video = useRef();
	const videoSrc = 'http://xpecter.shop/live/1234/index.m3u8';

	return (
		<>
			<ReackHlsPlayer src='http://xpecter.shop/live/1234/index.m3u8' width='800' height='400'/>
		</>
	);
};

export default Stream;
