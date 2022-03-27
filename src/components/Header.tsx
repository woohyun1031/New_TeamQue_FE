import styled from 'styled-components';
import { Link } from 'react-router-dom';
import DropDown from './DropDown';
import { RootState } from '../store/configStore';
import { useSelector } from 'react-redux';

const Header = () => {
	const user = useSelector((state: RootState) => state.user);
	return (
		<>
			<Container>
				<Logo src='/images/logo.png' to='/' />
				<DropDown name={user.user_info.nickname} />
			</Container>
		</>
	);
};
export default Header;

const Container = styled.div`
	width: 1200px;
	height: 100px;
	margin: 0 auto;
	display: flex;
	align-items: flex-end;
	justify-content: space-between;
	background-color: ${({ theme }) => theme.colors.background};
`;

type LogoType = {
	src: string;
};

const Logo = styled(Link)<LogoType>`
	width: 130px;
	height: 50px;
	background-repeat: no-repeat;
	${(props) => `background-image: url(${props.src});`}
`;
