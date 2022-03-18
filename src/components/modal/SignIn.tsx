import { ChangeEvent, FormEvent, MouseEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { KAKAO_API_URL } from '../../oAuth';
import { changeModal } from '../../store/modules/modal';
import { signIn } from '../../store/modules/user';

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
		dispatch(signIn(inputs))
	};

	const toSignUp = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		dispatch(changeModal('signUp'));
	};

	const onKakaoClick = (e : MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		console.log('카카오 로그인');    
    window.location.href = KAKAO_API_URL
  }

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
			<button onClick={onKakaoClick}>Login with Kakao</button>
			<p>
				Don't have an account? <button onClick={toSignUp}>Sign up</button>
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