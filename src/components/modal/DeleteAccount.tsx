import { ChangeEvent, KeyboardEvent, useState } from 'react';
import { useMutation } from 'react-query';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import api from '../../api';
import { signOut } from '../../store/modules/user';
import ModalCloseButton from './ModalCloseButton';

const DeleteAccount = () => {
	const dispatch = useDispatch();
	const [input, setInput] = useState('');

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setInput(e.target.value);
	};

	const { mutate: deleteAccount } = useMutation(
		(input: string) => api.deleteClass(input),
		{
			onSuccess: () => {
				alert('탈퇴가 완료되었습니다.');
				dispatch(signOut());
				window.location.reload();
			},
			onError: (error: Error) => {
				alert('다시 시도해주세요.');
				console.log(error);
			},
		}
	);

	const hendleCheckEnter = (e: KeyboardEvent<HTMLFormElement>) => {
		if (e.key === 'Enter') {
			deleteAccount(input);
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
			<Button onClick={() => deleteAccount}>회원탈퇴</Button>
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
	background-color: ${({ theme }) => theme.colors.base};
	margin-top: 10px;
	margin-bottom: 20px;
`;

const Button = styled.button`
	width: 265px;
	height: 38px;
	border-radius: 7px;
	${({ theme }) => theme.commons.mainButton};
	color: ${({ theme }) => theme.colors.buttonTitle};
	font-weight: bold;
	margin-bottom: 10px;
	transition: 0.3s;
	&:hover {
		filter: brightness(105%);
	}
	&:active {
		filter: brightness(95%);
	}
`;
