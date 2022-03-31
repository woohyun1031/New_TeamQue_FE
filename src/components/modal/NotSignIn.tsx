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
			<Message>환영합니다, <br /><img src='/images/smallLogo.png' /> 입니다.</Message>
			<Button id='signIn' onClick={toSignIn}>
				큐하러 가기
			</Button>
			<LightButton onClick={toTutorial}>큐 둘러보기</LightButton>
			<Character />
		</Container>
	);
};

export default NotSignIn;

const Container = styled.div`
	width: 550px;
	height: 300px;
	padding: 40px 70px;
	position: relative;
`;

const Message = styled.h2`
	font-size: ${({ theme }) => theme.fontSizes.xxxlg};
	color: ${({ theme }) => theme.colors.title};
	margin-bottom: 30px;
`;

const Button = styled.button`
	width: 250px;
	height: 45px;
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
	}
	&:active {
		background-color: ${({ theme }) => theme.colors.moreDarkerMain};
	}
`;

const LightButton = styled(Button)`
	background-color: ${({ theme }) => theme.colors.sub};
	&:hover {
		cursor: pointer;
		background-color: ${({ theme }) => theme.colors.subHover};
	}
	&:active {
		background-color: ${({ theme }) => theme.colors.subActive};
	}
`;

const Character = styled.div`
	background-image: url('/images/notSignIn.png');
	background-position: center center;
	background-repeat: no-repeat;
	position: absolute;
	width: 150px;
	height: 165px;
	right: 50px;
	bottom: 30px;
`;
