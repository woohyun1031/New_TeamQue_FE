import ReackHlsPlayer from 'react-hls-player';
import styled from 'styled-components';

const Stream = () => {
	return (
		<>
			<ReackHlsPlayer
				src='http://xpecter.shop/live/1234/index.m3u8'
				width='890'
				height='500'
			/>
		</>
	);
};

export default Stream;