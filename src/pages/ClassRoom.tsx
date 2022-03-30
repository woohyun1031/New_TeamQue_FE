import { ChangeEvent, useEffect, useRef, useState } from 'react';
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
	name: string;
	content: string;
	type: 'chat' | 'question';
	likes?: { userId: number }[];
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

	const chatEndRef = useRef<null | HTMLDivElement>(null);

	const scrollToBottom = () => {
		chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	useEffect(() => {
		scrollToBottom();
	}, [chatList]);

	const SOCKETSERVER = 'ws://noobpro.shop';
	// const SOCKETSERVER = 'ws://xpecter.shop';
	const classId = params.classid;

	const socketInitiate = async () => {
		socket = io(SOCKETSERVER, {
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
			console.log(data);
			setChatList((prev) => [...prev, { ...data, type: 'chat' }]);
		});

		socket.on('receiveQuestion', (data: chatType) => {
			setChatList((prev) => [
				...prev,
				{
					...data,
					likes: [],
					type: 'question',
				},
			]);
		});

		socket.on('receiveLike', ({ chatId, userId }) => {
			setChatList((prev) =>
				prev.map((chat) =>
					chat.chatId === chatId && chat.likes
						? { ...chat, likes: [...chat.likes, userId] }
						: chat
				)
			);
		});

		socket.on('receiveLikeDown', ({ chatId, userId }) => {
			setChatList((prev) =>
				prev.map((chat) =>
					chat.likes && chat.chatId === chatId
						? {
								...chat,
								likes: chat.likes.filter((like) => like.userId !== userId),
						  }
						: chat
				)
			);
		});

		socket.on('receiveDelete', ({ chatId }) => {
			console.log(chatId);
			setChatList((prev) => prev.filter((chat) => chat.chatId !== chatId));
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
					({ chatId, content }: { chatId: string; content: string }) => {
						setChatList([
							...chatList,
							{
								chatId: chatId,
								userId: user.id,
								name: user.name,
								content,
								type: 'question',
								likes: [],
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
					({ chatId, content }: { chatId: string; content: string }) => {
						setChatList([
							...chatList,
							{
								chatId: chatId,
								userId: user.id,
								name: user.name,
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

	const changeMessage = (e: ChangeEvent<HTMLTextAreaElement>) => {
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
		socket.emit('sendLikeUp', { chatId: id, classId }, () => {
			setChatList((prev) =>
				prev.map((chat) =>
					chat.likes && chat.chatId === id
						? { ...chat, likes: [...chat.likes, { userId: user.id }] }
						: chat
				)
			);
		});
	};

	const likeCancelQuestion = (id: string) => {
		socket.emit('sendLikeDown', { chatId: id, classId }, () => {
			setChatList((prev) =>
				prev.map((chat) =>
					chat.likes && chat.chatId === id
						? {
								...chat,
								likes: chat.likes.filter((like) => like.userId !== user.id),
						  }
						: chat
				)
			);
		});
	};

	const deleteQuestion = (id: string) => {
		socket.emit('sendDelete', { chatId: id, classId }, () => {
			setChatList((prev) => prev.filter((chat) => chat.chatId !== id));
		});
	};

	// 소켓로직 끝

	return (
		<Container>
			<LeftBox>
				<ClassInfo>
					<ClassTitle>{classInfo?.title}</ClassTitle>
					<ClassTeacher>{classInfo?.teacher}</ClassTeacher>
				</ClassInfo>
				<Stream />
				<StateBox>
					<MyStateBox>
						<UpperBox>
							<MyName>{user.name}</MyName>
							<StateButtons>
								<StateButton
									onClick={() => changeMyState('correct')}
									src='/images/correctbutton.png'
								/>
								<Hr />
								<StateButton
									onClick={() => changeMyState('incorrect')}
									src='/images/incorrectbutton.png'
								/>
								<Hr />
								<StateButton
									onClick={() => changeMyState('away')}
									src='/images/awaybutton.png'
								/>
							</StateButtons>
						</UpperBox>
						<MyStateCharacter src={`/images/my${myState}.png`} />
					</MyStateBox>
					<StudentStateBox>
						{students.map((student: studentType) => {
							if (student.userId !== user.id) {
								return (
									<StudentBox key={student.userId}>
										<StudentName>{student.name}</StudentName>
										<StudentState src={`/images/${student.state}.png`} />
									</StudentBox>
								);
							}
						})}
					</StudentStateBox>
				</StateBox>
			</LeftBox>
			<ChatContainer>
				<div>
					<ToggleButtons>
						<ToggleButton isChecked={check?.chatCheck}>
							<input name='chatCheck' type='checkbox' onChange={onChange} />
							채팅
						</ToggleButton>
						<ToggleButton isChecked={check?.questionCheck}>
							<input name='questionCheck' type='checkbox' onChange={onChange} />
							질문
						</ToggleButton>
					</ToggleButtons>
					<ChatBox isChecked={check?.chatCheck && check?.questionCheck}>
						{check?.chatCheck && check?.questionCheck && (
							<NoCheckedMessage>아무것도 선택하지 않으셨어요</NoCheckedMessage>
						)}
						{chatList &&
							chatList.map(
								({
									chatId,
									userId,
									type,
									name: name,
									content,
									isResolved,
									likes,
								}: chatType) => {
									if (type === 'chat' && !chatCheck) {
										return (
											<Chat key={chatId}>
												<ChatName>{name}</ChatName>
												<ChatContent>{content}</ChatContent>
											</Chat>
										);
									} else if (type === 'question' && !questionCheck) {
										return (
											<Question key={chatId}>
												<QuestionContent isResolved={isResolved ? true : false}>
													{userId === user.id && (
														<DeleteButton
															onClick={() => deleteQuestion(chatId)}
														/>
													)}
													{content}
													<Resolve />
												</QuestionContent>
												<ButtonButtons>
													{likes?.findIndex(
														(like) => like.userId === user.id
													) !== -1 ? (
														<BottomButton
															onClick={() => likeCancelQuestion(chatId)}
															isClicked={true}
														>
															<LikeCharacter />
															{likes?.length}명이 궁금해하고 있어요
														</BottomButton>
													) : (
														<BottomButton
															onClick={() => likeQuestion(chatId)}
															isClicked={false}
														>
															<LikeCharacter />
															{likes?.length}명이 궁금해하고 있어요
														</BottomButton>
													)}
													{userId === user.id && (
														<BottomButton
															onClick={() => toggleResolve(chatId)}
															isClicked={isResolved ? true : false}
														>
															{isResolved ? '취소' : '해결'}
														</BottomButton>
													)}
												</ButtonButtons>
											</Question>
										);
									}
								}
							)}
						<div ref={chatEndRef} />
					</ChatBox>
				</div>

				<InputBox>
					<div>
						<Input
							// type='text'
							value={input}
							onChange={changeMessage}
							onKeyPress={(e) => {
								if (e.key === 'Enter') {
									sendChat();
								}
							}}
						/>
						<SendButton onClick={sendChat} />
						<QueButton isQuestion={isQuestion}>
							<input
								type='checkbox'
								name='queCheck'
								onChange={toggleChatType}
							/>
						</QueButton>
					</div>
				</InputBox>
			</ChatContainer>
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
	color: #b6b6b6;
`;

const LeftBox = styled.div``;

const StateBox = styled.div`
	margin-top: 40px;
	display: flex;
`;

const MyStateBox = styled.div`
	width: 490px;
	height: 300px;
	margin-right: 22px;
`;

const UpperBox = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
`;

const MyName = styled.h2`
	font-size: 24px;
	font-weight: bold;
`;

const MyStateCharacter = styled.div<{ src: string }>`
	background-image: url(${({ src }) => src});
	background-position: left center;
	background-repeat: no-repeat;
	width: 300px;
	height: 300px;
`;

const StateButtons = styled.div`
	width: 276px;
	height: 72px;
	border-radius: 7px;
	box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
	display: flex;
	align-items: center;
	background-color: #fff;
`;

const StateButton = styled.button<{ src: string }>`
	background: none;
	border: none;
	background-image: url(${({ src }) => src});
	background-position: center center;
	background-repeat: no-repeat;
	width: 90px;
	height: 72px;
	cursor: pointer;
`;

const Hr = styled.hr`
	border: none;
	border-radius: 1px;
	width: 2px;
	height: 30px;
	background-color: #d2d2d2;
`;

const StudentStateBox = styled.div`
	width: 380px;
	height: 300px;
	border-radius: 10px;
	box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
	padding: 20px;
	background-color: #fff;
	overflow-y: scroll;
	&::-webkit-scrollbar {
		width: 5px;
	}
	&::-webkit-scrollbar-thumb {
		background-color: ${({ theme }) => theme.colors.scroll};
		border-radius: 10px;
	}
`;

const StudentBox = styled.div`
	display: inline-block;
	height: 100px;
	width: 83px;
`;

const StudentName = styled.h4`
	font-size: 12px;
	font-weight: bold;
	text-align: center;
	margin-bottom: 8px;
`;

const StudentState = styled.div<{ src: string }>`
	background-image: url(${({ src }) => src});
	background-position: center center;
	background-repeat: no-repeat;
	width: 50px;
	height: 50px;
	margin: 0 auto;
`;

const ChatContainer = styled.div`
	width: 275px;
	height: 855px;
	border-radius: 10px;
	box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
	background-color: #fff;
`;

const ToggleButtons = styled.div`
	display: flex;
	margin: 19px 16px 10px;
`;

const ToggleButton = styled.label<{ isChecked: boolean }>`
	font-size: 18px;
	font-weight: 600;
	& input {
		display: none;
	}
	& + & {
		margin-left: 10px;
	}
	${({ isChecked }) => isChecked && 'color: #c4c4c4;'}
	cursor: pointer;
`;

const ChatBox = styled.div<{ isChecked: boolean }>`
	width: 275px;
	overflow-y: scroll;
	height: 700px;
	${({ isChecked }) =>
		isChecked &&
		`background-image: url('/images/nochecked.png'); background-repeat: no-repeat; background-position: center center;`}
	&::-webkit-scrollbar {
		width: 5px;
	}
	&::-webkit-scrollbar-thumb {
		background-color: ${({ theme }) => theme.colors.scroll};
		border-radius: 10px;
	}
	position: relative;
`;

const NoCheckedMessage = styled.p`
	width: 170px;
	font-size: 13px;
	font-weight: bold;
	color: #718aff;
	position: absolute;
	top: 60%;
	left: 50%;
	transform: translate(-50%, -50%);
`;

const Chat = styled.div`
	width: 250px;
	margin: 10px auto;
`;

const ChatName = styled.h4`
	font-size: 12px;
	margin-left: 5px;
	margin-bottom: 3px;
`;

const ChatContent = styled.div`
	width: 250px;
	padding: 10px 10px;
	border-radius: 7px;
	background-color: #f4f4f4;
	font-size: 14px;
`;

const Question = styled.div`
	width: 250px;
	margin: 10px auto;
`;

const QuestionContent = styled.div<{ isResolved: boolean }>`
	border-radius: 7px;
	padding: 15px 15px;
	background-color: #718aff;
	color: #fff;
	position: relative;
	${({ isResolved }) => isResolved && 'background-color: #D4DBF9; '}
`;

const Resolve = styled.div`
	width: 50px;
	height: 50px;
	background-image: url('/images/resolve.png');
	background-repeat: no-repeat;
	background-position: center center;
	background-size: contain;
	position: absolute;
	right: 0px;
	bottom: 0px;
`;

const DeleteButton = styled.button`
	border: none;
	background: none;
	background-image: url('/images/closewhite.png');
	background-position: center center;
	background-repeat: no-repeat;
	background-size: contain;
	width: 10px;
	height: 10px;
	position: absolute;
	top: 10px;
	right: 10px;
	cursor: pointer;
	z-index: 2;
`;

const LikeCharacter = styled.div`
	width: 15px;
	height: 15px;
	margin-right: 2px;
	background-image: url('/images/like.png');
	background-size: contain;
	background-position: center center;
	background-repeat: no-repeat;
`;

const ButtonButtons = styled.div`
	display: flex;
	margin-top: 3px;
`;

const BottomButton = styled.button<{ isClicked: boolean }>`
	display: flex;
	align-items: center;
	justify-content: center;
	border: none;
	padding: 4px;
	background-color: #f4f4f4;
	color: #718aff;
	border-radius: 7px;
	font-size: 10px;
	& + & {
		margin-left: 5px;
	}
	${({ isClicked }) =>
		isClicked && 'background-color: #D2D2D2; color: #718AFF;'}
	cursor: pointer;
`;

const InputBox = styled.div`
	height: 80px;
	width: 250px;
	margin: 10px auto;
	display: flex;
	flex-direction: column;
	justify-content: end;
	align-items: center;
	position: relative;
`;

const SendButton = styled.button`
	border: none;
	background-color: #718aff;
	background-image: url('/images/send.png');
	background-position: center center;
	background-repeat: no-repeat;
	width: 30px;
	height: 30px;
	border-radius: 7px;
	position: absolute;
	opacity: 0;
	transition: 0.2s;
	right: 0;
	bottom: 0;
	box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
	cursor: pointer;
`;

const Input = styled.textarea`
	resize: none;
	border: none;
	width: 214px;
	height: 30px;
	border-radius: 7px;
	background-color: #f4f4f4;
	outline: none;
	transition: 0.2s;
	margin-right: 6px;
	padding: 10px;
	&:focus {
		height: 70px;
	}
	&:focus ~ ${SendButton} {
		bottom: 40px;
		opacity: 1;
	}
	&::-webkit-scrollbar {
		width: 5px;
	}
	&::-webkit-scrollbar-thumb {
		background-color: ${({ theme }) => theme.colors.scroll};
		border-radius: 10px;
	}
`;

const QueButton = styled.label<{ isQuestion: boolean }>`
	border: none;
	background-image: url(${({ isQuestion }) =>
		isQuestion ? '/images/queon.png' : '/images/queoff.png'});
	background-position: center center;
	background-repeat: no-repeat;
	width: 30px;
	height: 30px;
	border-radius: 7px;
	display: inline-block;
	transition: 0.2s;
	position: relative;
	z-index: 2;
	cursor: pointer;
	& input {
		display: none;
	}
	box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
`;
