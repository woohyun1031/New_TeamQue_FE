import { ChangeEvent, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import styled from 'styled-components';
import apis from '../api';
import Stream from '../components/classroom/Stream';
import { RootState } from '../store/configStore';

type stateType = 'connect' | 'disconnect' | 'correct' | 'incorrect' | 'away';

type studentType = {
	userId: number;
	name: string;
	state: stateType;
};

type chatType = {
	chatId: string;
	userId: number;
	userName: string;
	content: string;
	type: 'chat' | 'question';
	like?: string[];
	isResolved?: boolean;
};

let socket: Socket;

const ClassRoom = () => {
	const [classInfo, setClassInfo] = useState<{
		title: string;
		teacher: string;
	}>();
	const { classid } = useParams();
	const loadClassInfo = async () => {
		const response = await apis.loadClassInfo(classid as string);
		setClassInfo(response.data);
	};

	useEffect(() => {
		loadClassInfo();
	}, []);

	// 소켓로직 시작
	const params = useParams();
	const [input, setInput] = useState('');
	const [chatList, setChatList] = useState<chatType[]>([]);
	const [myState, setMyState] = useState<stateType>('connect');
	const [students, setStudents] = useState<studentType[]>([]);
	const [isConnected, setIsConnected] = useState(false);
	const [check, setChecked] = useState({
		chatCheck: false,
		questionCheck: false,
	});
	const { chatCheck, questionCheck } = check;

	const [isQuestion, setIsQuestion] = useState(false);
	const user = useSelector((state: RootState) => state.user);

	const myStateImage = {
		connect: '/images/myConnect.png',
		correct: '/images/myCorrect.png',
		incorrect: '/images/myIncorrect.png',
		away: '/images/myQuestion.png',
	};

	const studentStateImage = {
		disconnect: '/images/disconnect.png',
		connect: '/images/connect.png',
		correct: '/images/correct.png',
		incorrect: '/images/incorrect.png',
		away: '/images/question.png',
	};

	// const SOCKETSERVER = 'ws://noobpro.shop';
	const SOCKETSERVER = 'ws://xpecter.shop';
	const classId = params.classid;

	const accessToken = sessionStorage.getItem('accessToken');

	const socketInitiate = async () => {
		socket = io(SOCKETSERVER);
		socket.emit('init', { userId: user.id, accessToken });
		socket.on('initOk', () => {
			socket.emit(
				'joinRoom',
				{ classId },
				({
					chatList,
					userList,
				}: {
					chatList: {
						userId: number;
						userName: string;
						content: string;
						isResolved: boolean;
						uuid: string;
						like: string[];
					}[];
					userList: { key: { userName: string; state: stateType } };
				}) => {
					setChatList(
						chatList.map(
							({ userId, userName, content, isResolved, uuid, like }) => ({
								userId,
								userName,
								content,
								isResolved,
								chatId: uuid,
								type: 'question',
								like
							})
						)
					);
					setStudents(
						Object.entries(userList).map(([key, { userName, state }]) => ({
							userId: parseInt(key),
							name: userName,
							state: state,
						}))
					);
				}
			);
			setIsConnected(true);
		});

		socket.on('changeState', ({ userId, state }) => {
			setStudents((prev) =>
				prev.map((student: studentType) =>
					student.userId === userId ? { ...student, state } : student
				)
			);
		});
		socket.on('receiveResolved', ({ chatId }) => {
			setChatList((prev) =>
				prev.map((chat) =>
					chat.chatId === chatId
						? { ...chat, isResolved: !chat.isResolved }
						: chat
				)
			);
		});

		socket.on('receiveChat', (data: chatType) => {
			setChatList((prev) => [...prev, { ...data, type: 'chat' }]);
		});

		socket.on('receiveQuestion', (data: chatType) => {
			setChatList((prev) => [
				...prev,
				{
					...data,
					type: 'question',
				},
			]);
		});

		socket.on('receiveLike', ({ chatId, name }) => {
			setChatList((prev) =>
				prev.map((chat) =>
					chat.chatId === chatId && chat.like
						? { ...chat, like: [...chat.like, name] }
						: chat
				)
			);
		});
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

	const changeMyState = (state: stateType) => {
		if (myState === state) {
			state = 'connect';
		}
		socket.emit('changeMyState', { classId, state }, () => {
			setMyState(state);
		});
	};

	const sendChat = () => {
		if (input) {
			if (isQuestion) {
				socket.emit(
					'sendQuestion',
					{ content: input, classId },
					({ id, content }: { id: string; content: string }) => {
						setChatList([
							...chatList,
							{
								chatId: id,
								userId: user.id,
								userName: user.name,
								content,
								type: 'question',
								like: [],
								isResolved: false,
							},
						]);
					}
				);
				setInput('');
			} else {
				socket.emit(
					'sendChat',
					{ content: input, classId },
					({ id, content }: { id: string; content: string }) => {
						console.log(id, content);
						setChatList([
							...chatList,
							{
								chatId: id,
								userId: user.id,
								userName: user.name,
								content,
								type: 'chat',
							},
						]);
					}
				);
				setInput('');
			}
		}
	};

	const changeMessage = (e: ChangeEvent<HTMLInputElement>) => {
		setInput(e.target.value);
	};

	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, checked } = e.target;
		setChecked({
			...check,
			[name]: checked,
		});
	};

	const toggleChatType = (e: ChangeEvent<HTMLInputElement>) => {
		const { checked } = e.target;
		setIsQuestion(checked);
	};

	const toggleResolve = (id: string) => {
		socket.emit('sendResolved', { chatId: id, classId }, () => {
			setChatList((prev) =>
				prev.map((chat) =>
					chat.chatId === id ? { ...chat, isResolved: !chat.isResolved } : chat
				)
			);
		});
	};

	const likeQuestion = (id: string) => {
		socket.emit('sendLike', { chatId: id, classId }, () => {
			setChatList((prev) =>
				prev.map((chat) =>
					chat.chatId === id && chat.like
						? { ...chat, like: [...chat.like, user.name] }
						: chat
				)
			);
		});
	};

	// 소켓로직 끝

	return (
		<Container>
			<LeftBox>
				<ClassInfo>{classInfo?.title}</ClassInfo>
				<Stream />
				<p>{user.name}</p>
				<p>{myState}</p>
				<button onClick={() => changeMyState('correct')}>Correct</button>
				<button onClick={() => changeMyState('incorrect')}>Incorrect</button>
				<button onClick={() => changeMyState('away')}>Away</button>
				{students.map((student: studentType) => {
					if (student.userId !== user.id) {
						return (
							<li key={student.userId}>
								<p>{student.name}</p>
								<p>{student.state}</p>
							</li>
						);
					}
				})}
			</LeftBox>
			<div>
				<label>
					<input name='commonCheck' type='checkbox' onChange={onChange} />
					채팅
				</label>
				<label>
					<input name='questionCheck' type='checkbox' onChange={onChange} />
					질문
				</label>
				{chatList &&
					chatList.map(
						({
							chatId,
							userId,
							type,
							userName: name,
							content,
							isResolved,
							like,
						}: chatType) => {
							if (type === 'chat' && !chatCheck) {
								return (
									<div key={chatId}>
										<div>{name}</div>
										<div>{content}</div>
									</div>
								);
							} else if (type === 'question' && !questionCheck) {
								return (
									<div key={chatId}>
										<div>{name === user.name && '내 질문'}</div>
										<div>{name}</div>
										<div>{content}</div>
										<div>{isResolved && '해결'}</div>
										{userId === user.id && (
											<button onClick={() => toggleResolve(chatId)}>
												해결
											</button>
										)}
										<button onClick={() => likeQuestion(chatId)}>추천</button>
										{/* <div>
											{like?.map((student, index) => (
												<div key={index}>{student}</div>
											))}
										</div> */}
									</div>
								);
							}
						}
					)}
				<div>
					<input
						type='text'
						value={input}
						onChange={changeMessage}
						onKeyPress={(e) => {
							if (e.key === 'Enter') {
								sendChat();
							}
						}}
					/>
					<button onClick={sendChat}>전송</button>
					<label>
						질문
						<input type='checkbox' name='queCheck' onChange={toggleChatType} />
					</label>
				</div>
			</div>
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
	color: ${({ theme }) => theme.colors.title};
`;
