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

	const createClass = async (e: any) => {
		e.preventDefault();
		const classInfo = {
			title: inputs.title,
			imageUrl: inputs.imageUrl,
			startDate: inputs.startDate,
			endDate: inputs.endDate,
			times: [...selectedDays],
		};
		console.log(classInfo);
		await apis.createClass(classInfo);
	};

	return (
		<Form>
			<ModalCloseButton />
			<h2>클래스 개설하기</h2>
			<UpperContainer>
				<UpperLeft>
					<p>강의 이름</p>
					<Input type='text' name='title' onChange={onChange} />
					<InputDays>
						<Days>
							<p>시작일</p>
							<InputDay type='date' name='startDate' onChange={onChange} />
						</Days>
						<Days>
							<p>종료일</p>
							<InputDay type='date' name='endDate' onChange={onChange} />
						</Days>
					</InputDays>
				</UpperLeft>
				{/* <UpperRight>
					<p>사진 추가하기</p>
					<Input type='text' name='imageUrl' onChange={onChange} />
				</UpperRight> */}
			</UpperContainer>

			<LowerContainer>
				<DayList>
					{selectedDays.map((item: any) => (
						<DayNum key={item.id}>
							{days[item.day - 1]} [{item.startTime}~{item.endTime}]
							<DayButton
								src='/images/bigCloseButton.png'
								onClick={() => deleteDay(item.id)}
							/>
						</DayNum>
					))}
				</DayList>
				<AddBox>
					<DayContainer>
						요일 선택
						<DayBox>
							{[1, 2, 3, 4, 5, 6, 7].map((day) => (
								<label key={day}>
									{days[day - 1]}
									<input
										type='radio'
										name='day'
										value={day}
										onChange={onChange}
									/>
								</label>
							))}
						</DayBox>
					</DayContainer>
					<InputDays>
						<Days>
							<p>시작 시간</p>
							<InputDay type='time' name='startTime' onChange={onChange} />
						</Days>
						<Days>
							<p>종료 시간</p>
							<InputDay type='time' name='endTime' onChange={onChange} />
						</Days>
						<Days>
							<p style={{ visibility: 'hidden' }}>추가 버튼</p>
							<Button onClick={addDays}>추가</Button>
						</Days>
					</InputDays>
				</AddBox>
			</LowerContainer>
			<Footer>
				<AddButton onClick={createClass}>강의 추가</AddButton>
			</Footer>
		</Form>
	);
};

export default AddClass;

const Form = styled.form`
	width: 500px;
	height: 600px;
	display: flex;
	flex-direction: column;
	padding: 50px;
	justify-content: space-between;
`;

const UpperContainer = styled.div`
	display: flex;
	flex-direction: row;
`;
const Days = styled.div`
	margin-right: 10px;
`;

const InputDays = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	margin-top: 10px;
`;

const UpperLeft = styled.div`
	width: 250px;
`;

const LowerContainer = styled.div`
	margin-top: 20px;
`;

const DayList = styled.div`
	height: 50px;
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	overflow-y: auto;
`;

const DayNum = styled.li`
	width: 170px;
	height: 30px;
	padding: 5px;
	border-radius: 10px;
	margin: 5px;
	text-align: center;
	align-items: center;
	background-color: ${({ theme }) => theme.colors.main};
	color: ${({ theme }) => theme.colors.buttonTitle};
`;

const AddBox = styled.div`
	padding: 30px;
	background-color: ${({ theme }) => theme.colors.base};
`;
const DayContainer = styled.div`
	display: flex;
	flex-direction: row;
`;

const DayBox = styled.div`
	display: flex;
	padding: 5px;
	width: 250px;
	height: 30px;
	margin-left: 20px;
	border-radius: 20px;
	align-items: center;
	justify-content: center;
	background-color: ${({ theme }) => theme.colors.background};
`;

const Input = styled.input`
	width: 100%;
	height: 30px;
	border-radius: 7px;
	border: none;
	background-color: ${({ theme }) => theme.colors.base};
	font-size: 14px;
	padding-left: 20px;
	outline: none;
`;

const InputDay = styled.input<{ type?: 'time' | 'date' }>`
	width: 100px;
	height: 30px;
	border-radius: 7px;
	border: none;
	background-color: ${({ theme }) => theme.colors.base};
	${({ type }) => type === 'time' && 'background-color: #FFF; color: #000;'}
	font-size: 14px;
	padding-left: 20px;
	outline: none;
`;

const Footer = styled.div`
	margin-top: 20px;
	display: flex;
	justify-content: flex-end;
`;

const Button = styled.button`
	width: 70px;
	height: 30px;
	border-radius: 7px;
	border: none;
	background-color: ${({ theme }) => theme.colors.main};
	color: ${({ theme }) => theme.colors.buttonTitle};
	font-size: 12px;
	font-weight: 600;
	margin: 0 10px;
	cursor: pointer;
	&:hover {
		cursor: pointer;
		background-color: ${({ theme }) => theme.colors.brightMain};
	}
	&:active {
		background-color: ${({ theme }) => theme.colors.darkerMain};
	}
`;

const DayButton = styled.button<{ src: string }>`
	border: none;
	background: none;
	background-image: url(${({ src }) => src});
	background-repeat: no-repeat;
	background-position: center center;
	width: 13px;
	height: 13px;
	margin-left: 10px;
	cursor: pointer;
`;

const AddButton = styled(Button)`
	width: 165px;
	height: 35px;
	&:hover {
		cursor: pointer;
		background-color: ${({ theme }) => theme.colors.brightMain};
	}
	&:active {
		background-color: ${({ theme }) => theme.colors.darkerMain};
	}
`;
