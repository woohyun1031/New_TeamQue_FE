import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import styled from 'styled-components';
import api from '../api';
import Chatting from '../components/classroom/Chatting';
import State from '../components/classroom/State';
import Stream from '../components/classroom/Stream';

type stateType = 'connect' | 'disconnect' | 'correct' | 'incorrect' | 'away';

type studentType = {
	userId: number;
	name: string;
	state: stateType;
};

type chatType = {
	chatId: string;
	userId: number;
	name: string;
	content: string;
	type: 'chat' | 'question';
	likes?: { userId: number }[];
	isResolved?: boolean;
};

export let socket: Socket;
const ClassRoom = () => {
	const [classInfo, setClassInfo] = useState<{
		title: string;
		teacher: string;
	}>();
	const { classid } = useParams();
	const loadClassInfo = async () => {
		const data = await api.loadClassData(classid as string);
		console.log(data);
		setClassInfo(data);
	};

	useEffect(() => {
		loadClassInfo();
	}, []);

	const params = useParams();
	const [students, setStudents] = useState<studentType[]>([]);
	const [isConnected, setIsConnected] = useState(false);
	const [chatList, setChatList] = useState<chatType[]>([]);

	const classId = params.classid;

	const socketInitiate = () => {
		socket = io(process.env.REACT_APP_SOCKET_BASE_URL as string, {
			extraHeaders: {
				Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
			},
		});
		socket.emit(
			'joinRoom',
			{ classId },
			({
				chatList,
				userList,
			}: {
				chatList: {
					userId: number;
					name: string;
					content: string;
					isResolved: boolean;
					uuid: string;
					likes: { userId: number }[];
				}[];
				userList: { key: { name: string; state: stateType } };
			}) => {
				setChatList(
					chatList.map(
						({ userId, name, content, isResolved, uuid, likes }) => ({
							userId,
							name,
							content,
							isResolved,
							chatId: uuid,
							type: 'question',
							likes,
						})
					)
				);
				setStudents(
					Object.entries(userList).map(([key, { name, state }]) => ({
						userId: parseInt(key),
						name,
						state,
					}))
				);
			}
		);
		setIsConnected(true);
	};

	useEffect(() => {
		return () => {
			socket.disconnect();
			setIsConnected(false);
		};
	}, []);

	useEffect(() => {
		if (!isConnected) {
			socketInitiate();
		}
	}, [isConnected]);

	return (
		<Container>
			<LeftBox>
				<ClassInfo>
					<ClassTitle>{classInfo?.title}</ClassTitle>
					<ClassTeacher>{classInfo?.teacher}</ClassTeacher>
				</ClassInfo>
				<Stream />
				<State students={students} isConnected={isConnected} />
			</LeftBox>
			<Chatting chatData={chatList} isConnected={isConnected} />
		</Container>
	);
};

export default ClassRoom;

const Container = styled.div`
	width: 1200px;
	height: 850px;
	margin: 80px auto 0;
	display: flex;
	align-items: flex-end;
	justify-content: space-between;
`;

const ClassInfo = styled.div`
	display: flex;
	align-items: flex-end;
	margin-bottom: 10px;
`;

const ClassTitle = styled.h2`
	font-size: ${({ theme }) => theme.fontSizes.xxxlg};
	color: ${({ theme }) => theme.colors.title};
	margin-right: 10px;
`;

const ClassTeacher = styled.h4`
	font-size: 14px;
	color: ${({ theme }) => theme.colors.sub};
`;

const LeftBox = styled.div``;
