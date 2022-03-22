import { useDispatch } from "react-redux";
import styled from 'styled-components';
import { changeModal } from '../../store/modules/modal';
import logo from '../../assets/smallLogo.png';
import character from '../../assets/character1.png';

const NotSignIn = () => {
	const dispatch = useDispatch();
	const toSignIn = () => {
		dispatch(changeModal('signIn'));
	};
	return (
		<Container>
			<Message>환영합니다,</Message>
			<Message>
				<img src={logo} /> 입니다.
			</Message>
			<Button onClick={toSignIn}>큐하러 가기</Button>
			<Button
				onClick={() => {
					alert('튜토리얼 구현 중');
				}}
			>
				큐 둘러보기
			</Button>
			<Character src={character} />
		</Container>
	);
};

export default NotSignIn;

const Container = styled.div`
	width: 550px;
	height: 300px;
	position: relative;
	font-size: 24px;
	padding: 30px;
`;

const Message = styled.h2`
	font-size: 26px;
`;

const Button = styled.button`
	display: block;
	width: 300px;
	height: 50px;
	border-radius: 7px;
	border: none;
	background-color: #718aff;
	color: #fff;
	font-size: 22px;
	font-weight: bold;
	margin-left: 30px;
	margin-top: 20px;
	cursor: pointer;
`;

const Character = styled.img`
	position: absolute;
	right: 20px;
	bottom: 20px;
`;