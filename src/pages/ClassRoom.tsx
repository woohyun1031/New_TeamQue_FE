import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import apis from '../api';
import Chat from '../components/classroom/Chat';
import Reaction from '../components/classroom/Reaction';
import Stream from '../components/classroom/Stream';

const ClassRoom = () => {
	const [classInfo, setClassInfo] = useState<{title: string}>()
	const { classid } = useParams();
	const fetch = async () => {
		const response = await apis.loadClassInfo(classid as string);
		setClassInfo(response.data);
	};
	console.log(classInfo)
	useEffect(() => {
		fetch();
	}, []);
	return (
		<Container>
			<LeftBox>
<<<<<<< HEAD
				<ClassInfo>
					{classInfo && classInfo.title}
				</ClassInfo>
=======
				<ClassInfo>Xpecter의 Nest.js 강좌</ClassInfo>
>>>>>>> 875c6b18f9cfeb62d875867676421e20b5222fc0
				<Stream />
				<Reaction />
			</LeftBox>
			<Chat />
		</Container>
	);
};

export default ClassRoom;

const Container = styled.div`
	width: 1200px;
	height: 850px;
<<<<<<< HEAD
  margin: 100px auto 0;
=======
	/* 레이아웃 */
	margin: 100px auto 0;
>>>>>>> 875c6b18f9cfeb62d875867676421e20b5222fc0
	display: flex;
	justify-content: space-between;
`;

const LeftBox = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
`;
const ClassInfo = styled.h2`
	width: 360px;
	height: 30px;
	font-size: ${({ theme }) => theme.fontSizes.xxxlg};
`;
