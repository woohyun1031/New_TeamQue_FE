import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import home from '../../assets/homeOutline.png';

interface CardProps {
	id: string;
	imageUrl: string;
	teacher: string;
	title: string;
}

const Card:React.FC<CardProps> = ({id, imageUrl, teacher, title }) => {
	const navigate = useNavigate();
	const toClassRoom = () => {
		navigate(`/classroom/${id}`);
	};
	const toClassHome = () => {
		navigate(`/classhome/${id}`);
	};
	return (
		<Container>
			<Thumbnail
				src={imageUrl}
				onClick={toClassRoom}
			/>
			<BadgeBox>
				<Badge>진행중</Badge>
				<Badge>방송중</Badge>
			</BadgeBox>
			<Title>{title}</Title>
			<Teacher>{teacher} 님</Teacher>
			<TimeTable>화 20:00 / 목 20:00</TimeTable>
			<HomeButton src={home} onClick={toClassHome} />
		</Container>
	);
};

export default Card;

const Container = styled.div`
	display: inline-block;
	width: 300px;
	height: 380px;
	border-radius: 10px;
	padding: 16px 23px;
	background-color: #fff;
	box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
	position: relative;
	transition: 0.2s;
	& + & {
		margin-left: 20px;
	}
	&:hover {
		transform: scale(1.025);
	}
`;

const Thumbnail = styled.img`
	width: 255px;
	height: 172px;
	border-radius: 7px;
	margin-bottom: 10px;
	cursor: pointer;
`;

const BadgeBox = styled.div`
	width: 112px;
	height: 18px;
	display: flex;
	justify-content: space-between;
	margin-bottom: 10px;
`;

const Badge = styled.div`
	width: 52px;
	height: 18px;
	background-color: #718aff;
	border-radius: 7px;
	color: #fff;
	font-size: 10px;
	font-weight: 400;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const Title = styled.h3`
	font-weight: 900;
	font-size: 18px;
	margin-bottom: 15px;
`;

const Teacher = styled.h4`
	margin-bottom: 7px;
`;

const TimeTable = styled.p`
	color: #aaa;
	font-weight: 500;
`;

interface HomeButtonProps {
	src: string;
}

const HomeButton = styled.img<HomeButtonProps>`
	position: absolute;
	bottom: 10px;
	right: 10px;
	cursor: pointer;
`;
