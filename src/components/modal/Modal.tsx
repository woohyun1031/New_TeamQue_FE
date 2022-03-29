import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../../store/configStore';
import AddClass from './AddClass';
import NotSignIn from './NotSignIn';
import SignIn from './SignIn';
import SignUp from './SignUp';
import Tutorial from './Tutorial';
import InviteCode from './InviteCode';
import { closeModal } from '../../store/modules/modal';
import { useEffect } from 'react';

const modalRoot = document.querySelector('#modal') as HTMLElement;

const Modal: React.FC = () => {
	const dispatch = useDispatch();
	const modal = useSelector((state: RootState) => state.modal);
	let contents;

	let isCanClose = false;
	useEffect(() => {
		if (['notSignIn', 'signIn', 'signUp', 'tutorial'].includes(modal.type)) {
			isCanClose = false;
		} else {
			isCanClose = true;
		}
	}, [modal.type, modal.isOpen]);

	switch (modal.type) {
		case 'notSignIn':
			contents = <NotSignIn />;
			break;
		case 'signIn':
			contents = <SignIn />;
			break;
		case 'signUp':
			contents = <SignUp />;
			break;
		case 'addClass':
			contents = <AddClass />;
			break;
		case 'inviteCode':
			contents = <InviteCode />;
			break;
		case 'tutorial':
			contents = <Tutorial />;
			break;

		default:
			contents = null;
	}

	if (!modal.isOpen) return null;
	return createPortal(
		<Background
			onClick={() => {
				if (isCanClose) {
					dispatch(closeModal());
				}
			}}
		>
			<Contents onClick={(e) => e.stopPropagation()}>{contents}</Contents>
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
	background-color: rgba(0, 0, 0, 0.1);
	backdrop-filter: blur(5px);
	z-index: 1000;
`;

const Contents = styled.div`
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #fff;
	border-radius: 10px;
	box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.15);
	z-index: 1001;
`;
