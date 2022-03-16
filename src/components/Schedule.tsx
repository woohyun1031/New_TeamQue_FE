import styled from 'styled-components';

const Schedule = () => {
	return (
		<Container>
			<Title>이번 주 스케쥴</Title>
			<ScheduleBox>
				<ScheduleItem>C++ 포인터 수업 2주차 과제</ScheduleItem>
				<ScheduleItem>
					C++ 포인터 수업 3주차 과제 완료 하고 인증샷 남기기
				</ScheduleItem>
				<ScheduleItem>+</ScheduleItem>
			</ScheduleBox>
		</Container>
	);
};

export default Schedule;

const Container = styled.div`
	/* 사이즈 */
	width: 270px;
	height: 320px;
`;

const Title = styled.h2`
	font-size: 20px;
	margin-bottom: 10px;
`;

const ScheduleBox = styled.ul`
	/* 사이즈 */
	width: 270px;
	height: 285px;
`;

const ScheduleItem = styled.li`
	/* 사이즈 */
	width: 270px;
	height: 80px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 7px;
	background-color: #718aff;
	margin-bottom: 23px;
	color: #fff;
	padding: 20px;
	&:nth-child(2) {
		text-decoration: line-through;
		background-color: #fff;
		color: #d2d2d2;
	}
	&:nth-child(3) {
		background-color: #fff;
		color: #718aff;
	}
	box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
`;
