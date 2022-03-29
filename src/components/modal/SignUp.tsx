import { ChangeEvent, FormEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { signUp } from '../../store/modules/user';

const SignUp: React.FC = () => {
	const dispatch = useDispatch();
	const [inputs, setInputs] = useState({
		email: '',
		name: '',
		password: '',
		confirmPassword: '',
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
		dispatch(signUp(inputs));
	};

	return (
		<Form onSubmit={onSubmit}>
			<img src='/images/smallLogo.png' />
			<Input
				type='email'
				name='email'
				placeholder='이메일'
				onChange={onChange}
			/>
			<Input type='text' name='name' placeholder='이름' onChange={onChange} />
			<Input
				type='password'
				name='password'
				placeholder='비밀번호'
				onChange={onChange}
			/>
			<Input
				type='password'
				name='confirmPassword'
				placeholder='비밀번호 확인'
				onChange={onChange}
			/>
			<Button>회원가입</Button>
		</Form>
	);
};

export default SignUp;

const Form = styled.form`
	width: 460px;
	height: 510px;
	padding: 50px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
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
	transition: 0.3s;
	&::placeholder {
		color: ${({ theme }) => theme.colors.sub};
	}
	&:focus {
		width: 265px;
		height: 50px;
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
	transition: 0.2s;
	&:hover {
		cursor: pointer;
		background-color: ${({ theme }) => theme.colors.brightMain};
	}
	&:active {
		background-color: ${({ theme }) => theme.colors.darkerMain};
	}
`;
