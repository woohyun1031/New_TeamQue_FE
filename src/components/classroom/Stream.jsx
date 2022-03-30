import ReackHlsPlayer from 'react-hls-player';
import styled from 'styled-components';

const Stream = () => {
	return (
		<>
			<Video
				src='http://xpecter.shop/live/1234/index.m3u8'
				width='890'
				height='500'
			/>
		</>
	);
};

export default Stream;

const Video = styled(ReackHlsPlayer)`
	width: 888px;
	height: 500px;
	border-radius: 7px;
	background-color: #DFDFDF;
`