import styled from 'styled-components';
import Calendar from '../components/Calendar';
import Schedule from '../components/Schedule';
import Welcome from '../components/Welcome';

const Main = () => {
	return (
		<>
			<UpperContainer>
				<Welcome name='김학생' verse='명언 혹은 자신을 위한 다짐[한마디 등]' />
				<Schedule />
				<Calendar />
			</UpperContainer>
			<LowerContainer>
				<CardBox>
					<TabButtons />
					<CardList />
				</CardBox>
				<AddCardBox />
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
	justify-content: space-between;
`;

const CardBox = styled.div`

`;

const TabButtons = styled.div`
	/* 사이즈 */
	width: 400px;
	height: 40px;
	/* 레이아웃 */
	/* 상하 마진 임시 설정 */
	margin-bottom: 15px;
	display: flex;
	/* 임시 스타일 코드 */
	background-color: #ccc;
`;

const CardList = styled.div`
	/* 사이즈 */
	width: 850px;
	height: 380px;
	/* 임시 스타일 코드 */
	background-color: #ccc;
`;

const AddCardBox = styled.div`
	/* 사이즈 */
	width: 300px;
	height: 435px;
	/* 임시 스타일 코드 */
	background-color: #ccc;
`;