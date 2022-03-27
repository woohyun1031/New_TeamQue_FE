import ReackHlsPlayer from 'react-hls-player';

const Stream = () => {
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
