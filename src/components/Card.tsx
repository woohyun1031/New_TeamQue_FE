import styled from 'styled-components';

const Card = () => {
	return (
		<Container>
			<Thumbnail src='data:image/jpeg;base64,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' />
			<BadgeBox>
				<Badge>진행중</Badge>
				<Badge>방송중</Badge>
			</BadgeBox>
			<Title>당신도 할 수 있다! C++ 포인터</Title>
			<Teacher>김선생 님</Teacher>
			<TimeTable>화 20:00 / 목 20:00</TimeTable>
			<HomeButton>♡</HomeButton>
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
	& + & {
		margin-left: 20px;
	}
`;

const Thumbnail = styled.img`
	width: 255px;
	height: 172px;
	border-radius: 7px;
	margin-bottom: 10px;
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
const HomeButton = styled.button`
	position: absolute;
	bottom: 10px;
	right: 10px;
`;
