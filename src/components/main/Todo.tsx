import { ChangeEvent, KeyboardEvent, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import api from '../../api';
import { RootState } from '../../store/configStore';
import TodoItem from './TodoItem';

const Todo = () => {
	const queryClient = useQueryClient();
	const [isInput, setIsInput] = useState(false);
	const [input, setInput] = useState('');
	const isLogin = useSelector((state: RootState) => state.user.isLogin)

	const { data: todos } = useQuery('todo', api.loadTodo, {
		enabled: isLogin,
	});

	const { mutate: addTodo } = useMutation(() => api.addTodo(input), {
		onSuccess: () => {
			queryClient.invalidateQueries('todo');
		},
	});

	const openInput = () => {
		setIsInput(true);
	};

	const focusOut = () => {
		setIsInput(false);
	};

	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		setInput(e.target.value);
	};

	const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			addTodo();
			setInput('');
			setIsInput(false);
		}
	};

	return (
		<Container>
			<Title>메모</Title>
			<ScheduleBox>
				{todos?.map((todo) => (
					<TodoItem {...todo} key={todo.id} />
				))}
				{isInput ? <InputBox type='text' autoFocus onBlur={focusOut} onChange={onChange} onKeyPress={handleKeyPress} /> : <AddButton onClick={openInput}>+</AddButton>}
			</ScheduleBox>
		</Container>
	);
};

export default Todo;

const Container = styled.div`
	width: 280px;
	height: 320px;
`;

const Title = styled.h2`
	font-size: 20px;
	color: ${({ theme }) => theme.colors.title};
	margin-bottom: 10px;
`;

const ScheduleBox = styled.ul`
	width: 280px;
	height: 300px;
	overflow-y: scroll;
	&::-webkit-scrollbar {
		width: 5px;
	}
	&::-webkit-scrollbar-thumb {
		background-color: ${({ theme }) => theme.colors.scroll};
		border-radius: 10px;
	}
`;

const AddButton = styled.button`
	width: 270px;
	height: 80px;
	display: block;
	border-radius: 7px;
	box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
	font-size: 40px;
	margin: 20px 0;
	transition: 0.3s;
	color: ${({ theme }) => theme.colors.blueTitle};
	background-color: ${({ theme }) => theme.colors.white};
	&:hover {
		background-color: ${({ theme }) => theme.colors.whiteHover};
	}
	&:active {
		background-color: ${({ theme }) => theme.colors.whiterActive};
	}
`;

const InputBox = styled.input`
	width: 270px;
	height: 80px;
	display: block;
	border-radius: 7px;
	background-color: ${({ theme }) => theme.colors.main};
	color: ${({ theme }) => theme.colors.buttonTitle};
	text-align: center;
	font-weight: 700;
	font-size: 14px;
	margin: 20px 0;
	box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
`;
