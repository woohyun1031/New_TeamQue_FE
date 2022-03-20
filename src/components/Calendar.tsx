import { useState } from 'react';
import styled, { css } from 'styled-components';
import getDateArrayOfMonth from '../utils/getDateArray';

const Calendar = () => {
	const today = new Date();
	const nowMonth = today.getMonth();
	const nowYear = today.getFullYear();
	const [month, setMonth] = useState(nowMonth);
	const arr = getDateArrayOfMonth(nowYear, month);
	const setPrevMonth = () => {
		setMonth((prev) => (prev + 11) % 12);
	};
	const setNextMonth = () => {
		setMonth((prev) => (prev + 1) % 12);
	};
	const calendar = [];
	for (let i = 0; i < 6; i++) {
		const week = [];
		for (let j = 0; j < 7; j++) {
			week.push(arr[i * 7 + j]);
		}
		calendar.push(week);
	}

	return (
		<Container>
			<Title>이번 달 한눈에 보기</Title>
			<CalendarBox>
				<Table>
					<Caption>
						<Button onClick={setPrevMonth}>{((month + 11) % 12) + 1}</Button>
						{month + 1}
						<Button onClick={setNextMonth}>{((month + 1) % 12) + 1}</Button>
					</Caption>
					<thead>
						<tr>
							<Th>S</Th>
							<Th>M</Th>
							<Th>T</Th>
							<Th>W</Th>
							<Th>T</Th>
							<Th>F</Th>
							<Th>S</Th>
						</tr>
					</thead>
					<tbody>
						{calendar.map((week, index) => (
							<tr key={index}>
								{week.map((date, index) => (
									<Td month={date.month} isToday={date.isToday} key={index}>
										{date.date}
									</Td>
								))}
							</tr>
						))}
					</tbody>
				</Table>
			</CalendarBox>
		</Container>
	);
};

export default Calendar;

const Container = styled.div`
	/* 사이즈 */
	width: 280px;
	height: 320px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
`;

const Title = styled.h2``;

const CalendarBox = styled.div`
	width: 280px;
	height: 300px;
	background-color: #fff;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 10px;
	box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
	padding: 20px;
`;

const Table = styled.table`
	width: 230px;
	height: 230px;
	font-weight: 500;
	font-size: 12px;
	border-collapse: collapse;
`;

const Caption = styled.caption`
	text-align: center;
	font-size: 30px;
	font-weight: 900;
	color: #5370f5;
	margin-bottom: 10px;
`;

const Button = styled.button`
	padding: 0 15px;
	border: none;
	background: none;
	font-weight: 700;
	font-size: 20px;
	color: #ddd;
`;

const Th = styled.th`
	text-align: center;
	height: 10px;
`;

interface TdProps {
	month: string;
	isToday: boolean;
}

const Td = styled.td<TdProps>`
	${(props) =>
		props.month !== 'this' &&
		css`
			color: #ddd;
		`};
	${(props) =>
		props.isToday &&
		css`
			border-radius: 50%;
			background-color: rgba(113, 138, 255, 0.4);
		`};
	text-align: center;
`;

