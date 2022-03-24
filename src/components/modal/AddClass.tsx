import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import apis from '../../api';
import ModalCloseButton from './ModalCloseButton';

const AddClass = () => {
	const [selectedDays, setSelectedDays] = useState<any>([]);
	const [inputs, setInputs] = useState({
		title: '',
		imageUrl: '',
		startDate: '',
		endDate: '',
		day: '',
		startTime: '',
		endTime: '',
	});

	const count = useRef(0);

	const days = ['월', '화', '수', '목', '금', '토', '일'];

	const onChange = (e: any) => {
		const { name, value } = e.target;
		setInputs({ ...inputs, [name]: value });
		console.log(name, value);
		console.log(inputs);
	};

	const addDays = (e: any) => {
		e.preventDefault();
		const newArr = [
			...selectedDays,
			{
				id: count.current,
				day: parseInt(inputs.day),
				startTime: inputs.startTime,
				endTime: inputs.endTime,
			},
		];
		count.current += 1;
		// 요일, 시간에 따라 정렬
		newArr.sort((a, b) => (a.day > b.day ? 1 : -1));
		setSelectedDays(newArr);
	};

	const deleteDay = (id: number) => {
		setSelectedDays(selectedDays.filter((day: any) => day.id !== id));
	};

	useEffect(() => {
		console.log(selectedDays);
	}, [selectedDays]);

	const createClass = async(e: any) => {
		e.preventDefault()
		const classInfo = {
			title: inputs.title,
			imageUrl: inputs.imageUrl,
			startDate: inputs.startDate,
			endDate: inputs.endDate,
			times: [...selectedDays]
		}
		console.log(classInfo)
		await apis.createClass(classInfo)
	}

	return (
		<Form>
			<ModalCloseButton />
			<h1>클래스 이름</h1>
			<input type='text' name='title' onChange={onChange} />
			<h1>썸네일 URL</h1>
			<input type='text' name='imageUrl' onChange={onChange} />
			<h1>시작일</h1>
			<input type='date' name='startDate' onChange={onChange} />
			<h1>종료일</h1>
			<input type='date' name='endDate' onChange={onChange} />
			<h1>시간 추가</h1>
			<div>
				{[1, 2, 3, 4, 5, 6, 7].map((day) => (
					<label key={day}>
						{days[day - 1]}
						<input type='radio' name='day' value={day} onChange={onChange} />
					</label>
				))}
			</div>
			<input type='time' name='startTime' onChange={onChange} />
			<input type='time' name='endTime' onChange={onChange} />
			<button onClick={addDays}>요일 추가</button>
			{selectedDays.map((item: any) => (
				<li key={item.id}>
					{days[item.day - 1]} {item.startTime}~{item.endTime}
					<button onClick={() => deleteDay(item.id)}>삭제</button>
				</li>
			))}
			<button onClick={createClass}>강의 추가</button>
		</Form>
	);
};

export default AddClass;

const Form = styled.form`
	width: 500px;
	display: flex;
	flex-direction: column;
	padding: 50px;
`;
