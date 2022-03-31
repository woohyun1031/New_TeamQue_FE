import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import Calendar from '../components/Calendar';
import Board from '../components/classhome/Board';
import ClassInfo from '../components/classhome/ClassInfo';
import Detail from '../components/classhome/Detail';
import WritePost from '../components/classhome/WritePost';

const ClassHome = () => {
	const { postid, updateid, page } = useParams();

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
		</Container>
	);
};

export default ClassHome;

const Container = styled.div`
	width: 1200px;
	height: 850px;
	margin: 100px auto;
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
