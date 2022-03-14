const getDateArrayOfMonth = (
	year: number,
	month: number
): { date: number; month: string }[] => {
	let totalDay = 42;
	const thisMonthFirstDay = new Date(year, month, 1).getDay();
	const thisMonthLastDate = new Date(year, month + 1, 0).getDate();
	const prevMonthLastDate = new Date(year, month, 0).getDate();
	const days = [];
	totalDay -= thisMonthFirstDay + thisMonthLastDate;
	for (
		let i = prevMonthLastDate - thisMonthFirstDay + 1;
		i <= prevMonthLastDate;
		i++
	) {
		days.push({ date: i, month: 'prev' });
	}
	for (let i = 1; i <= thisMonthLastDate; i++) {
		days.push({ date: i, month: 'this' });
	}
	for (let i = 1; i <= totalDay; i++) {
		days.push({ date: i, month: 'next' });
	}
	return days;
};

export default getDateArrayOfMonth;
