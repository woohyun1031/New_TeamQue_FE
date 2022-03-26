const getDateArrayOfMonth = (
	year: number,
	month: number
): { date: number; month: string; isToday: boolean }[] => {
	let totalDay = 42;
	const thisMonthFirstDay = new Date(year, month, 1).getDay();
	const thisMonthLastDate = new Date(year, month + 1, 0).getDate();
	const lastMonthLastDate = new Date(year, month, 0).getDate();
	const days = [];
	totalDay -= thisMonthFirstDay + thisMonthLastDate;
	for (
		let i = lastMonthLastDate - thisMonthFirstDay + 1;
		i <= lastMonthLastDate;
		i++
	) {
		days.push({ date: i, month: 'prev', isToday: false });
	}
	for (let i = 1; i <= thisMonthLastDate; i++) {
		days.push({ date: i, month: 'this', isToday: false });
	}
	for (let i = 1; i <= totalDay; i++) {
		days.push({ date: i, month: 'next', isToday: false });
	}
	if (month === new Date().getMonth()) {
		const toDate = new Date().getDate();
		days[toDate + thisMonthFirstDay].isToday = true;
	}
	
	return days;
};

export default getDateArrayOfMonth;
