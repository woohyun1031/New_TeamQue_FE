import { ChangeEvent, FormEvent, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/configStore';
import styled from 'styled-components';

interface WelcomeProps {
	message: string;
}

const Welcome: React.FC<WelcomeProps> = ({ message }) => {
	const user = useSelector((state: RootState) => state.user);
	const [isChanging, setIsChanging] = useState(false);
	const [input, setInput] = useState('');

	const onClick = () => {
		setIsChanging(true);
	};

	const focusOut = () => {
		setIsChanging(false);
	};

	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		setInput(e.target.value);
	};
	
	const onSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		console.log(input);
		setInput('')
		setIsChanging(false);
	};

	return (
		<Container>
			<WelcomeMessage>안녕하세요,</WelcomeMessage>
			<Name>{user.user_info.nickname} 님</Name>
			<MessageBox>
				{isChanging ? (
					<form onSubmit={onSubmit}>
						<Input
							type='text'
							autoFocus
							onBlur={focusOut}
							onChange={onChange}
						/>
					</form>
				) : (
					<Message onClick={onClick}>{message}</Message>
				)}
				<MessageDecoration />
			</MessageBox>
			<Character src='/images/character1.png' />
		</Container>
	);
};
export default Welcome;

const Container = styled.div`
	width: 580px;
	height: 290px;
	background-color: #fff;
	box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
	border-radius: 7px;
	padding: 36px 40px;
	position: relative;
`;

const WelcomeMessage = styled.p`
	font-size: 30px;
	font-weight: 700;
	margin-bottom: -10px;
`;

const Name = styled.p`
	font-size: 30px;
	font-weight: 700;
`;

const MessageBox = styled.div`
	width: 350px;
	height: 85px;
	position: relative;
	background-color: #718aff;
	color: #fff;
	font-size: 18px;
	font-weight: 500;
	border-radius: 4px;
	padding: 20px;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 20px;
`;

const Message = styled.p``;

const MessageDecoration = styled.div`
	position: absolute;
	right: -40px;
	bottom: 10px;
	width: 0;
	height: 0;
	border-bottom: 10px solid transparent;
	border-top: 15px solid transparent;
	border-left: 20px solid #718aff;
	border-right: 20px solid transparent;
`;

interface CharacterProps {
	src: string;
}

const Character = styled.img<CharacterProps>`
	position: absolute;
	bottom: 10px;
	right: 20px;
`;

const Input = styled.input`
	outline: none;
	border: none;
	background-color: #718aff;
	color: #fff;
	text-align: center;
`;
