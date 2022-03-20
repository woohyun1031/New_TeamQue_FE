import styled from 'styled-components';
import apis from '../api';
import Calendar from '../components/Calendar';
import CardList from '../components/main/CardList';
import Schedule from '../components/main/Todo';
import Welcome from '../components/main/Welcome';

const Main = () => {

	return (
		<>
			<UpperContainer>
				<Welcome message='무궁화꽃이피었습니다무궁화꽃이피었습니다무궁화꽃이피었습니다무궁화꽃이피' />
				<Schedule />
				<Calendar />
			</UpperContainer>
			<LowerContainer>
				<CardBox>
					<TabButtons>
						<TabButton>배우고 있어요</TabButton>
						<TabButton>알려주고 있어요</TabButton>
					</TabButtons>
					<CardList />
				</CardBox>
				<AddCardBox>
					<h1>+</h1>
					<p>강의 개설하기</p>
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

const TabButton = styled.button`
	background: none;
	border: none;
	font-size: 27px;
	font-weight: 700;
	&:nth-child(2) {
		color: #c4c4c4;
	}
`;

const AddCardBox = styled.div`
	/* 사이즈 */
	width: 300px;
	height: 435px;
	/* 임시 스타일 코드 */
	background-color: #fff;
	border-radius: 10px;
	box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
	color: #718AFF;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	transition: .1s;
	cursor: pointer;
	& h1 {
		font-size: 30px;
		font-weight: 300;
		margin-bottom: 20px;
	}
	&:hover {
		transform: scale(1.05);
	}
`;