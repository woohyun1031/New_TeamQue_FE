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

	const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log('로그인 정보 확인', inputs);
		await dispatch(signIn(inputs));
		location.reload();
	};

	const toSignUp = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		dispatch(changeModal('signUp'));
	};

	const onKakaoClick = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		console.log('카카오 로그인');
		window.location.href = KAKAO_API_URL;
	};

	return (
		<Form onSubmit={onSubmit}>
			<img src='/images/smallLogo.png' />
			<Input
				type='email'
				placeholder='이메일'
				name='userEmail'
				onChange={onChange}
			/>
			<Input
				type='password'
				name='password'
				onChange={onChange}
				placeholder='비밀번호'
			/>
			<Button>로그인</Button>
			<p>or</p>
			{/* <Button>Sign in with Google</Button> */}
			<KakaoButton onClick={onKakaoClick}>
				<img src='/images/kakao.png' />
				카카오 로그인
			</KakaoButton>
			<p>
				Don&apos;t have an account? <SignUp onClick={toSignUp}>Sign up</SignUp>
			</p>
		</Form>
	);
};

export default SignIn;

const Form = styled.form`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
	width: 500px;
	height: 500px;
	padding: 50px;
`;

const Input = styled.input`
	width: 260px;
	height: 40px;
	border-radius: 7px;
	border: none;
	background-color: ${({ theme }) => theme.colors.base};
	font-size: 14px;
	padding-left: 20px;
	outline: none;
	&::placeholder {
		color: ${({ theme }) => theme.colors.sub};
	}
`;

const Button = styled.button`
	width: 260px;
	height: 40px;
	border-radius: 7px;
	border: none;
	background-color: ${({ theme }) => theme.colors.main};
	color: ${({ theme }) => theme.colors.buttonTitle};
	font-size: 14px;
	font-weight: 600;
	position: relative;
	cursor: pointer;
`;

const KakaoButton = styled(Button)`
	background-color: ${({ theme }) => theme.colors.kakaoBg};
	color: ${({ theme }) => theme.colors.kakaoTitle};
	& img {
		position: absolute;
		left: 20px;
		top: 15px;
	}
`;

const SignUp = styled.button`
	border: none;
	background: none;
	color: ${({ theme }) => theme.colors.signOut};
	text-decoration: underline;
	font-size: 16px;
	cursor: pointer;
`;
