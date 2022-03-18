import styled from 'styled-components';



const SignUp: React.FC = () => {
	return (
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
	);
};

export default SignUp;

const Form = styled.form`
	display: flex;
	flex-direction: column;
	align-items: center;
`;
