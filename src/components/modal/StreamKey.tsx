import { MouseEvent } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import api from '../../api';
import { RootState } from '../../store/configStore';
import ModalCloseButton from './ModalCloseButton';

const StreamKey = () => {
	const classid: string = useSelector(
		(state: RootState) => state.modal.classId
	);

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
			<p>1. OBS studio프로그램을 실행시킵니다.</p>
			<p>2. 설정으로 들어가 방송 탭을 누릅니다.</p>
			<p>
				3. 사용자 지정을 선택하고 서버에는 rtmp://xpecter.shop/live를
				입력합니다.
			</p>
			<p>4. 방송열쇠에는 강의 페이지의 방송키를 입력합니다.</p>
			<p>
				5. 확인 버튼을 누른 후 방송시작을 누르면 됩니다.
			</p>
		</Form>
	);
};

export default StreamKey;

const Form = styled.form`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	width: 760px;
	height: 380px;
	padding: 50px;
	h2 {
		margin-bottom: 10px;
	}
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
	margin-top: 10px;
	margin-bottom: 100px;
	&::placeholder {
		color: ${({ theme }) => theme.colors.sub};
	}
`;

const Buttons = styled.div`
	display: flex;
	justify-content: end;
	margin-top: 20px;
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
