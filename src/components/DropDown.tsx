import { useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { signOut } from '../store/modules/user';

interface Props {
	name: string;
}

const DropDown: React.FC<Props> = ({ name }) => {
	const dispatch = useDispatch();
	const [isOpen, setIsOpen] = useState(false);
	const toggleDropDown = () => {
		setIsOpen((prevState) => !prevState);
	};
	const logout = () => {
		dispatch(signOut());
		location.reload();
	};
	return (
		<Container>
			<Name onClick={toggleDropDown}>{name} 님</Name>
			<Menu isOpen={isOpen}>
				<li>마이페이지</li>
				<li onClick={logout}>로그아웃</li>
				<Line />
			</Menu>
		</Container>
	);
};

export default DropDown;

interface MenuProps {
	isOpen: boolean;
}

const Menu = styled.ul<MenuProps>`
	/* ${(props) => !props.isOpen && 'opacity: 0;'} */
	/* opacity: 0; */
	/* 사이즈 */
	width: 80px;
	height: 65px;
	/* 레이아웃 */
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-around;
	/* 스타일 */
	font-weight: 400;
	position: absolute;
	bottom: -60px;
	right: -15px;
	font-size: 13px;
	border-radius: 7px;
	box-shadow: 0 2px 2px rgba(0, 0, 0, 0.25);
	transition: 0.3s;
	cursor: pointer;
	& li:nth-child(2) {
		color: ${({ theme }) => theme.colors.signOut};
		cursor: pointer;
	}
	display: none;
`;

const Name = styled.button`
	border: none;
	background: none;
	/* 임시 스타일 */
	font-size: 14px;
	font-weight: 600;
`;

const Container = styled.div`
	position: relative;
	padding-bottom: 20px;
	&:hover ${Menu} {
		display: flex;
	}
`;

const Line = styled.div`
	width: 70px;
	height: 1px;
	border-bottom: 1px solid ${({ theme }) => theme.colors.sub};
	position: absolute;
	cursor: default;
`;
