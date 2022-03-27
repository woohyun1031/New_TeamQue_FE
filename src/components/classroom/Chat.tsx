import { ChangeEvent, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import io, { Socket } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/configStore';

type chatType = {
	id: string;
	nickname: string;
	message: string;
	type: 'chat' | 'question';
	isResolved?: boolean;
};

let socket: Socket;

const Chat = () => {
	const params = useParams();
	const [message, setMessage] = useState('');
	const [chats, setChats] = useState<chatType[]>([]);

	const [check, setChecked] = useState({
		commonCheck: false,
		questionCheck: false,
	});
	const { commonCheck, questionCheck } = check;

	const [isQuestion, setIsQuestion] = useState(false);
	const [isConnect, setConnect] = useState(false);

	const SOCKETSERVER = 'ws://noobpro.shop';
	const classId = params.classid;

	const myNickname = useSelector(
		(state: RootState) => state.user.user_info.nickname
	);
	const accessToken = sessionStorage.getItem('accessToken');

	const socketInitiate = async () => {
		socket = io(SOCKETSERVER);

		socket.emit('init', { nickname: myNickname, accessToken });

		socket.on('initOk', () => {
			socket.emit('joinRoom', { classId });
			setConnect(true);
		});

		socket.on('receiveResolved', ({ chatId }) => {
			setChats((prev) => prev.map((chat) =>
			chat.id === chatId ? { ...chat, isResolved: !chat.isResolved } : chat));
		});

		socket.on(
			'receiveChat',
			({ id, nickname, message }) => {
				setChats((prev) => [...prev, { id, nickname, message, type: 'chat' }]);
			}
		);

		socket.on('receiveQuestion', ({ id, message, nickname }) => {
			setChats((prev) => [
				...prev,
				{ id, nickname, message, isResolved: false, type: 'question' },
			]);
		});
	};


	useEffect(() => {
		return () => {
			socket.disconnect();
			setConnect(false);
		};
	}, []);

	useEffect(() => {
		if (!isConnect) {
			socketInitiate();
		}
	}, [isConnect]);

	const sendChat = () => {
		if (message) {
			if (isQuestion) {
				socket.emit(
					'sendQuestion',
					{ message, classId },
					({ id, message }: { id: string; message: string }) => {
						setChats([
							...chats,
							{
								id,
								nickname: myNickname,
								message,
								type: 'question',
								isResolved: false,
							},
						]);
					}
				);
				setMessage('');
			} else {
				console.log(message, classId)
				socket.emit(
					'sendChat',
					{ message, classId },
					({ id, message }: { id: string; message: string }) => {
						setChats([
							...chats,
							{
								id,
								nickname: myNickname,
								message,
								type: 'chat',
							},
						]);
					}
				);
				setMessage('');
			}
		}
	};

	const changeMessage = (e: ChangeEvent<HTMLInputElement>) => {
		setMessage(e.target.value);
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

	const toggleResolve = (unique_id: string) => {
		socket.emit('sendResolved', { chatId: unique_id, classId }, () => {
			const newChats = chats.map((chat) =>
				chat.id === unique_id ? { ...chat, isResolved: !chat.isResolved } : chat
			);
			setChats(newChats);
		});
	};

	return (
		<Container>
			<Toggle>
				<ToggleButton isSelect={commonCheck}>
					<input name='commonCheck' type='checkbox' onChange={onChange} />
					채팅
				</ToggleButton>
				<ToggleButton isSelect={questionCheck}>
					<input name='questionCheck' type='checkbox' onChange={onChange} />
					질문
				</ToggleButton>
			</Toggle>
			{chats &&
				chats.map(
					({ nickname, message, id, isResolved, type }, index: number) => {
						if (type === 'chat' && !commonCheck) {
							return (
								<ChatBox key={index} byMe={nickname === myNickname}>
									<ChatName>{nickname}</ChatName>
									<ChatMessage>{message}</ChatMessage>
								</ChatBox>
							);
						} else if (type === 'question' && !questionCheck) {
							return (
								<QuestionBox key={index} byMe={nickname === myNickname} isResolved={isResolved} onClick={() => toggleResolve(id)}>
									{myNickname === nickname && '내 질문'}
									<QueMessage>{message}</QueMessage>
								</QuestionBox>
							);
						}
					}
				)}
			<InputBox>
				<Input
					type='text'
					name='oneChat'
					value={message}
					onChange={changeMessage}
					onKeyPress={(e) => {
						if (e.key === 'Enter') {
							sendChat();
						}
					}}
				/>
				<SendButton onClick={sendChat}>전송</SendButton>
				<label>
					질문
					<input type='checkbox' name='queCheck' onChange={toggleChatType} />
				</label>
			</InputBox>
		</Container>
	);
};

export default Chat;

const Container = styled.div`
	width: 280px;
	height: 854px;
	border-radius: 10px;
	box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
	overflow-y: scroll;
	position: relative;
	padding: 10px;
	&::-webkit-scrollbar {
		width: 5px;
	}
	&::-webkit-scrollbar-thumb {
		background-color: #ccc;
		border-radius: 10px;
	}
`;

const Toggle = styled.div`
	margin-bottom: 20px;
`

const ToggleButton = styled.label<{ isSelect: boolean }>`
	font-size: 18px;
	font-weight: bold;
	${({ isSelect }) => isSelect && 'color: #ccc;'}
	& input {
		display: none;
	}
	& + & {
		margin-left: 10px;
	}
`;

const ChatName = styled.p`
	font-size: ${({ theme }) => theme.fontSizes.xs}; ;
`;

const QuestionBox = styled.div<{ byMe: boolean, isResolved?: boolean }>`
	width: 200px;
	padding: 20px;
	background-color: #718aff;
	border-radius: 7px;
	width: 250px;
	margin: 5px auto;
	color: #fff;
	${({isResolved}) => isResolved && 'background-color: #BCC8FF; text-decoration: line-through'}
`;

const ChatBox = styled.div<{ byMe: boolean }>`
`
;

const ChatMessage = styled.p`
	width: 250px;
	border-radius: 7px;
	background-color: #f4f4f4;
	padding: 5px;
	font-size: ${({ theme }) => theme.fontSizes.base};
`;
const QueMessage = styled.p`
	font-size: ${({ theme }) => theme.fontSizes.base};
`;

const InputBox = styled.div`
	position: absolute;
	bottom: 10px;
	right: 0;
	margin: 0 auto;
`;

const Input = styled.input`
	width: 150px;
	height: 30px;
	border-top-left-radius: 7px;
	border-bottom-left-radius: 7px;
	outline: none;
	border: none;
	background-color: #f4f4f4;
`;

const SendButton = styled.button`
	width: 50px;
	height: 30px;
	background-color: #718aff;
	color: #fff;
	border-top-right-radius: 7px;
	border-bottom-right-radius: 7px;
	border: none;
`;
