import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../../store/configStore';
import {
	addTodo,
	deleteTodo,
	loadTodos,
	toggleComplete,
} from '../../store/modules/todo';

const Todo = () => {
	const dispatch = useDispatch();
	const todos = useSelector((state: RootState) => state.todo);
	useEffect(() => {
		dispatch(loadTodos());
	}, []);
	const add = () => {
		dispatch(addTodo('할일!'));
	};
	return (
		<Container>
			<Title>해야 할 일</Title>
			<ScheduleBox>
				{todos.map(
					(todo: { id: string; content: string; isComplete: boolean }) => (
						<TodoItem key={todo.id} {...todo} />
					)
				)}
				<button onClick={add}>add</button>
			</ScheduleBox>
		</Container>
	);
};

export default Todo;

interface TodoItemProps {
	id: string;
	content: string;
	isComplete: boolean;
}

const TodoItem: React.FC<TodoItemProps> = ({ id, content, isComplete }) => {
	const dispatch = useDispatch();
	const deleteto = async () => {
		dispatch(deleteTodo(id));
	};
	const toggle = async () => {
		dispatch(toggleComplete(id));
	};
	return (
		<>
			<h1>id: {id}</h1>
			<h1>내용 : {content}</h1>
			{isComplete ? '완료' : '실패'}
			<button onClick={toggle}>완료</button>
			<button onClick={deleteto}>삭제</button>
		</>
	);
};

const Container = styled.div`
	/* 사이즈 */
	width: 270px;
	height: 320px;
`;

const Title = styled.h2`
	font-size: 20px;
	margin-bottom: 10px;
`;

const ScheduleBox = styled.ul`
	/* 사이즈 */
	width: 285px;
	height: 285px;
	overflow-y: scroll;
	&::-webkit-scrollbar {
		width: 5px; /*스크롤바의 너비*/
	}
	&::-webkit-scrollbar-thumb {
		background-color: #ccc; /*스크롤바의 색상*/
		border-radius: 10px;
	}
	&::-webkit-scrollbar-track {
		/*   background-color: yellow; /*스크롤바 트랙 색상*/
	}
`;

const ScheduleItem = styled.li`
	/* 사이즈 */
	width: 270px;
	height: 80px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 7px;
	background-color: #718aff;
	margin-bottom: 23px;
	color: #fff;
	padding: 20px;
	box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
`;
