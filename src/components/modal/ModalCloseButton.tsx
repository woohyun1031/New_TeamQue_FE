import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { closeModal } from '../../store/modules/modal';

const ModalCloseButton = () => {
	const dispatch = useDispatch();
	const onClick = () => {
		dispatch(closeModal());
	};
	return <CloseButton src='/images/bigCloseButton.png' onClick={onClick} />;
};

export default ModalCloseButton;

interface CloseButtonProps {
	src: string;
}

const CloseButton = styled.button<CloseButtonProps>`
	width: 17px;
	height: 17px;
	border: none;
	background: none;
	background-image: ${(props) => props.src && `url('${props.src}')`};
	position: absolute;
	top: 30px;
	right: 30px;
	cursor: pointer;
`;
