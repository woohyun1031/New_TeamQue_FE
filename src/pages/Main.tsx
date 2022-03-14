import { useState } from 'react';
import styled from 'styled-components';
import Calendar from '../components/Calendar';

const Main = () => {
	const [is, setIs] = useState(true);
	const changeStudent = () => {
		setIs(true);
	};
	const changeTeacher = () => {
		setIs(false);
	};
	return (
		<Container>
			<Tab>
				<TabMenu>
					<TabButton selected={is} onClick={changeStudent}>
						듣는 수업
					</TabButton>
					<TabButton selected={!is} onClick={changeTeacher}>
						만든 수업
					</TabButton>
				</TabMenu>
				<TabItem>
					{is ? (
						<div className='student'>student</div>
					) : (
						<div className='teacher'>teacher</div>
					)}
				</TabItem>
			</Tab>
			<div className='right'>
				<h1>프로필</h1>
				<Calendar />
			</div>
		</Container>
	);
};

export default Main;

const Container = styled.div`
	display: flex;
`;
const Tab = styled.div`
	border: 1px solid black;
`;

const TabMenu = styled.div``;

interface TabButtonProps {
	selected: boolean;
}

const TabButton = styled.button<TabButtonProps>`
	background: none;
	border: none;
	cursor: pointer;
	padding: 5px 15px;
	margin-right: 30px;
	background-color: ${(props) => (props.selected ? 'aliceblue' : '#ccc')};
`;

const TabItem = styled.div`
	width: 500px;
	height: 500px;
	background-color: aliceblue;
`;
