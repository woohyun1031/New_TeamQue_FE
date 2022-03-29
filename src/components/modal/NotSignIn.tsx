import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { changeModal } from '../../store/modules/modal';

const NotSignIn = () => {
	const dispatch = useDispatch();

	const toSignIn = () => {
		dispatch(changeModal('signIn'));
	};
	const toTutorial = () => {
		dispatch(changeModal('tutorial'));
	};

	return (
		<Container>
			<Message>환영합니다,</Message>
			<Message>
				<img src='/images/smallLogo.png' /> 입니다.
			</Message>
			<Button id='signIn' onClick={toSignIn}>
				큐하러 가기
			</Button>
			<LightButton onClick={toTutorial}>큐 둘러보기</LightButton>
			<Character src='/images/character1.png' />
		</Container>
	);
};

export default NotSignIn;

const Container = styled.div`
	width: 550px;
	height: 300px;
	padding: 40px 50px;
	position: relative;
`;

const Message = styled.h2`
	font-size: ${({ theme }) => theme.fontSizes.titleSize};
	color: ${({ theme }) => theme.colors.title};
`;

const Button = styled.button`
	width: 300px;
	height: 50px;
	border-radius: 7px;
	margin-top: 10px;
	display: block;
	border: none;
	background-color: ${({ theme }) => theme.colors.main};
	color: ${({ theme }) => theme.colors.buttonTitle};
	font-size: 22px;
	font-weight: 500;
	cursor: pointer;
	transition: 0.2s;
	&:hover {
		cursor: pointer;
		background-color: ${({ theme }) => theme.colors.darkerMain};
		//transform: translateY(-2px);
	}
	&:active {
		background-color: ${({ theme }) => theme.colors.moreDarkerMain};
		//transform: translateY(-2px);
	}
`;

const LightButton = styled(Button)`
	background-color: ${({ theme }) => theme.colors.brightMain};
`;

const Character = styled.img`
	position: absolute;
	right: 20px;
	bottom: 20px;
`;
