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
	const [chatMessage, setChatMessage] = useState(''); //input message
	const [chats, setChat] = useState<chatType[]>(); //chat 내용 모음
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

	const url = 'ws://xpecter.shop';
	const classId = params.classId;

	const mynickname = '김우현';
	//let nickname = sessionStorage.getItem("nickname");
	const accessToken = 'dddd';
	//const accessToken = sessionStorage.getItem("accessToken");

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
				console.log('chat!!!!')
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
				console.log('chat!!!!')
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
				setChatMessage(''); //input 비워준다
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
			console.log('callback solveclick');
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
					.map(({ nickname, chatMessage }, index) => (
						<div
							key={index}
							className={
								mynickname === nickname ? 'chat_from_me' : 'chat_from_friend'
							}
						>
							{mynickname !== nickname ? (
								<div className='chat_nick'>{nickname}</div>
							) : (
								mynickname
							)}

							<div className='chat_content'>
								<div className='chat_message'>{chatMessage}</div>
							</div>
						</div>
					));
			}
		} else if (questionCheck === true) {
			if (chats) {
				return chats
					.filter((chat: any) => chat.check === 'question')
					.map(({ nickname, chatMessage, id, solution }, index) => (
						<div
							key={index}
							className={
								mynickname === nickname ? 'chat_from_me' : 'chat_from_friend'
							}
						>
							{solution === true ? (
								<div className='solution_tab'>해결!!</div>
							) : undefined}
							{mynickname === nickname ? (
								<button onClick={() => solveClick(id)}>
									내가한질문해결버튼
								</button>
							) : null}
							{mynickname !== nickname ? (
								<div className='chat_nick'>{nickname}</div>
							) : (
								mynickname
							)}

							<div className='chat_content'>
								<h3>질문글</h3>
								<div className='chat_message'>{chatMessage}</div>
							</div>
						</div>
					));
			}
		} else {
			if (chats) {
				return chats.map(
					({ nickname, chatMessage, id, solution, check }, index) => (
						<div
							key={index}
							className={
								mynickname === nickname ? 'chat_from_me' : 'chat_from_friend'
							}
						>
							{solution === true ? (
								<div className='solution tab'>해결!!</div>
							) : undefined}
							{check === 'question' && mynickname === nickname ? (
								<button onClick={() => solveClick(id)}>
									내가한질문해결버튼
								</button>
							) : null}
							{mynickname !== nickname ? (
								<div className='chat_nick'>{nickname}</div>
							) : (
								mynickname
							)}

							<div className='chat_content'>
								{check === 'question' ? <h3>질문글</h3> : null}
								<div className='chat_message'>{chatMessage}</div>
							</div>
						</div>
					)
				);
			}
		}
	};

	return (
		<Container>
			<p className='header_modal_title'>채팅방입니다</p>
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
				{/* 채팅container */}
				<div className='chat_render_oneChat'>{renderChat()}</div>

				<div>
					{/* <input type="password">질문</input> */}
					<div className='chat_textfield_container'>
						<label>
							질문
							<input type='checkbox' name='queCheck' onChange={onChat} />
						</label>
						<input
							type='text'
							className='chat_textfield'
							placeholder='메시지를 작성해주세요.'
							name='oneChat'
							value={chatMessage}
							onChange={sendMessage}
							onKeyPress={(e) => {
								if (e.key === 'Enter') {
									sendChat();
								}
							}}
						/>
						<button className='chat_send_btn' onClick={sendChat}>
							+
						</button>
					</div>
				</div>
			</div>
		</Container>
	);
}

export default Chat;

const Container = styled.div`
	width: 270px;
	height: 850px;
	border-radius: 10px;
	box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
`;
