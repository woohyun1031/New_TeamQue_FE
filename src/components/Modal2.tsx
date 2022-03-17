import { createPortal } from 'react-dom';

const modalRoot = document.querySelector('#modal') as HTMLElement;

const Modal2: React.FC<{}> = ({ children }) => {
	return createPortal(<h1>포탈 실험</h1>, modalRoot);
};

export default Modal2;

