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
			<TopContainer>
				<p>강의 이름</p>
				<Input type='text' name='title' onChange={onChange} />
			</TopContainer>
			<UpperContainer>
				<UpperLeft>
					<Days>
						<p>시작일</p>
						<InputDay type='date' name='startDate' onChange={onChange} />
					</Days>
					<Days>
						<p>종료일</p>
						<InputDay type='date' name='endDate' onChange={onChange} />
					</Days>
				</UpperLeft>
				<UpperRight>
					<p>사진 추가하기</p>
					<CrossButton />
					<ImageInput type='text' name='imageUrl' onChange={onChange} />
				</UpperRight>
			</UpperContainer>

			<LowerContainer>
				<AddBox>
					<BoxLeft>
						<DayList>
							{selectedDays.map((item: any) => (
								<DayNum key={item.id}>
									{days[item.day - 1]} [{item.startTime}~{item.endTime}]
									<DayButton
										src='/images/closeday.png'
										onClick={() => deleteDay(item.id)}
									/>
								</DayNum>
							))}
						</DayList>
					</BoxLeft>
					<BoxRight>
						<p>요일 선택</p>
						<DayContainer>
							<DayBox>
								{[1, 2, 3, 4, 5, 6, 7].map((day) => (
									<RadioBox key={day}>
										<Radio
											type='radio'
											name='day'
											value={day}
											onChange={onChange}
											id={days[day - 1]}
										/>
										<Label htmlFor={days[day - 1]}>{days[day - 1]}</Label>
									</RadioBox>
								))}
							</DayBox>

							<Button onClick={addDays}>추가</Button>
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
						</InputDays>
					</BoxRight>
				</AddBox>
			</LowerContainer>
			<Footer>
				<AddButton onClick={createClass}>개설하기</AddButton>
			</Footer>
		</Form>
	);
};

export default AddClass;

const Form = styled.form`
	width: 560px;
	height: 600px;
	display: flex;
	flex-direction: column;
	padding: 40px 50px 30px 50px;
	//justify-content: space-between;
`;
const TopContainer = styled.div`
	margin-top: 10px;
`;

const UpperContainer = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
`;
const Days = styled.div`
	margin-right: 10px;
	margin-top: 5px;
`;

const InputDays = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	margin-top: 5px;
`;
const RadioBox = styled.div``;

const Radio = styled.input`
	display: none;
	&:checked + Label {
		color: ${({ theme }) => theme.colors.main};
		font-weight: 600;
	}
`;
const Label = styled.label`
	margin-right: 5px;
`;

const UpperLeft = styled.div`
	width: 240px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
`;

const UpperRight = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	margin-top: 10px;
`;
const ImageInput = styled.input`
	width: 100%;
	height: 100%;
	border: none;
	border-radius: 10px;
	background-color: ${({ theme }) => theme.colors.base};
`;
const CrossButton = styled.div`
	border: none;
	background: none;
	background-image: url('images/crossbutton.png');
	background-repeat: no-repeat;
	background-position: center center;
	background-size: contain;
	width: 20px;
	height: 20px;
	top: 50%;
	left: 43%;
	position: absolute;
	cursor: pointer;
`;

const LowerContainer = styled.div`
	margin-top: 30px;
`;
const BoxRight = styled.div`
	margin-left: 10px;
`;

const BoxLeft = styled.div`
	width: 180px;
	height: 100%;
`;

const DayList = styled.div`
	display: flex;
	height: 100%;
	flex-direction: column;
	overflow: auto;
	&::-webkit-scrollbar {
		width: 5px;
	}
	&::-webkit-scrollbar-thumb {
		border-radius: 10px;
		background-color: ${({ theme }) => theme.colors.scroll};
	}
	&::-webkit-scrollbar-thumb:hover {
		background-color: ${({ theme }) => theme.colors.scrollHover};
	}
`;

const DayNum = styled.li`
	width: 160px;
	height: 30px;
	padding: 3px;
	border-radius: 10px;
	margin: 5px 0;
	text-align: center;
	align-items: center;
	background-color: ${({ theme }) => theme.colors.main};
	color: ${({ theme }) => theme.colors.buttonTitle};
`;

const DayButton = styled.button<{ src: string }>`
	border: none;
	background: none;
	background-image: url(${({ src }) => src});
	background-repeat: no-repeat;
	background-position: center center;
	background-size: contain;
	width: 10px;
	height: 10px;
	margin-left: 5px;
	cursor: pointer;
`;

const AddBox = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	padding: 15px;
	height: 220px;
	background-color: ${({ theme }) => theme.colors.base};
`;

const DayContainer = styled.div`
	display: flex;
	flex-direction: row;
`;

const DayBox = styled.div`
	display: flex;
	padding: 5px;
	width: 160px;
	height: 30px;
	border-radius: 7px;
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
	width: 100%;
	height: 30px;
	border-radius: 7px;
	border: none;
	background-color: ${({ theme }) => theme.colors.base};
	${({ type }) => type === 'time' && 'background-color: #FFF; color: #000;'}
	font-size: 14px;
	padding-left: 20px;
	outline: none;
	margin-top: 5px;
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
