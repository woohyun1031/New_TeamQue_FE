import { useState } from 'react';
import styled from 'styled-components';
import SignUp from './SignUp';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import DropDown from './DropDown';

const Header = () => {
	const name = '김학생';
	// 모달창 상태 관리
	const [isSignInOpen, setisSignInOpen] = useState(false);
	const [isSignUpOpen, setisSignUpOpen] = useState(false);
	const openSignIn = () => {
		setisSignInOpen(true);
	};
	const closeSignIn = () => {
		setisSignInOpen(false);
	};
	const openSignUp = () => {
		setisSignUpOpen(true);
	};
	const closeSignUp = () => {
		setisSignUpOpen(false);
	};
	return (
		<>
			<SignUp isOpen={isSignUpOpen} close={closeSignUp} />
			<Container>
				<Logo src={logo} to='/' />
				<DropDown name='김학생' />
			</Container>
		</>
	);
};
export default Header;

const Container = styled.div`
	/* 사이즈 */
	width: 1200px;
	height: 100px;
	/* 레이아웃 */
	margin: 0 auto;
	display: flex;
	align-items: flex-end;
	justify-content: space-between;
`;

type LogoType = {
	src: string;
};

const Logo = styled(Link)<LogoType>`
	/* 사이즈 */
	width: 120px;
	height: 50px;
	/* 임시 스타일 코드 */
	${(props) => `background-image: url(${props.src});`}
`;
