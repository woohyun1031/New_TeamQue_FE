import styled from 'styled-components';
import Modal from './Modal';

interface Props {
	isOpen: boolean;
	close: () => void;
}

const SignUp: React.FC<Props> = ({ isOpen, close }) => {
	if (!isOpen) {
		return null;
	}
	return (
		<Modal close={close}>
			<Form>
				<label>
					Email:
					<input type='email' />
				</label>
				<label>
					Nickname:
					<input type='text' />
				</label>
				<label>
					Password:
					<input type='password' />
				</label>
				<label>
					Confirm Password:
					<input type='password' />
				</label>
				<button>Sign Up</button>
			</Form>
		</Modal>
	);
};

export default SignUp;

const Form = styled.form`
	display: flex;
	flex-direction: column;
	align-items: center;
`;
