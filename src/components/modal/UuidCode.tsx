import { MouseEvent } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import api from '../../api';
import { RootState } from '../../store/configStore';
import ModalCloseButton from './ModalCloseButton';

const StreamKey = () => {
	const classid: string = useSelector((state: RootState) => state.modal.data);

	const { data } = useQuery('streamKey', () =>
		api.getStreamCode(classid as string)
	);

	const onCopy = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		if (data?.streamKey) {
			navigator.clipboard.writeText(data?.streamKey).then(() => {
				alert('코드 복사 완료');
			});
		}
	};
	return (
		<Form>
			<ModalCloseButton />
			<UpperContainer>
				<h2>선생님 방송 StreamKEY</h2>
				<p>아래 코드를 복사하여 입력하세요</p>
				<Input>{data?.streamKey}</Input>
			</UpperContainer>
			<Buttons>
				<Button onClick={onCopy}>복사하기</Button>
			</Buttons>
		</Form>
	);
};

export default StreamKey;

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

const CloseButton = styled.button`
	background-image: url('/images/bigCloseButton.png');
	${({ theme }) => theme.commons.backgroundImage};
	background-color: rgba(113, 138, 255, 0.7);
	background-size: contain;
	position: absolute;
	left: 180px;
	top: 15px;
	transform: translate(-50%, -50%);
	width: 10px;
	height: 10px;
	text-align: center;
`;

const KakaButton = styled.button`
	background-image: url('/images/kakaolinkicon.png');
	${({ theme }) => theme.commons.backgroundImage};
	background-size: contain;
	border-radius: 10px;
	transform: translateX(90%);
	align-items: center;
	width: 60px;
	height: 60px;
`;
