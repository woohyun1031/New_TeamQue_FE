import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

interface CardProps {
	id: number;
	title: string;
	teacher: string;
	imageUrl: string;
	time: string[];
	state: 'wait' | 'accepted' | 'teach';
}

const Card: React.FC<CardProps> = ({
	id,
	imageUrl,
	teacher,
	title,
	time,
	state,
}) => {
	const navigate = useNavigate();
	const toClassRoom = () => {
		navigate(`/classroom/${id}`);
	};
	const toClassHome = () => {
		navigate(`/classhome/${id}/1`);
	};
	if (state == 'wait') {
		return (
			<>
				<Container type={state}>
					<Thumbnail src={imageUrl} />
					<Title>{title}</Title>
					<Teacher>{teacher} 선생님</Teacher>
					{time.map((t) => <TimeTable key={t}>{t}</TimeTable>)}
				</Container>
			</>
		);
	}

	return (
		<Container type={state}>
			<Thumbnail src={imageUrl} onClick={toClassRoom} />
			<BadgeBox>
				<SubBadge>진행중</SubBadge>
				<Badge>방송중</Badge>
			</BadgeBox>
			<Title>{title}</Title>
			<Teacher>{teacher} 선생님</Teacher>
			{time.map((t) => <TimeTable key={t}>{t}</TimeTable>)}
			<HomeButton src='/images/home.png' onClick={toClassHome} />
		</Container>
	);
};

export default Card;

const Container = styled.div<{ type: 'wait' | 'accepted' | 'teach' }>`
	width: 300px;
	height: 380px;
	border-radius: 10px;
	padding: 16px 23px;
	background-color: #fff;
	box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
	position: relative;
	transition: 0.2s;
	& + & {
		margin-left: 20px;
	}
	&:hover {
		background-color: #fcfcfc;
	}
	${({ type }) => type === 'wait' && 'background-color: #F4F4F4; color: black;'}
`;

const Thumbnail = styled.div<{ src: string }>`
	background-image: url(${({ src }) => src});
	background-size: cover;
	background-position: center center;
	width: 255px;
	height: 172px;
	border-radius: 7px;
	margin-bottom: 10px;
	cursor: pointer;
`;

const BadgeBox = styled.div`
	width: 100%;
	height: 18px;
	display: flex;
	margin-bottom: 10px;
`;

const Badge = styled.div<{ type?: 'accepted' | 'wait' | 'teach' }>`
	width: 55px;
	height: 20px;
	background-color: #718aff;
	border-radius: 7px;
	color: #fff;
	font-size: 10px;
	font-weight: 400;
	display: flex;
	justify-content: center;
	align-items: center;
	${({ type }) =>
		type === 'wait' && 'background-color: #F4F4F4; color: #718AFF;'}
	& + & {
		margin-left: 5px;
	}
`;

const SubBadge = styled(Badge)`
	background-color: #bcc8ff;
`;

const Title = styled.h3`
	font-weight: 700;
	font-size: 18px;
	margin-bottom: 15px;
`;

const Teacher = styled.h4`
	font-weight: 700;
`;

const TimeTable = styled.p`
	color: #aaa;
	font-weight: 500;
`;

const HomeButton = styled.button<{ src: string }>`
	width: 41px;
	height: 41px;
	border-radius: 50%;
	border: none;
	background-color: #718AFF;
	background-image: url(${({ src }) => src});
	background-position: center center;
	background-repeat: no-repeat;
	position: absolute;
	bottom: 10px;
	right: 10px;
	cursor: pointer;
	box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
`;
