import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import DropDown from './DropDown';
import { RootState } from '../store/configStore';
import { useSelector } from 'react-redux';

const Header = () => {
	const navigate = useNavigate();
	const user = useSelector((state: RootState) => state.user);

	const toMain = () => {
		navigate('/');
	};

	return (
		<>
			<Container>
				<Logo src='/images/logo.png' onClick={toMain} />
				<DropDown name={user.user_info.name} />
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

const Logo = styled.button<{ src: string }>`
	background: none;
	${(props) => `background-image: url(${props.src});`}
	border: none;
	width: 130px;
	height: 60px;
	background-repeat: no-repeat;
`;
