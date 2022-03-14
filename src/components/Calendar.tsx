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
		<>
			<table>
				<caption>
					<button onClick={setPrevMonth}>이전달</button>
					{month + 1}월 <button onClick={setNextMonth}>다음달</button>
				</caption>

				<thead>
					<tr>
						<th>S</th>
						<th>M</th>
						<th>T</th>
						<th>W</th>
						<th>T</th>
						<th>F</th>
						<th>S</th>
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
			</table>
		</>
	);
};

export default Calendar;

interface DateProps {
	month: string;
	isToday: boolean;
}

const Td = styled.td<DateProps>`
	${(props) => props.month !== 'this' && 'color: #aaa'}
	${(props) => props.isToday && 'border: 1px solid red; border-radius: 50%'}
`;
