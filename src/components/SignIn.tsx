import { ChangeEvent, FormEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

interface Props {
	isOpen: boolean;
	close: () => void;
	openSignUp: () => void;
}

const SignIn: React.FC = () => {
	const dispatch = useDispatch();
	const [inputs, setInputs] = useState({
		userEmail: '',
		password: '',
	});

	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setInputs({
			...inputs,
			[name]: value,
		});
	};

	const onSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log('로그인 정보 확인', inputs);
	};
	return (
		<Form onSubmit={onSubmit}>
			<h2>Sign Up</h2>
			<label>
				Email:
				<input
					type='email'
					placeholder='Email'
					name='userEmail'
					onChange={onChange}
				/>
			</label>
			<label>
				Password:
				<input
					type='password'
					name='password'
					onChange={onChange}
					placeholder='Password'
				/>
			</label>
			<button>Sign In</button>
			<p>or</p>
			<button>Sign in with Google</button>
			<button>Login with Kakao</button>
			<p>
				Don't have an account? <button>Sign up</button>
			</p>
		</Form>
	);
};

export default SignIn;

const Form = styled.form`
	display: flex;
	flex-direction: column;
	align-items: center;
`;
