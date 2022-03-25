import ReackHlsPlayer from 'react-hls-player'
import styled from 'styled-components';

const Stream = () => {
	return (
		<>
			<Player src='http://xpecter.shop/live/1234/index.m3u8' autoPlay width='890' height='500' />
		</>
	);
};

export default Stream;

const Player = styled(ReackHlsPlayer)`
`