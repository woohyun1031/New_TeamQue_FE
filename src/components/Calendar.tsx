import { useState } from 'react';
import styled from 'styled-components';
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

	return (
		<Container>
			<h2>이번 달 한눈에 보기</h2>
			<CalendarBox>
				<Table>
					<Caption>
						<Button onClick={setPrevMonth}>&lt;</Button>
						{month + 1}
						<Button onClick={setNextMonth}>&gt;</Button>
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
						<tr>
							{arr.slice(0, 7).map((date) => (
								<Td month={date.month} isToday={date.isToday}>
									{date.date}
								</Td>
							))}
						</tr>
						<tr>
							{arr.slice(7, 14).map((date) => (
								<Td month={date.month} isToday={date.isToday}>
									{date.date}
								</Td>
							))}
						</tr>
						<tr>
							{arr.slice(14, 21).map((date) => (
								<Td month={date.month} isToday={date.isToday}>
									{date.date}
								</Td>
							))}
						</tr>
						<tr>
							{arr.slice(21, 28).map((date) => (
								<Td month={date.month} isToday={date.isToday}>
									{date.date}
								</Td>
							))}
						</tr>
						<tr>
							{arr.slice(28, 35).map((date) => (
								<Td month={date.month} isToday={date.isToday}>
									{date.date}
								</Td>
							))}
						</tr>
						<tr>
							{arr.slice(35, 42).map((date) => (
								<Td month={date.month} isToday={date.isToday}>
									{date.date}
								</Td>
							))}
						</tr>
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

const CalendarBox = styled.div`
	width: 280px;
	height: 290px;
	background-color: #fff;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 10px;
	box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
`;

const Table = styled.table`
	width: 215px;
	height: 230px;
	font-weight: 500;
	font-size: 12px;
`;

const Caption = styled.caption`
	text-align: left;
	font-size: 30px;
	font-weight: 900;
	color: #5370f5;
`;

const Button = styled.button`
	border: none;
	background: none;
	font-weight: 700;
`;

const Th = styled.th`
	text-align: left;
`;

interface TdProps {
	month: string;
	isToday: boolean;
}

const Td = styled.td<TdProps>`
	${(props) => props.month !== 'this' && 'color: #aaa'}
	${(props) => props.isToday && 'border: 1px solid red; border-radius: 20px'}
`;

