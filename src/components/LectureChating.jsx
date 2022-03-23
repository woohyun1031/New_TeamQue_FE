import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';

function LectureChating() {
	const [chatMessage, setChatMessage] = useState(''); //input message
	const [chats, setChat] = useState([]); //chat 내용 모음

	const [check, setChecked] = useState({
		commonCheck: '',
		questionCheck: '',
	});
	const [chatcheck, setChatChecked] = useState({
		queCheck: '',
	});
	const [isConnect, setConnect] = useState(false);

	const { commonCheck, questionCheck } = check;
	const { queCheck } = chatcheck;

	const params = useParams();
	const socket = useRef();
	//const socket = useRef();

	const url = 'ws://xpecter.shop';
	const classId = params.classId;

	let mynickname = '김우현';
	//let nickname = sessionStorage.getItem("nickname");
	const accessToken = 'dddd';
	//const accessToken = sessionStorage.getItem("accessToken");

	useEffect(async () => {
		if (isConnect === false) {
			socket.current = io(url);
			socket.current.emit('init', { nickname: mynickname, accessToken });
			await socket.current.on('initOk', () => {
				socket.current.emit('joinRoom', { classId });
			});
		}
		setConnect(true);

		socket.current.on('recieveQuestionSolve', ({ chatId }) => {
			setChat(
				chats.map((chat) =>
					chat.id === chatId ? { ...chat, solution: !chat.solution } : chat
				)
			);
		});
		socket.current.on('receiveChatMessage', ({ nickname, chatMessage, id }) => {
			const newChat = [
				...chats,
				{ id, nickname, chatMessage, check: 'common' },
			];
			setChat(newChat);
		});

		socket.current.on(
			'receiveQuestionMessage',
			({ nickname, chatMessage, id, solution }) => {
				const newChat = [
					...chats,
					{ id, nickname, chatMessage, check: 'question', solution },
				];
				setChat(newChat);
			}
		);

		return () => {
			socket.current.disconnect();
			setConnect(false);
		};
	}, [chats]);

	const sendChat = () => {
		if (chatMessage !== '') {
			if (queCheck === true) {
				socket.current.emit(
					'sendQuestionMessage',
					{ chatMessage, classId },
					({ chatMessage, id }) => {
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
				);
				setChatMessage('');
			} else {
				socket.current.emit(
					'sendChatMessage',
					{ chatMessage, classId },
					({ chatMessage, id }) => {
						setChat([
							...chats,
							{ nickname: mynickname, chatMessage, check: 'common', id },
						]);
					}
				);
				setChatMessage(''); //input 비워준다
			}
		}
	};

	const sendMessage = (e) => {
		setChatMessage(e.target.value);
	};

	const onChange = (e) => {
		const { name, checked } = e.target;
		setChecked({
			...check,
			[name]: checked,
		});
	};

	const onChat = (e) => {
		const { name, checked } = e.target;
		setChatChecked({
			...chatcheck,
			[name]: checked,
		});
	};

	const solveClick = (unique_id) => {
		socket.current.emit(
			'sendQuestionSolve',
			{ chatId: unique_id, classId },
			() => {
				setChat(
					chats.map((chat) =>
						chat.id === unique_id ? { ...chat, solution: !chat.solution } : chat
					)
				);
			}
		);
	};

	const renderChat = () => {
		if (commonCheck === true) {
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
		} else if (questionCheck === true) {
			return chats
				.filter((chat) => chat.check === 'question')
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
							<button onClick={() => solveClick(id)}>내가한질문해결버튼</button>
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
		} else {
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
							<button onClick={() => solveClick(id)}>내가한질문해결버튼</button>
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
	};

	return (
		<>
			<ChatContainer>
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
				<div className='header_modal_hr'></div>

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
			</ChatContainer>
		</>
	);
}

export default LectureChating;

const ChatContainer = styled.div`
	position: relative;
	height: 80vh;
	margin: 0 4.17vw;
	box-shadow: 0px 4px 35px 4px rgba(162, 162, 162, 0.25);
	border-radius: 16px;
	box-sizing: border-box;
	width: 22%;

	.group_chat_container {
		padding: 18px;
		height: calc(100% - 150px);
	}
	.chat_render_oneChat {
		height: 100%;
		overflow: auto;
	}
	.chat_textfield_container {
		display: flex;
		justify-content: space-between;
		position: absolute;
		bottom: 20px;
		width: 92%;
		left: 50%;
		transform: translateX(-50%);
	}
	.header_modal_title {
		margin: 3.07vh 18px 2.56vh;
	}
	.chat_from_me {
		border: 1px solid black;
		border-radius: 10px;
	}
	.'chat_from_friend' {
		border: 1px solid black;
		border-radius: 10px;
	}
`;
