import { MouseEvent } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { closeModal } from '../../store/modules/modal';

const ModalCloseButton = () => {
	const dispatch = useDispatch();

	const onClick = (e:MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		dispatch(closeModal());
	};

	return <CloseButton onClick={onClick} />;
};

export default ModalCloseButton;

const CloseButton = styled.button`
	width: 17px;
	height: 17px;
	background-image: url('/images/bigCloseButton.png');
	position: absolute;
	top: 30px;
	right: 30px;
`;
