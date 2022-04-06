import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { socket } from '../../pages/ClassRoom';
import { RootState } from '../../store/configStore';

type chatType = {
	chatId: string;
	userId: number;
	name: string;
	content: string;
	type: 'chat' | 'question';
	likes?: { userId: number }[];
	isResolved?: boolean;
};

type ChattingProps = {
	chatData: chatType[];
	isConnected: boolean;
};

const Chatting = ({ chatData, isConnected }: ChattingProps) => {
	const user = useSelector((state: RootState) => state.user);
	const [chatList, setChatList] = useState<chatType[]>(chatData);
	const [input, setInput] = useState('');
	const [check, setChecked] = useState({
		chatCheck: false,
		questionCheck: false,
	});
	const { chatCheck, questionCheck } = check;
	const [isQuestion, setIsQuestion] = useState(false);
	const { classid: classId } = useParams();

	const chatEndRef = useRef<null | HTMLDivElement>(null);

	useEffect(() => {
		setChatList(chatData);
	}, [chatData]);

	const scrollToBottom = () => {
		chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	useEffect(() => {
		scrollToBottom();
	}, [chatList]);

	useEffect(() => {
		if (isConnected) {
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
						likes: [],
						type: 'question',
					},
				]);
			});

			socket.on('receiveLikeUp', ({ chatId, userId }) => {
				setChatList((prev) =>
					prev.map((chat) =>
						chat.likes && chat.chatId === chatId
							? { ...chat, likes: [...chat.likes, { userId }] }
							: chat
					)
				);
			});

			socket.on('receiveLikeDown', ({ chatId, userId }) => {
				console.log(chatId);
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
				setChatList((prev) => prev.filter((chat) => chat.chatId !== chatId));
			});
		}
	}, [isConnected]);

	const sendChat = (e: any) => {
		e.preventDefault();
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

	return (
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
												{likes?.findIndex((like) => like.userId === user.id) !==
												-1 ? (
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
					<SendButton onClick={sendChat} />
					<Input
						value={input}
						onChange={changeMessage}
						onKeyPress={(e) => {
							if (e.key === 'Enter') {
								sendChat(e);
							}
						}}
					/>

					<QueButton isQuestion={isQuestion}>
						<input type='checkbox' name='queCheck' onChange={toggleChatType} />
					</QueButton>
				</div>
			</InputBox>
		</ChatContainer>
	);
};

export default Chatting;

const ChatContainer = styled.div`
	width: 275px;
	height: 855px;
	border-radius: 10px;
	box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
	background-color: ${({ theme }) => theme.colors.background};
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
	transition: 0.3s;
	&:hover {
		filter: brightness(80%);
	}
	&:active {
		filter: brightness(120%);
	}
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
	&::-webkit-scrollbar-thumb:hover {
		background-color: ${({ theme }) => theme.colors.scrollHover};
	}
	position: relative;
`;

const NoCheckedMessage = styled.p`
	width: 170px;
	font-size: 13px;
	font-weight: bold;
	color: ${({ theme }) => theme.colors.main};
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
	background-color: ${({ theme }) => theme.colors.base};
	font-size: 14px;
`;

const Question = styled.div`
	width: 250px;
	margin: 10px auto;
`;

const QuestionContent = styled.div<{ isResolved: boolean }>`
	border-radius: 7px;
	padding: 15px 15px;
	background-color: ${({ theme }) => theme.colors.main};
	color: ${({ theme }) => theme.colors.buttonTitle};
	position: relative;
	${({ isResolved }) => isResolved && 'background-color: #D4DBF9; '}
`;

const Resolve = styled.div`
	width: 50px;
	height: 50px;
	background-image: url('/images/resolve.png');
	${({ theme }) => theme.commons.backgroundImage}
	background-size: contain;
	position: absolute;
	right: 0px;
	bottom: 0px;
`;

const DeleteButton = styled.button`
	background-image: url('/images/closewhite.png');
	${({ theme }) => theme.commons.backgroundImage}
	background-size: contain;
	width: 10px;
	height: 10px;
	position: absolute;
	top: 10px;
	right: 10px;
	z-index: 2;
`;

const LikeCharacter = styled.div`
	width: 15px;
	height: 15px;
	margin-right: 2px;
	background-image: url('/images/like.png');
	${({ theme }) => theme.commons.backgroundImage};
	background-size: contain;
`;

const ButtonButtons = styled.div`
	display: flex;
	margin-top: 3px;
`;

const BottomButton = styled.button<{ isClicked: boolean }>`
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 4px;
	background-color: ${({ theme }) => theme.colors.base};
	color: ${({ theme }) => theme.colors.blueTitle};
	border-radius: 7px;
	font-size: 10px;
	& + & {
		margin-left: 5px;
	}
	${({ isClicked }) =>
		isClicked && 'background-color: #D2D2D2; color: #718AFF;'}
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
	background-color: ${({ theme }) => theme.colors.main};
	background-image: url('/images/send.png');
	background-position: center center;
	background-repeat: no-repeat;
	width: 30px;
	height: 30px;
	border-radius: 7px;
	position: absolute;
	opacity: 1;
	transition: 0.2s;
	right: 0;
	bottom: 40px;
	box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
	&:hover {
		filter: brightness(110%);
	}
	&:active {
		filter: brightness(90%);
	}
`;

const Input = styled.textarea`
	resize: none;
	border: none;
	width: 214px;
	height: 70px;
	border-radius: 7px;
	background-color: ${({ theme }) => theme.colors.base};
	outline: none;
	transition: 0.3s;
	margin-right: 6px;
	padding: 10px;
	&::-webkit-scrollbar {
		width: 5px;
	}
	&::-webkit-scrollbar-thumb {
		background-color: ${({ theme }) => theme.colors.scroll};
		border-radius: 10px;
	}
`;

const QueButton = styled.label<{ isQuestion: boolean }>`
	background-image: url(${({ isQuestion }) =>
		isQuestion ? '/images/queon.png' : '/images/queoff.png'});
	${({ theme }) => theme.commons.backgroundImage};
	width: 30px;
	height: 30px;
	border-radius: 7px;
	display: inline-block;
	transition: 0.2s;
	position: relative;
	z-index: 2;
	& input {
		display: none;
	}
	box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
	cursor: pointer;
	&:hover {
		filter: brightness(110%);
	}
	&:active {
		filter: brightness(90%);
	}
`;
