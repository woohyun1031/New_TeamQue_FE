import { useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import Calendar from '../components/Calendar';
import CardList from '../components/main/CardList';
import Schedule from '../components/main/Todo';
import Welcome from '../components/main/Welcome';
import { openModal } from '../store/modules/modal';

const Main = () => {
	const dispatch = useDispatch();
	const [tabState, setTabState] = useState(true);

	const openAddLearnClassModal = () => {
		dispatch(openModal('registClass'));
	};

	const openAddTeachClassModal = () => {
		dispatch(openModal('addClass'));
	};

	const tabLearn = () => {
		setTabState(true);
	};

	const tabTeach = () => {
		setTabState(false);
	};

	return (
		<>
			<UpperContainer>
				<Welcome />
				<Schedule />
				<CalendarBox>
					<SubTitle>일정</SubTitle>
					<Calendar />
				</CalendarBox>
			</UpperContainer>
			<LowerContainer>
				<CardBox>
					<TabButtons>
						<TabButton onClick={tabLearn} isSelected={tabState}>
							배우고 있어요
						</TabButton>
						<TabButton onClick={tabTeach} isSelected={!tabState}>
							알려주고 있어요
						</TabButton>
					</TabButtons>
					<CardList tabState={tabState} />
				</CardBox>
				{tabState ? (
					<AddCardBox onClick={openAddLearnClassModal}>
						<h1>+</h1>
						<p>새로운 강의 참가하기</p>
					</AddCardBox>
				) : (
					<AddCardBox onClick={openAddTeachClassModal}>
						<h1>+</h1>
						<p>새로운 강의 개설하기</p>
					</AddCardBox>
				)}
			</LowerContainer>
		</>
	);
};

export default Main;

const UpperContainer = styled.div`
	width: 1200px;
	height: 320px;
	margin: 50px auto 80px;
	display: flex;
	justify-content: space-between;
	align-items: flex-end;
`;

const LowerContainer = styled.div`
	width: 1200px;
	height: 450px;
	margin: 0 auto;
	display: flex;
	align-items: flex-end;
	justify-content: space-between;
`;

const CardBox = styled.div``;

const TabButtons = styled.div`
	width: 360px;
	height: 40px;
	margin-bottom: 15px;
	display: flex;
	justify-content: space-between;
`;

const TabButton = styled.button<{ isSelected: boolean }>`
	font-size: 27px;
	font-weight: 700;
	transition: 0.2s;
	cursor: default;
	${(props) => !props.isSelected && 'color: #c4c4c4; cursor: pointer;'}
	&:hover {
		filter: brightness(110%);
	}
	&:active {
		filter: brightness(90%);
	}
`;

const AddCardBox = styled.button`
	width: 300px;
	height: 435px;
	border-radius: 10px;
	box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	transition: 0.3s;
	position: relative;
	font-size: 18px;
	color: ${({ theme }) => theme.colors.main};
	background-color: ${({ theme }) => theme.colors.background};
	& h1 {
		font-size: 50px;
		font-weight: 300;
		margin-bottom: 20px;
	}
	&:hover {
		filter: brightness(97%);
	}
	&:active {
		filter: brightness(93%);
	}
`;

const CalendarBox = styled.div`
	width: 280px;
	height: 320px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
`;

const SubTitle = styled.h2`
	font-size: 20px;
	margin-bottom: 10px;
`;
