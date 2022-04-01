import { ChangeEvent, FormEvent, KeyboardEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import apis from '../../api';
import { signOut } from '../../store/modules/user';
import ModalCloseButton from './ModalCloseButton';

const DeleteAccount = () => {
	const dispatch = useDispatch();
	const [input, setInput] = useState('');

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setInput(e.target.value);
	};

	const deleteAccount = async () => {
		if (confirm('정말로 회원탈퇴 하시겠어요?')) {
			await apis.withdrawal(input);
			alert('탈퇴가 완료되었습니다.');
			dispatch(signOut());
			location.reload();
		} 
	};

	const hendleCheckEnter = (e: KeyboardEvent<HTMLFormElement>) => {
		if (e.key === 'Enter') {
			deleteAccount();
		}
	};

	return (
		<Form onKeyPress={hendleCheckEnter}>
			<ModalCloseButton />
			<FormTitle>회원 탈퇴</FormTitle>
			<FormDescription>
				비밀번호를 한번 더 입력해주시면 <br /> 회원 탈퇴가 완료됩니다.
			</FormDescription>
			<Label htmlFor='password'>비밀번호</Label>
			<Input type='password' id='password' onChange={handleChange} />
			<Button onClick={deleteAccount}>회원탈퇴</Button>
		</Form>
	);
};

export default DeleteAccount;

const Form = styled.form`
	width: 460px;
	height: 360px;
	font-size: 12px;
	padding: 60px 100px;
	color: ${({ theme }) => theme.colors.title};
`;

const FormTitle = styled.h2`
	font-size: 22px;
	font-weight: bold;
`;

const FormDescription = styled.p`
	margin-top: 10px;
	margin-bottom: 30px;
`;

const Label = styled.label``;

const Input = styled.input`
	width: 265px;
	height: 38px;
	border-radius: 7px;
	padding: 12px;
	background-color: #f4f4f4;
	margin-top: 10px;
	margin-bottom: 20px;
`;

const Button = styled.button`
	width: 265px;
	height: 38px;
	border-radius: 7px;
	background-color: #718aff;
	color: #fff;
	font-weight: bold;
	margin-bottom: 10px;
`;
