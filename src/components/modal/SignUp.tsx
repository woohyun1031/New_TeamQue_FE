import styled from 'styled-components';

const SignUp: React.FC = () => {
	return (
		<Form>
			<img src='/images/smallLogo.png' />
			<Input type='email' placeholder='이메일' />
			<Input type='text' placeholder='닉네임' />
			<Input type='password' placeholder='비밀번호' />
			<Input type='password' placeholder='비밀번호 확인' />
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
