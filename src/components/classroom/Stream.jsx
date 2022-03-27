import ReackHlsPlayer from 'react-hls-player';
import styled from 'styled-components';

const Stream = () => {
	console.log(1);
	return (
		<>
			{console.log('stram start')}
			{console.log('stram start')}
			<ReackHlsPlayer
				src='http://xpecter.shop/live/1234/index.m3u8'
				width='890'
				height='500'
			/>
		</>
	);
};

export default Stream;

const Player = styled(ReackHlsPlayer)``;
