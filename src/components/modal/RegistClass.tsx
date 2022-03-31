import { ChangeEvent, FormEvent, useState } from 'react';
import styled from 'styled-components';
import apis from '../../api';
import ModalCloseButton from './ModalCloseButton';

const RegistClass = () => {
	const [input, setInput] = useState('');
	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		setInput(e.target.value);
	};

	const registClass = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		apis.registClass(input);
		alert('수강 신청이 완료되었습니다');
		location.reload();
	};

	return (
		<>
			<ModalCloseButton />
			<Form onSubmit={registClass}>
				<h1>수업 코드 입력</h1>
				<Input
					type='text'
					placeholder='수업 참가 코드를 입력해주세요'
					onChange={onChange}
				/>
				<Button>수업 참가 신청</Button>
			</Form>
		</>
	);
};

export default RegistClass;

const Form = styled.form`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	width: 760px;
	height: 268px;
	padding: 50px;
`;

const Input = styled.input`
	width: 630px;
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
	width: 150px;
	height: 40px;
	border-radius: 7px;
	border: none;
	background-color: ${({ theme }) => theme.colors.main};
	color: ${({ theme }) => theme.colors.buttonTitle};
	font-size: 14px;
	font-weight: 600;
	position: relative;
	margin-right: 30px;
	margin-left: auto;
	cursor: pointer;
`;
