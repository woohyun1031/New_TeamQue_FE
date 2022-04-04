import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store/configStore';
import { useSelector } from 'react-redux';
import DropDown from './DropDown';

const Header = () => {
	const navigate = useNavigate();
	const user = useSelector((state: RootState) => state.user);

	const toMain = () => {
		navigate('/');
	};

	return (
		<Container>
			<Inner>
				<Logo onClick={toMain} />
				<DropDown name={user.name} />
			</Inner>
		</Container>
	);
};
export default Header;

const Container = styled.div`
	width: auto;
`;

const Inner = styled.div`
	width: 1200px;
	height: 100px;
	margin: 0 auto;
	display: flex;
	align-items: flex-end;
	justify-content: space-between;
`;

const Logo = styled.button`
	background-image: url('/images/logo.png');
	${({theme}) => theme.commons.backgroundImage}
	width: 130px;
	height: 60px;
	background-repeat: no-repeat;
`;
