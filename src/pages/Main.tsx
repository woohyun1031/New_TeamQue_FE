import { useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import Calendar from '../components/Calendar';
import CardList from '../components/main/CardList';
import Schedule from '../components/main/Todo';
import Welcome from '../components/main/Welcome';
import { changeModal, openModal } from '../store/modules/modal';

const Main = () => {
	const dispatch = useDispatch();
	const openAddClassModal = () => {
		dispatch(openModal());
		dispatch(changeModal('addClass'));
	};
	const [tabState, setTabState] = useState(true);
	const tabLearn = () => {
		setTabState(true);
	};
	const tabTeach = () => {
		setTabState(false);
	};

	return (
		<>
			<UpperContainer>
				<Welcome message='반갑습니다 que!입니다' />
				<Schedule />
				<CalendarBox>
					<SubTitle>이번 달 한눈에 보기</SubTitle>
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
				<AddCardBox onClick={openAddClassModal}>
					<h1>+</h1>
					<p>강의 개설하기</p>
					<Arm src='/images/arm2.png' />
					<Character src='/images/character2.png' alt='' />
				</AddCardBox>
			</LowerContainer>
		</>
	);
};

export default Main;

// 사이즈 전체적으로 재조정 될 예정

const UpperContainer = styled.div`
	/* 사이즈 */
	width: 1200px;
	height: 320px;
	/* 레이아웃 */
	/* margin-top 임시 설정 */
	margin: 100px auto 80px;
	display: flex;
	justify-content: space-between;
	align-items: flex-end;
`;

const LowerContainer = styled.div`
	/* 사이즈 */
	width: 1200px;
	height: 450px;
	/* 레이아웃 */
	/* 상하 마진 임시 설정 */
	margin: 0 auto;
	display: flex;
	align-items: flex-end;
	justify-content: space-between;
`;

const CardBox = styled.div``;

const TabButtons = styled.div`
	/* 사이즈 */
	width: 360px;
	height: 40px;
	/* 레이아웃 */
	/* 상하 마진 임시 설정 */
	margin-bottom: 15px;
	display: flex;
	justify-content: space-between;
`;

interface TabButtonProps {
	isSelected: boolean;
}

const TabButton = styled.button<TabButtonProps>`
	background: none;
	border: none;
	font-size: 27px;
	font-weight: 700;
	transition: 0.1s;
	${(props) => !props.isSelected && 'color: #c4c4c4;'}
`;

const AddCardBox = styled.div`
	/* 사이즈 */
	width: 300px;
	height: 435px;
	/* 임시 스타일 코드 */
	background-color: #fff;
	border-radius: 10px;
	box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
	color: #718aff;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	transition: 0.1s;
	cursor: pointer;
	position: relative;
	& h1 {
		font-size: 30px;
		font-weight: 300;
		margin-bottom: 20px;
	}
	&:hover {
		background-color: #fdfdfd;
	}
`;

const CalendarBox = styled.div`
	/* 사이즈 */
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

const Arm = styled.img`
	position: absolute;
	right: -15px;
	bottom: 60px;
`;

const Character = styled.img`
	position: absolute;
	z-index: -1;
	right: -200px;
	bottom: 0px;
`