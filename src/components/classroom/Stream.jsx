import { memo, useCallback } from 'react';
import ReackHlsPlayer from 'react-hls-player';
import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import api from '../../api';

const Stream = () => {
	const navigate = useNavigate();
	const { classid } = useParams();
	const { data } = useQuery('streamKey', () => api.getStreamCode(classid));
	const toClassHome = useCallback(() => {

		navigate(`/classhome/${classid}/1`);
	}, []);
	return (
		<Container>
			<Video
				src={`http://xpecter.shop/live/${data?.streamKey}/index.m3u8`}
				autoPlay
				controls
			/>
			<ClassHoomButton onClick={toClassHome} />
		</Container>
	);
};

export default memo(Stream);

const Container = styled.div`
	position: relative;
`;

const Video = styled(ReackHlsPlayer)`
	width: 888px;
	height: 500px;
	border-radius: 7px;
	background-color: #dfdfdf;
	z-index: 1;
`;

const ClassHoomButton = styled.button`
	background-image: url('/images/toclasshome.png');
	background-repeat: no-repeat;
	width: 160px;
	height: 80px;
	position: absolute;
	top: -80px;
	right: 80px;
	z-index: 0;
	transition: 0.3s;
	&:hover {
		filter: brightness(110%);
	}
	&:active {
		filter: brightness(90%);
	}
`;
