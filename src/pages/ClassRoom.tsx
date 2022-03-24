import React from 'react';
import styled from 'styled-components';
import Chat from '../components/classroom/Chat';
import Reaction from '../components/classroom/Reaction';

const ClassRoom = () => {
	return (
		<Container>
			<LeftBox>
				<ClassInfo />
				<Screen />
				<Reaction />
			</LeftBox>
			<Chat />
		</Container>
	);
};

export default ClassRoom;

const Container = styled.div`
	/* 사이즈 */
	width: 1200px;
	height: 850px;
	/* 레이아웃 */
  margin: 100px auto 0;
	display: flex;
	justify-content: space-between;
`;

const LeftBox = styled.div`
	/* 레이아웃 */
	display: flex;
	flex-direction: column;
	justify-content: space-between;
`;
const ClassInfo = styled.div`
	/* 사이즈 */
	width: 360px;
	height: 30px;
	/* 임시 스타일 코드 */
	background-color: #ccc;
`;

const Screen = styled.div`
	/* 사이즈 */
	width: 890px;
	height: 500px;
	/* 임시 스타일 코드 */
	background-color: #ccc;
`;

const ReactionBox = styled.div`
	/* 사이즈 */
	width: 890px;
	height: 300px;
	/* 임시 스타일 코드 */
	background-color: #ccc;
`;

const ChatBox = styled.div`
	/* 사이즈 */
	width: 280px;
	height: 850px;
	/* 임시 스타일 코드 */
	background-color: #ccc;
`;
