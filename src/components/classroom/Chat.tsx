import { ChangeEvent, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import io, { Socket } from 'socket.io-client';

type chatType = {
	id: string;
	nickname: string;
	chatMessage: string;
	check: string;
	solution?: boolean;
};

let socket: Socket;

function Chat() {
	const [chatMessage, setChatMessage] = useState('');
	const [chats, setChat] = useState<chatType[]>([]);
	const [check, setChecked] = useState({
		commonCheck: false,
		questionCheck: false,
	});
	const [chatcheck, setChatChecked] = useState({
		queCheck: false,
	});
	const [isConnect, setConnect] = useState(false);

	const { commonCheck, questionCheck } = check;
	const { queCheck } = chatcheck;

	const params = useParams();

	const url = 'ws://noobpro.shop';
	const classId = params.classid;

	const mynickname: any = sessionStorage.getItem('nickname');
	const accessToken: any = sessionStorage.getItem('accessToken');

	useEffect(() => {
		const fetchData = () => {
			if (isConnect === false) {
				socket = io(url);
				socket.emit('init', { nickname: mynickname, accessToken });
				socket.on('initOk', () => {
					socket.emit('joinRoom', { classId });
					setConnect(true);
				});
			}
		};

		fetchData();

		return () => {
			socket.disconnect();
			setConnect(false);
		};
	}, []);

	useEffect(() => {
		socket.on('recieveQuestionSolve', ({ chatId }) => {
			setChat(
				chats &&
					chats.map((chat) =>
						chat.id === chatId ? { ...chat, solution: !chat.solution } : chat
					)
			);
		});
		socket.on(
			'receiveChatMessage',
			({ nickname, chatMessage, id }: chatType) => {
				if (chats) {
					const newChat: chatType[] = [
						...chats,
						{ id, nickname, chatMessage, check: 'common' },
					];
					setChat(newChat);
				}
			}
		);

		socket.on(
			'receiveQuestionMessage',
			({ nickname, chatMessage, id, solution }) => {
				if (chats) {
					const newChat = [
						...chats,
						{ id, nickname, chatMessage, check: 'question', solution },
					];
					setChat(newChat);
				}
			}
		);
	}, [chats]);

	const sendChat = () => {
		if (chatMessage !== '') {
			if (queCheck === true) {
				socket.emit(
					'sendQuestionMessage',
					{ chatMessage, classId },
					({ chatMessage, id }: any) => {
						if (chats) {
							setChat([
								...chats,
								{
									nickname: mynickname,
									chatMessage,
									check: 'question',
									solution: false,
									id,
								},
							]);
						}
					}
				);
				setChatMessage('');
			} else {
				socket.emit(
					'sendChatMessage',
					{ chatMessage, classId },
					({ chatMessage, id }: any) => {
						if (chats) {
							setChat([
								...chats,
								{ nickname: mynickname, chatMessage, check: 'common', id },
							]);
						}
					}
				);
				setChatMessage('');
			}
		}
	};

	const sendMessage = (e: ChangeEvent<HTMLInputElement>) => {
		setChatMessage(e.target.value);
	};

	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, checked } = e.target;
		setChecked({
			...check,
			[name]: checked,
		});
	};

	const onChat = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, checked } = e.target;
		setChatChecked({
			...chatcheck,
			[name]: checked,
		});
	};

	const solveClick = (unique_id: string) => {
		socket.emit('sendQuestionSolve', { chatId: unique_id, classId }, () => {
			setChat(
				chats &&
					chats.map((chat) =>
						chat.id === unique_id ? { ...chat, solution: !chat.solution } : chat
					)
			);
		});
	};

	const renderChat = () => {
		if (commonCheck === true) {
			if (chats) {
				return chats
					.filter((chat) => chat.check === 'common')
					.map(({ nickname, chatMessage, id }) => (
						<ChatBox key={id} byMe={mynickname === nickname}>
							<p>{nickname}</p>
							<ChatMessage>{chatMessage}</ChatMessage>
						</ChatBox>
					));
			}
		} else if (questionCheck === true) {
			if (chats) {
				return chats
					.filter((chat: any) => chat.check === 'question')
					.map(({ nickname, chatMessage, id, solution }) => (
						<QuestionBox key={id} byMe={mynickname === nickname}>
							{solution ? '해결' : ''}
							{mynickname === nickname ? (
								<button onClick={() => solveClick(id)}>
									이해됐어요!
								</button>
							) : null}
							<p>질문 : {chatMessage}</p>
						</QuestionBox>
					));
			}
		} else {
			if (chats) {
				return chats.map(
					({ nickname, chatMessage, id, solution, check }) => {
						if (check === 'common') {
							return (
								<ChatBox key={id} byMe={mynickname === nickname}>
									<p>{nickname}</p>
									<ChatMessage>{chatMessage}</ChatMessage>
								</ChatBox>
							);
						} else {
							return (
								<QuestionBox key={id} byMe={mynickname === nickname}>
									{solution ? '해결' : ''}
									{mynickname === nickname ? (
										<button onClick={() => solveClick(id)}>
											이해됐어요!
										</button>
									) : null}
									<p>질문 : {chatMessage}</p>
								</QuestionBox>
							);
						}
					}
				);
			}
		}
	};

	return (
		<Container>
			<label>
				<input
					className='header_modal_checkbox'
					name='commonCheck'
					type='checkbox'
					onChange={onChange}
				/>
				채팅
			</label>
			<label>
				<input
					className='header_modal_checkbox'
					name='questionCheck'
					type='checkbox'
					onChange={onChange}
				/>
				질문
			</label>
			<div className='header_modal_hr' />

			<div className='group_chat_container'>
				<div className='chat_render_oneChat'>{renderChat()}</div>

				<InputBox>
					<Input
						type='text'
						name='oneChat'
						value={chatMessage}
						onChange={sendMessage}
						onKeyPress={(e) => {
							if (e.key === 'Enter') {
								sendChat();
							}
						}}
					/>
					<SendButton onClick={sendChat}>전송</SendButton>
					<label>
						질문
						<input type='checkbox' name='queCheck' onChange={onChat} />
					</label>
				</InputBox>
			</div>
		</Container>
	);
}

export default Chat;

const Container = styled.div`
	width: 270px;
	height: 854px;
	border-radius: 10px;
	box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
	overflow-y: scroll;
	position: relative;
	&::-webkit-scrollbar {
		width: 5px;
	}
	&::-webkit-scrollbar-thumb {
		background-color: #ccc;
		border-radius: 10px;
	}
`;

interface QuestionBoxProps {
	byMe: boolean;
}

const QuestionBox = styled.div<QuestionBoxProps>`
	width: 250px;
	padding: 20px;
	background-color: #718aff;
	border-radius: 7px;
	width: 250px;
	margin: 5px auto;
	color: #fff;
`;

interface ChatBoxProps {
	byMe: boolean;
}

const ChatBox = styled.div<ChatBoxProps>`
	padding: 10px;
`;

const ChatNickname = styled.h3``;

const ChatMessage = styled.p`
	width: 250px;
	border-radius: 7px;
	background-color: #f4f4f4;
	padding: 5px;
`;

const InputBox = styled.div`
	position: absolute;
	bottom: 10px;
	right: 0;
	margin: 0 auto;
`

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