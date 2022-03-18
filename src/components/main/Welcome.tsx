import { useSelector } from 'react-redux';
import styled from 'styled-components';
import character from '../../assets/character1.png';
import { RootState } from '../../store/configStore';

interface Props {
	message: string;
}

const Welcome: React.FC<Props> = ({ message }) => {
	const user = useSelector((state: RootState) => state.user)

	return (
		<Container>
			<WelcomeMessage>안녕하세요,</WelcomeMessage>
			<Name>{user.user_info.nickname} 님</Name>
			<MessageBox>
				<Message>{message}</Message>
				<MessageDecoration />
			</MessageBox>
			<Character src={character} />
		</Container>
	);
};
export default Welcome;

const Container = styled.div`
	width: 580px;
	height: 290px;
	background-color: #fff;
	box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
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
`