import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import api from '../api';
import { RootState } from '../store/configStore';

type dateType = {
	month: 'prev' | 'this' | 'next';
	date: number;
	event?: { title: string; time: string }[];
};

type weekType = dateType[];

type calendarType = weekType[];

const Calendar = () => {
	const { classid } = useParams();
	const isLogin = useSelector((state: RootState) => state.user.isLogin);
	const today = new Date();
	const thisDate = today.getDate();
	const thisMonth = today.getMonth();
	const thisYear = today.getFullYear();
	const [year, setYear] = useState<number>(thisYear);
	const [month, setMonth] = useState<number>(thisMonth);
	const [calendar, setCalendar] = useState<calendarType>();

	const makeCalendar = async () => {
		const thisMonthFirstDay = new Date(year, month, 1).getDay();
		const thisMonthLastDate = new Date(year, month + 1, 0).getDate();
		const lastMonthLastDate = new Date(year, month, 0).getDate();
		const lastMonthStartDate = lastMonthLastDate - thisMonthFirstDay + 1;
		let totalDate = 42;
		const allDate: dateType[] = [];
		for (let i = lastMonthStartDate; i <= lastMonthLastDate; i++) {
			allDate.push({ month: 'prev', date: i });
			totalDate--;
		}
		for (let i = 1; i <= thisMonthLastDate; i++) {
			allDate.push({ month: 'this', date: i });
			totalDate--;
		}
		for (let i = 1; i <= totalDate; i++) {
			allDate.push({ month: 'next', date: i });
		}

		let data;
		if (classid) {
			data = await api.loadClassCalendar(classid, year, month + 1);
		} else {
			data = await api.loadTotalCalendar(year, month + 1);
		}

		for (const event of data) {
			if (allDate[event.day + thisMonthFirstDay - 1].event) {
				allDate[event.day + thisMonthFirstDay - 1].event?.push({
					title: event.title,
					time: `${event.startTime}~${event.endTime}`,
				});
			} else {
				allDate[event.day + thisMonthFirstDay - 1].event = [
					{
						title: event.title,
						time: `${event.startTime}~${event.endTime}`,
					},
				];
			}
		}
		const newCalendar = [];
		for (let i = 0; i < allDate.length; i += 7)
			newCalendar.push(allDate.slice(i, i + 7));

		setCalendar(newCalendar);
	};

	useEffect(() => {
		if (isLogin) {
			makeCalendar();
		}
	}, [month, isLogin]);

	const setPrevMonth = () => {
		let nextMonth = month - 1;
		if (month === 0) {
			nextMonth = 11;
			setYear((state) => state - 1);
		}
		setMonth(nextMonth);
	};

	const setNextMonth = () => {
		let nextMonth = month + 1;
		if (month === 11) {
			nextMonth = 0;
			setYear((state) => state + 1);
		}
		setMonth(nextMonth);
	};

	return (
		<Container>
			<Table>
				<Caption>
					<Button onClick={setPrevMonth}>{((month + 11) % 12) + 1}</Button>
					{month + 1}
					<Button onClick={setNextMonth}>{((month + 1) % 12) + 1}</Button>
				</Caption>
				
				<thead>
					<tr>
						{['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
							<Th key={index}>{day}</Th>
						))}
					</tr>
				</thead>
				<tbody>
					{calendar &&
						calendar.map((week: weekType, index: number) => (
							<tr key={index}>
								{week.map((date: dateType, index: number) => (
									<Td isThisMonth={date.month === 'this'} key={index}>
										{date.date === thisDate &&
										month === thisMonth &&
										year === thisYear &&
										date.month === 'this' ? (
											<>
												<TodayUnderline />
												<DateBox isToday={true}>{date.date}</DateBox>
											</>
										) : (
											<DateBox isToday={false}>{date.date}</DateBox>
										)}

										{date.event && (
											<>
												<EventPointer />
												<EventBox>
													{date.event &&
														date.event.map((event, index) => (
															<p key={index}>
																<Pointer />
																{event.title} {event.time}
															</p>
														))}
												</EventBox>
											</>
										)}
									</Td>
								))}
							</tr>
						))}
				</tbody>
			</Table>
		</Container>
	);
};

export default Calendar;

const Container = styled.div`
	width: 280px;
	height: 300px;
	padding: 20px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 10px;
	box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
	background-color: ${({ theme }) => theme.colors.background};
`;

const Table = styled.table`
	width: 230px;
	height: 210px;
	font-weight: 500;
	font-size: 12px;
	border-collapse: collapse;
	color: ${({ theme }) => theme.colors.title};
	& tr td:nth-child(1),
	& tr th:nth-child(1) {
		color: ${({ theme }) => theme.colors.reject};
	}
	& tr td:nth-child(7),
	& tr th:nth-child(7) {
		color: ${({ theme }) => theme.colors.main};
	}
`;

const Caption = styled.caption`
	text-align: center;
	font-size: 30px;
	font-weight: 900;
	color: ${({ theme }) => theme.colors.main};
	margin-bottom: 10px;
`;

const Button = styled.button`
	padding: 0 15px;
	font-weight: 700;
	font-size: 20px;
	color: ${({ theme }) => theme.colors.base};
	transition: 0.2s;
	&:hover {
		filter: brightness(102%);
	}
	&:active {
		filter: brightness(98%);
	}
`;

const Th = styled.th`
	text-align: center;
	height: 10px;
`;

const EventBox = styled.div`
	padding: 5px 10px;
	position: absolute;
	top: 20px;
	left: 20px;
	border-radius: 7px;
	box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
	z-index: 100;
	font-weight: bold;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	display: none;
	white-space: nowrap;
	color: ${({ theme }) => theme.colors.buttonTitle};
	background-color: ${({ theme }) => theme.colors.pointer};
	&:hover {
		display: flex;
	}
`;

const Td = styled.td<{ isThisMonth: boolean }>`
	position: relative;
	text-align: center;
	color: ${({ isThisMonth }) => !isThisMonth && '#ccc !important;'};
`;

const DateBox = styled.div<{ isToday: boolean }>`
	${({ isToday }) => isToday && 'font-weight: 900;'}
	&:hover ~ ${EventBox} {
		display: flex;
	}
`;

const TodayUnderline = styled.div`
	width: 17px;
	height: 2px;
	position: absolute;
	bottom: 6px;
	left: 50%;
	transform: translate(-50%, -50%);
	${({ theme }) => theme.commons.mainButton};
`;

const EventPointer = styled.div`
	width: 4px;
	height: 4px;
	border-radius: 2px;
	position: absolute;
	top: 10px;
	right: 5px;
	${({ theme }) => theme.commons.mainButton};
`;

const Pointer = styled.span`
	display: inline-block;
	width: 4px;
	height: 4px;
	border-radius: 2px;
	margin-right: 5px;
	position: relative;
	top: -2px;
	${({ theme }) => theme.commons.mainButton};
`;
