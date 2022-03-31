import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import Calendar from '../components/Calendar';
import Board from '../components/classhome/Board';
import ClassInfo from '../components/classhome/ClassInfo';
import Detail from '../components/classhome/Detail';
import WritePost from '../components/classhome/WritePost';

const ClassHome = () => {
	const { postid, updateid, page, classid } = useParams();
	const navigate = useNavigate();

	const toClassRoom = () => {
		navigate(`/classroom/${classid}`);
	};

	return (
		<Container>
			<LeftBox>
				<ClassInfo />
				<Calendar />
			</LeftBox>

			{postid ? (
				updateid ? (
					<WritePost />
				) : (
					<Detail />
				)
			) : page ? (
				<Board />
			) : (
				<WritePost />
			)}
			<ClassRoomButton onClick={toClassRoom} />
		</Container>
	);
};

export default ClassHome;

const Container = styled.div`
	width: 1200px;
	height: 850px;
	margin: 60px auto 0;
	display: flex;
	justify-content: space-between;
	position: relative;
`;

const LeftBox = styled.div`
	width: 280px;
	height: 850px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
`;

const ClassRoomButton = styled.button`
	background: none;
	border: none;
	background-image: url('/images/toclassroom.png');
	width: 160px;
	height: 105px;
	position: absolute;
	top: -80px;
	right: 150px;
	z-index: 0;
	cursor: pointer;
	`;
