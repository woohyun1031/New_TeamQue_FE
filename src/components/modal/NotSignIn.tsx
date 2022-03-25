import { useDispatch } from "react-redux";
import styled from 'styled-components';
import { changeModal } from '../../store/modules/modal';

const NotSignIn = () => {
	const dispatch = useDispatch();
	const toSignIn = () => {
		dispatch(changeModal('signIn'));
	};
	return (
		<Container>
			<Message>환영합니다,</Message>
			<Message>
				<img src='/images/smallLogo.png' /> 입니다.
			</Message>
			<Button onClick={toSignIn}>큐하러 가기</Button>
			<LightButton
				onClick={() => {
					alert('튜토리얼 구현 중');
				}}
			>
				큐 둘러보기
			</LightButton>
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
	font-size: ${({ theme }) => theme.fontSizes.welcome};
	color: ${({ theme }) => theme.colors.black};
`;

const Button = styled.button`
	width: 300px;
	height: 50px;
	border-radius: 7px;
	margin-top: 10px;
	display: block;
	border: none;
	background-color: ${({ theme }) => theme.colors.main};
	color: ${({ theme }) => theme.colors.white};
	font-size: 22px;
	font-weight: 500;
	cursor: pointer;
`;

const LightButton = styled(Button)`
	background-color: ${({ theme }) => theme.colors.brightMain};
`

const Character = styled.img`
	position: absolute;
	right: 20px;
	bottom: 20px;
`;