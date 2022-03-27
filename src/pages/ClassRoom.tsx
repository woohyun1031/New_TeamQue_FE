import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import apis from '../api';
import Chat from '../components/classroom/Chat';
import Reaction from '../components/classroom/Reaction';
import Stream from '../components/classroom/Stream';

const ClassRoom = () => {
	const [classInfo, setClassInfo] = useState<{ title: string, teacher: string }>();
	const { classid } = useParams();
	const loadClassInfo = async () => {
		const response = await apis.loadClassInfo(classid as string);
		setClassInfo(response.data);
	};

	useEffect(() => {
		loadClassInfo();
	}, []);

	return (
		<Container>
			<LeftBox>
				<ClassInfo>{classInfo?.title}</ClassInfo>
				<Stream />
				<Reaction teacher={classInfo?.teacher}/>
			</LeftBox>
			<Chat />
		</Container>
	);
};

export default ClassRoom;

const Container = styled.div`
	width: 1200px;
	height: 850px;
	margin: 100px auto 0;
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
