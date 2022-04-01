import styled from 'styled-components';

const Withdraw = () => {
	return (
		<Form>
			<h2>회원 탈퇴</h2>
			<p>
				비밀번호를 한번 더 입력해주시면 <br /> 회원 탈퇴가 완료됩니다.
			</p>
			<label htmlFor='password'>비밀번호</label>
			<input type='password' id='password' />
			<button>회원탈퇴</button>
		</Form>
	);
};

export default Withdraw;

const Form = styled.form`
	width: 460px;
	height: 360px;
	color: ${({ theme }) => theme.colors.title};
`;
