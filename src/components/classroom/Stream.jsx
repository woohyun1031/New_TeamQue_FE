import ReackHlsPlayer from 'react-hls-player';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

const Stream = () => {
	const navigate = useNavigate()
	const {classid} = useParams()

	const toClassHome = () => {
		navigate(`/classhome/${classid}/1`)
	}
	return (
		<Container>
			<Video
				src='http://xpecter.shop/live/1234/index.m3u8'
				width='890'
				height='500'
			/>
			<ClassHoomButton onClick={toClassHome}/>
		</Container>
	);
};

export default Stream;

const Container = styled.div`
	position: relative;
`

const Video = styled(ReackHlsPlayer)`
	width: 888px;
	height: 500px;
	border-radius: 7px;
	background-color: #DFDFDF;
	z-index: 1;
`

const ClassHoomButton = styled.button`
	background: none;
	border: none;
	background-image: url('/images/toclasshome.png');
	background-position: center top;
	background-repeat: no-repeat;
	width: 160px;
	height: 80px;
	position: absolute;
	top: -80px;
	right: 80px;
	z-index: 0;
	cursor: pointer;
	`;
