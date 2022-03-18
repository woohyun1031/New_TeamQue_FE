import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../../store/configStore';
import { closeModal } from '../../store/modules/modal';
import NotSignIn from './NotSignIn';
import SignIn from './SignIn';
import SignUp from './SignUp';

const modalRoot = document.querySelector('#modal') as HTMLElement;

const Modal: React.FC = () => {
	const dispatch = useDispatch()
	const modal = useSelector((state: RootState) => state.modal);
	let contents;
	switch (modal.type) {
		case 'notSignIn':
			contents = <NotSignIn />;
			break
		case 'signIn':
			contents = <SignIn />;
			break
		case 'signUp':
			contents = <SignUp />;
			break
		default:
			contents = null;
	}
	const close = () => {
		dispatch(closeModal())
	}
	if (!modal.isOpen) return null;
	return createPortal(
		<Background>
			<Contents>
				<CloseButton
					onClick={close}
				>
					X
				</CloseButton>
				{contents}
			</Contents>
		</Background>,
		modalRoot
	);
};

export default Modal;

const Background = styled.div`
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: rgba(0, 0, 0, 0.3);
	backdrop-filter: blur(5px);
`;

const Contents = styled.div`
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	/* style */
	padding: 50px;
	background-color: #fff;
	border-radius: 10px;
	box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.3);
`;

const CloseButton = styled.button`
	background: none;
	border: none;
	position: absolute;
	top: 10px;
	right: 10px;
	cursor: pointer;
`;
