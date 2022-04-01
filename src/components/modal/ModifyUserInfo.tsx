import { ChangeEvent, FormEvent, MouseEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import apis from '../../api';
import { changeModal } from '../../store/modules/modal';
import ModalCloseButton from './ModalCloseButton';

const ModifyUserInfo = () => {
	const dispatch = useDispatch();
	const [input, setInput] = useState('');

	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		setInput(e.target.value);
	};

	const onSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		apis.modifyUserInfo(input);
	};

	const toDeleteAccount = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		dispatch(changeModal('deleteaccount'));
	};

	return (
		<Form onSubmit={onSubmit}>
			<ModalCloseButton />
			<FormTitle>회원 정보 관리</FormTitle>
			<FormDescription>이름을 변경할 수 있습니다.</FormDescription>
			<Label htmlFor='name'>이름</Label>
			<Input type='text' id='name' onChange={onChange} />
			<Button>정보 수정하기</Button>
			<WithdrawGuide>
				큐 졸업하고싶다면?{' '}
				<ToWithdrawButton onClick={toDeleteAccount}>회원탈퇴하기</ToWithdrawButton>
			</WithdrawGuide>
		</Form>
	);
};

export default ModifyUserInfo;

const Form = styled.form`
	width: 460px;
	height: 360px;
	padding: 60px 100px;
	font-size: 12px;
`;

const FormTitle = styled.h2`
	font-size: 22px;
	font-weight: bold;
`;

const FormDescription = styled.p`
	margin-top: 15px;
	margin-bottom: 40px;
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

const WithdrawGuide = styled.p`
	text-align: center;
`;

const ToWithdrawButton = styled.button`
	background: none;
	text-decoration: underline;
	color: #f73535;
	margin-left: 10px;
`;
