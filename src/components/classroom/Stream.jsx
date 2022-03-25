import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import axios from 'axios';
import config from '../../config';

function Stream() {
	const [liveStreams, setLiveStreams] = useState([]);

	useEffect(() => {
		getLiveStreams();
	}, []);

	const getLiveStreams = () => {
		axios.get('http://127.0.0.1:' + { config } + '/api/streams').then((res) => {
			let streams = res.data;
			if (typeof (streams['live'] !== 'undefined')) {
				getStreamsInfo(streams['live']);
			}
		});
	};

	const getStreamsInfo = (live_streams) => {
		axios
			.get('/streams/info', {
				params: {
					streams: live_streams,
				},
			})
			.then((res) => {
				this.setState(
					{
						live_streams: res.data,
					},
					() => {
						console.log(this.state);
					}
				);
			});
	};

	const streams = () => {
		return liveStreams.map((stream, index) => {
			<div className='stream col-xs-12 col-sm-12 col-md-3 col-lg-4' key={index}>
				<span className='live-label'>LIVE</span>
				<Link to={'/stream/' + stream.username}>
					<div className='stream-thumbnail'>
						<img src={'/thumbnails/' + stream.stream_key + '.png'} />
					</div>
				</Link>

				<span className='username'>
					<Link to={'/stream/' + stream.username}>{stream.username}</Link>
				</span>
			</div>;
		});
	};

	return (
		<div>
			<div className='container mt-5'>
				<h4>Live Streams</h4>
				<hr className='my-4' />

				<div className='streams row'>{streams()}</div>
			</div>
		</div>
	);
}

export default Stream;

const Container = styled.div`
	position: relative;
	height: 80vh;
	margin: 0 4.17vw;
	box-shadow: 0px 4px 35px 4px rgba(162, 162, 162, 0.25);
	border-radius: 16px;
	box-sizing: border-box;
	width: 22%;
`;
