import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import api from '../../api';
import { CardType } from '../../type';

const Card = ({
	id,
	imageUrl,
	teacher,
	title,
	timeTable,
	state,
	isStream,
}: CardType) => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const toClassRoom = () => {
		navigate(`/classroom/${id}`);
	};

	const toClassHome = () => {
		navigate(`/classhome/${id}/1`);
	};

	const { mutate: cancel } = useMutation(() => api.cancelApply(id.toString()), {
		onError: (error) => {
			if (axios.isAxiosError(error)) {
				alert(error.response?.data.message);
			}
		},
	});

	const handleClick = async () => {
		if (confirm('정말로 수강 취소 하시겠어요?')) {
			cancel();
		}
	};

	if (state == 'wait') {
		return (
			<WaitContainer>
				<Thumbnail src={imageUrl} />
				<WaitThumbnail />
				<BadgeBox>
					<WaitBadge>대기중</WaitBadge>
				</BadgeBox>
				<Title>{title}</Title>
				<Teacher>{teacher} 선생님</Teacher>
				<WaitButton onClick={handleClick}>신청 취소하기</WaitButton>
			</WaitContainer>
		);
	}

	return (
		<Container>
			<Thumbnail src={imageUrl} />
			<ThumbnailFilter onClick={toClassRoom} />
			<BadgeBox>
				<SubBadge>진행중</SubBadge>
				{isStream ? <Badge>방송중</Badge> : <WaitBadge>대기중</WaitBadge>}
			</BadgeBox>
			<Title>{title}</Title>
			<Teacher>{teacher} 님</Teacher>
			<TimeTables>
				{timeTable.map((time) => (
					<TimeTable key={time}>{time}</TimeTable>
				))}
			</TimeTables>
			<HomeButton onClick={toClassHome} />
		</Container>
	);
};

export default Card;

const Container = styled.div`
	width: 300px;
	height: 380px;
	border-radius: 10px;
	padding: 16px 23px;
	box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
	position: relative;
	color: ${({ theme }) => theme.colors.title};
	& + & {
		margin-left: 20px;
	}
	background-color: ${({ theme }) => theme.colors.background};
`;

const WaitContainer = styled(Container)`
	color: #ccc;
`;

const ThumbnailFilter = styled.div`
	background-image: url('/images/play.png');
	background-repeat: no-repeat;
	background-position: center center;
	width: 255px;
	height: 172px;
	border-radius: 7px;
	top: 16px;
	position: absolute;
	opacity: 0;
	z-index: 10;
	transition: 0.5s;
	cursor: pointer;
	&:hover {
		opacity: 1;
	}
	background-color: rgba(0, 0, 0, 0.2);
`;

const Thumbnail = styled.div<{ src: string }>`
	background-image: url(${({ src }) => src});
	background-size: cover;
	background-position: center center;
	width: 255px;
	height: 172px;
	border-radius: 7px;
	margin-bottom: 14px;
	&:hover ${ThumbnailFilter} {
		opacity: 1;
	}
`;

const BadgeBox = styled.div`
	width: 100%;
	height: 18px;
	display: flex;
	margin-bottom: 13px;
`;

const Badge = styled.div<{ type?: 'accepted' | 'wait' | 'teach' }>`
	width: 52px;
	height: 18px;
	border-radius: 7px;
	font-size: 10px;
	font-weight: 400;
	display: flex;
	justify-content: center;
	align-items: center;
	color: ${({ theme }) => theme.colors.buttonTitle};
	background-color: ${({ theme }) => theme.colors.main};
	${({ type }) =>
		type === 'wait' && 'background-color: #F4F4F4; color: #718AFF;'}
	& + & {
		margin-left: 8px;
	}
`;

const SubBadge = styled(Badge)`
	color: ${({ theme }) => theme.colors.buttonTitle};
	background-color: ${({ theme }) => theme.colors.subMain};
`;

const WaitBadge = styled(Badge)`
	color: ${({ theme }) => theme.colors.main};
	background-color: ${({ theme }) => theme.colors.base};
`;

const Title = styled.h3`
	font-weight: 700;
	font-size: 18px;
	height: 40px;
`;

const Teacher = styled.h4`
	font-size: 12px;
	font-weight: 700;
	margin-bottom: 6px;
`;

const TimeTables = styled.div`
	display: flex;
	flex-wrap: wrap;
	height: 50px;
	overflow-y: scroll;
	&::-webkit-scrollbar {
		width: 5px;
	}
	&::-webkit-scrollbar-thumb {
		background-color: ${({ theme }) => theme.colors.scroll};
		border-radius: 10px;
	}
`;

const TimeTable = styled.p<{ type?: 'accepted' | 'wait' | 'teach' }>`
	font-size: 12px;
	width: 105px;
	height: 22px;
	border-radius: 5px;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 6px;
	margin-bottom: 3px;
	background-color: ${({ theme }) => theme.colors.base};
`;

const HomeButton = styled.button`
	width: 41px;
	height: 41px;
	border-radius: 50%;
	background-image: url('/images/home.png');
	${({ theme }) => theme.commons.backgroundImage};
	position: absolute;
	bottom: 23px;
	right: 23px;
	box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
	transition: 0.3s;
	&:hover {
		filter: brightness(110%);
	}
	&:active {
		filter: brightness(90%);
	}
`;

const WaitThumbnail = styled.div`
	background-image: url('/images/wait.png');
	${({ theme }) => theme.commons.backgroundImage};
	width: 255px;
	height: 172px;
	border-radius: 7px;
	top: 16px;
	position: absolute;
	background-color: rgba(0, 0, 0, 0.5);
`;

const WaitButton = styled.button`
	border: none;
	border-radius: 7px;
	width: 92px;
	height: 32px;
	font-size: 12px;
	box-shadow: 0 0.5px 4px rgba(0, 0, 0, 0.25);
	position: absolute;
	bottom: 25px;
	right: 25px;
	color: ${({ theme }) => theme.colors.background};
	background-color: ${({ theme }) => theme.colors.main};
	&:hover {
		background-color: ${({ theme }) => theme.colors.brightMain};
	}
	&:active {
		background-color: ${({ theme }) => theme.colors.darkerMain};
	}
`;
