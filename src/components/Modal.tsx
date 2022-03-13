import styled from 'styled-components';

interface Props {
	close: () => void;
}

const Modal: React.FC<Props> = ({ close, children }) => {
	return (
		<Background>
			<Contents>
				<CloseButton onClick={close}>X</CloseButton>
				{children}
			</Contents>
		</Background>
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
