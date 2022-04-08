import axios from 'axios';
import { ChangeEvent, FormEvent, MouseEvent, useState } from 'react';
import { useMutation } from 'react-query';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import api, { instance } from '../../api';
import { openModal } from '../../store/modules/modal';
import { signIn } from '../../store/modules/user';

const SignIn = () => {
	const dispatch = useDispatch();

	const [inputs, setInputs] = useState({
		email: '',
		password: '',
	});

	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setInputs({
			...inputs,
			[name]: value,
		});
	};

	const { mutate } = useMutation(() => api.signIn(inputs), {
		onSuccess: (res) => {
			sessionStorage.setItem('accessToken', res.accessToken);
			sessionStorage.setItem('refreshToken', res.refreshToken);
			instance.defaults.headers.common[
				'Authorization'
			] = `Bearer ${sessionStorage.getItem('accessToken')}`;
		},
		onError: (error) => {
			if (axios.isAxiosError(error)) {
				alert(error.response?.data.message);
			}
		},
	});

	const onSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		mutate();
		dispatch(signIn(inputs));
	};

	const toNotSignIn = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		dispatch(openModal('notSignIn'));
	};

	const toSignUp = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		dispatch(openModal('signUp'));
	};

	const kakaoLogin = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		window.location.href = 'https://noobpro.shop/user/kakao';
	};

	const googleLogin = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		window.location.href = 'https://noobpro.shop/user/google';
	};

	return (
		<Form onSubmit={onSubmit}>
			<Title>돌아오셨군요!</Title>
			<Description>계속 하려면 로그인하기</Description>
			<Label htmlFor='email'>이메일</Label>
			<Input
				type='email'
				placeholder='이메일'
				name='email'
				onChange={onChange}
				id='email'
			/>
			<Label htmlFor='password'>비밀번호</Label>
			<Input
				type='password'
				name='password'
				onChange={onChange}
				placeholder='비밀번호'
				id='password'
			/>
			<Button>로그인하기</Button>
			<Or>또는</Or>
			<GoogleLogin onClick={googleLogin}>
				<img src='/images/google.png' />
				구글 로그인
			</GoogleLogin>
			<KakaoButton onClick={kakaoLogin}>
				<img src='/images/kakao.png' />
				카카오 로그인
			</KakaoButton>
			<SignUpMessage>
				아직 계정이 없다면? <SignUp onClick={toSignUp}>회원가입하기</SignUp>
			</SignUpMessage>
			<Back onClick={toNotSignIn} />
		</Form>
	);
};

export default SignIn;

const Form = styled.form`
	width: 480px;
	height: 560px;
	padding: 60px 100px;
`;

const Back = styled.button`
	background-image: url('/images/back.png');
	background-repeat: no-repeat;
	width: 11px;
	height: 19px;
	position: absolute;
	top: 70px;
	left: 77px;
`;

const Title = styled.h2`
	font-size: 22px;
	font-weight: bold;
	margin-bottom: 9px;
`;

const Description = styled.p`
	font-size: 12px;
	margin-bottom: 24px;
`;

const Label = styled.label`
	display: block;
	font-size: 12px;
	margin-bottom: 5px;
`;

const Input = styled.input`
	width: 280px;
	height: 40px;
	border-radius: 7px;
	background-color: ${({ theme }) => theme.colors.base};
	font-size: 12px;
	padding-left: 20px;
	&::placeholder {
		color: ${({ theme }) => theme.colors.sub};
	}
	margin-bottom: 10px;
`;

const Button = styled.button`
	width: 280px;
	height: 40px;
	border-radius: 7px;
	color: ${({ theme }) => theme.colors.buttonTitle};
	font-size: 14px;
	font-weight: 600;
	position: relative;
	transition: 0.2s;
	${({ theme }) => theme.commons.mainButton};
`;

const Or = styled.p`
	margin: 19px 0;
	text-align: center;
`;

const KakaoButton = styled(Button)`
	background-color: ${({ theme }) => theme.colors.kakaoBg};
	color: ${({ theme }) => theme.colors.kakaoTitle};
	& img {
		position: absolute;
		left: 20px;
		top: 15px;
	}
	margin-bottom: 22px;
	&:hover {
		background-color: ${({ theme }) => theme.colors.brightKakao};
	}
`;

const GoogleLogin = styled(Button)`
	background-color: ${({ theme }) => theme.colors.background};
	color: #757575;
	box-shadow: 0 0.5px 4px rgba(0, 0, 0, 0.25);
	& img {
		position: absolute;
		left: 20px;
		top: 15px;
	}
	margin-bottom: 10px;
	&:hover {
		background-color: ${({ theme }) => theme.colors.whiteHover};
	}
	&:active {
		background-color: ${({ theme }) => theme.colors.whiterActive};
	}
`;

const SignUpMessage = styled.p`
	font-size: 12px;
	text-align: center;
`;

const SignUp = styled.button`
	color: ${({ theme }) => theme.colors.signOut};
	text-decoration: underline;
	font-size: 12px;
	&:hover {
		color: ${({ theme }) => theme.colors.signoutHover};
	}
`;
