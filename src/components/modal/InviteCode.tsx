import { MouseEvent } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import api from '../../api';
import { RootState } from '../../store/configStore';
import ModalCloseButton from './ModalCloseButton';

const InviteCode = () => {
	const classid: string = useSelector((state: RootState) => state.modal.classId);

	const { data } = useQuery('inviteCode', () =>
		api.getInviteCode(classid as string)
	);
	const onCopy = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		if (data?.inviteCode) {
			navigator.clipboard.writeText(data?.inviteCode).then(() => {
				alert('코드 복사 완료');
			});
		}
	};

	return (
		<Form>
			<ModalCloseButton />
			<UpperContainer>
				<h2>더 많은 사람과 수업듣기</h2>
				<p>아래 링크를 복사하여 다른 사람을 초대할 수 있어요.</p>
				<Input>{data?.inviteCode}</Input>
			</UpperContainer>
			<Buttons>
				<Button onClick={onCopy}>복사하기</Button>
			</Buttons>
		</Form>
	);
};

export default InviteCode;

const Form = styled.form`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	width: 760px;
	height: 268px;
	padding: 50px;
`;
const UpperContainer = styled.div`
	display: flex;
	height: 115px;
	flex-direction: column;
	align-items: start;
	justify-content: space-between;
`;

const Input = styled.p`
	width: 630px;
	height: 40px;
	border-radius: 7px;
	border: none;
	background-color: ${({ theme }) => theme.colors.base};
	font-size: 14px;
	text-align: center;
	line-height: 40px;
	outline: none;
	&::placeholder {
		color: ${({ theme }) => theme.colors.sub};
	}
`;

const Buttons = styled.div`
	display: flex;
	justify-content: end;
	margin-right: 20px;
	position: relative;
`;

const Button = styled.button`
	width: 100px;
	height: 40px;
	border-radius: 7px;
	${({ theme }) => theme.commons.mainButton};
	color: ${({ theme }) => theme.colors.buttonTitle};
	font-size: 14px;
	font-weight: 600;
	margin: 0 10px;
	transition: 0.3s;
	&:hover {
		filter: brightness(105%);
	}
	&:active {
		filter: brightness(95%);
	}
`;
