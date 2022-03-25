import { useEffect, useMemo, useState } from 'react';
import styled, { css } from 'styled-components';
import getDateArrayOfMonth from '../utils/getDateArray';

const Calendar = () => {
	const today = new Date();
	const nowMonth = today.getMonth();
	const nowYear = today.getFullYear();
	const [month, setMonth] = useState(nowMonth);
	const [calendar, setCalendar] = useState<any>()
	const arr = useMemo(() => getDateArrayOfMonth(nowYear, month), [month]);
	const makeCalendar = () => {
		const arr = getDateArrayOfMonth(nowYear, month)
		const calendarData: any = [];
		for (let i = 0; i < 6; i++) {
			const week: any = [];
			for (let j = 0; j < 7; j++) {
				week.push(arr[i * 7 + j]);
			}
			calendarData.push(week);
		}
		setCalendar(calendarData)
	}
	useEffect(()=> {
		makeCalendar()
	}, [month])
	const setPrevMonth = () => {
		setMonth((prev) => (prev + 11) % 12);
	};
	const setNextMonth = () => {
		setMonth((prev) => (prev + 1) % 12);
	};

	return (
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
						{calendar && calendar.map((week: any, index: number) => (
							<tr key={index}>
								{week.map((date: any, index: number) => (
									<Td month={date.month} isToday={date.isToday} key={index}>
										{date.date}
									</Td>
								))}
							</tr>
						))}
					</tbody>
				</Table>
			</CalendarBox>
	);
};

export default Calendar;

const CalendarBox = styled.div`
	width: 280px;
	height: 300px;
	background-color: #fff;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 10px;
	box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
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
	cursor: pointer;
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

