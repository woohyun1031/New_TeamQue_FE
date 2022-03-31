import { useSelector } from 'react-redux';
import { RootState } from '../../store/configStore';
import styled from 'styled-components';

const Welcome = () => {
	const user = useSelector((state: RootState) => state.user);
	const lifeQuotes: string[] = [
		"Don't dwell on the past",
		'Believe in yourself.',
		'Follow your heart.',
		'Seize the day.',
		'You only live once.',
	];
	return (
		<Container>
			<WelcomeMessage>안녕하세요,</WelcomeMessage>
			<Name>{user.name} 님</Name>
			<MessageBox>
				<Message>
					{lifeQuotes[Math.floor(Math.random() * lifeQuotes.length)]}
				</Message>
			</MessageBox>
			<Character />
		</Container>
	);
};

export default Welcome;

const Container = styled.div`
	width: 580px;
	height: 290px;
	background-color: ${({ theme }) => theme.colors.background};
	box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
	border-radius: 7px;
	padding: 36px 40px;
	position: relative;
`;

const WelcomeMessage = styled.p`
	font-size: 30px;
	font-weight: 700;
	margin-bottom: -10px;
	color: ${({ theme }) => theme.colors.title};
`;

const Name = styled.p`
	font-size: 30px;
	font-weight: 700;
	color: ${({ theme }) => theme.colors.title};
`;

const MessageBox = styled.div`
	width: 330px;
	height: 80px;
	position: relative;
	font-size: 18px;
	font-weight: 500;
	border-radius: 10px;
	padding: 20px;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 20px;
	background-color: ${({ theme }) => theme.colors.main};
`;

const Message = styled.p`
	color: ${({ theme }) => theme.colors.buttonTitle};
`;

const Character = styled.div`
	background-image: url('/images/welcome.png');
	width: 154px;
	height: 145px;
	position: absolute;
	bottom: 30px;
	right: 40px;
`;
