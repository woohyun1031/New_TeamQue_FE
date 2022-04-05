import {
	ChangeEvent,
	KeyboardEvent,
	MouseEvent,
	useState,
} from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import api from '../../api';
import { changeModal } from '../../store/modules/modal';
import ModalCloseButton from './ModalCloseButton';

const ModifyUserInfo = () => {
	const dispatch = useDispatch();
	const [input, setInput] = useState('');

	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		setInput(e.target.value);
	};

	const ChangeName = async () => {
		if (confirm(`${input}으로 이름을 변경하시겠습니까?`)) {
			await api.modifyUserInfo(input);
			location.reload();
		}
	};

	const onCheckEnter = (e: KeyboardEvent<HTMLFormElement>) => {
		if (e.key === 'Enter') {
			ChangeName();
		}
	};

	const toDeleteAccount = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		dispatch(changeModal('deleteaccount'));
	};

	return (
		<Form onKeyPress={onCheckEnter}>
			<ModalCloseButton />
			<FormTitle>회원 정보 관리</FormTitle>
			<FormDescription>이름을 변경할 수 있습니다.</FormDescription>
			<Label htmlFor='name'>이름</Label>
			<Input type='text' id='name' onChange={onChange} />
			<Button onClick={ChangeName}>정보 수정하기</Button>
			<WithdrawGuide>
				큐 졸업하고싶다면?
				<ToWithdrawButton onClick={toDeleteAccount}>
					회원탈퇴하기
				</ToWithdrawButton>
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
	transition: .3s;
	&:hover {
		filter: brightness(105%);
	}
	&:active {
		filter: brightness(95%);
	}
`;

const WithdrawGuide = styled.p`
	text-align: center;
`;

const ToWithdrawButton = styled.button`
	background: none;
	text-decoration: underline;
	color: ${({ theme }) => theme.colors.signOut};
	margin-left: 10px;
	transition: .3s;
	&:hover {
		filter: brightness(110%);
	}
	&:active {
		filter: brightness(90%);
	}
`;
