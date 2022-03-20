import styled from 'styled-components';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import DropDown from './DropDown';
import { RootState } from '../store/configStore';
import { useSelector } from 'react-redux';

const Header = () => {
	const user = useSelector((state: RootState) => state.user)
	return (
		<>
			<Container>
				<Logo src={logo} to='/' />
				<DropDown name={user.user_info.nickname} />
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
	width: 130px;
	height: 50px;
	background-repeat: no-repeat;
	/* 임시 스타일 코드 */
	${(props) => `background-image: url(${props.src});`}
`;
