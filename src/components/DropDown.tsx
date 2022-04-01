import { useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { changeModal, openModal } from '../store/modules/modal';
import { signOut } from '../store/modules/user';

type DropDownProps = {
	name: string;
}

const DropDown = ({ name }: DropDownProps) => {
	const dispatch = useDispatch();
	const [isOpen, setIsOpen] = useState(false);

	const toggleDropDown = () => {
		setIsOpen((prevState) => !prevState);
	};

	const logout = () => {
		dispatch(signOut());
		window.location.reload();
	};

	const openMypage = () => {
		dispatch(changeModal('modifyuserinfo'));
		dispatch(openModal());
	};

	return (
		<Container>
			<Name onClick={toggleDropDown}>
				{name} 님
				<ArrowIcon
					src={isOpen ? '/images/arrowUp.png' : '/images/arrowDown.png'}
				/>
			</Name>
			{isOpen && (
				<>
					<BackGround onClick={toggleDropDown} />
					<Menu>
						<li onClick={openMypage}>마이페이지</li>
						<li onClick={logout}>로그아웃</li>
					</Menu>
				</>
			)}
		</Container>
	);
};

export default DropDown;

const Container = styled.div`
	position: relative;
`;

const Name = styled.button`
	font-size: 14px;
	font-weight: 600;
	position: relative;
	z-index: 101;
	padding: 10px;
`;

const ArrowIcon = styled.div<{ src: string }>`
	display: inline-block;
	width: 14px;
	height: 8px;
	margin-left: 5px;
	background-image: url(${({ src }) => src});
	background-repeat: no-repeat;
	background-position: center center;
`;

const Menu = styled.ul`
	width: 80px;
	height: 65px;
	border-radius: 7px;
	padding: 5px;
	font-size: 13px;
	font-weight: 400;
	bottom: -60px;
	left: 5px;
	box-shadow: 0 2px 2px rgba(0, 0, 0, 0.25);
	background-color: ${({ theme }) => theme.colors.backgorund};
	& li {
		width: 70px;
		text-align: center;
		margin: 0 auto;
		cursor: pointer;
		padding: 4px 0;
	}
	& li:nth-child(2) {
		color: ${({ theme }) => theme.colors.main};
		border-top: 1px solid ${({ theme }) => theme.colors.sub};
	}
	position: absolute;
	z-index: 101;
`;

const BackGround = styled.div`
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	top: 0;
	z-index: 100;
`;
