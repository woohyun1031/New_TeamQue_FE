import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled, { css } from 'styled-components';
import apis from '../../api';
import { RootState } from '../../store/configStore';

type todoType = {
	id: number;
	content: string;
	isComplete: boolean;
	isOpen: boolean;
};

const Todo = () => {
	const isLogin = useSelector((state: RootState) => state.user.isLogin);
	const [isInput, setIsInput] = useState(false);
	const [input, setInput] = useState('');
	const [todos, setTodos] = useState<todoType[]>();
	const [dropdown, setDropdown] = useState({
		isOpen: false,
		id: 0,
	});

	const closeDropDown = () => {
		setDropdown({ id: 0, isOpen: false });
	};

	const loadTodos = async () => {
		const response = await apis.loadTodo();
		setTodos(response.data);
	};

	const addTodo = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		await apis.addTodo(input);
		setIsInput(false);
		setInput('');
		loadTodos();
	};

	const deleteTodo = async (id: number) => {
		await apis.deleteTodo(id);
		closeDropDown();
		loadTodos();
	};

	const toggleComplete = async (id: number) => {
		await apis.completeTodo(id);
		closeDropDown();
		loadTodos();
	};

	useEffect(() => {
		if (isLogin) {
			loadTodos();
		}
	}, [isLogin]);

	const focusOut = () => {
		setIsInput(false);
	};

	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		setInput(e.target.value);
	};

	return (
		<>
			<Container>
				<Title>해야 할 일</Title>
				<ScheduleBox>
					{dropdown.isOpen && <BackGround onClick={closeDropDown} />}
					{todos &&
						todos.map(({ id, content, isComplete }: todoType) => (
							<ScheduleItem
								key={id}
								isComplete={isComplete}
								onClick={() => toggleComplete(id)}
							>
								<p>{content}</p>
								<DropdownButton
									// src 불러오는 로직 변경 필요
									src={
										isComplete
											? '/images/closeblue.png'
											: '/images/closewhite.png'
									}
									onClick={() => deleteTodo(id)}
								/>
								{isComplete ? <Complete /> : null}
							</ScheduleItem>
						))}
					<Form onSubmit={addTodo}>
						{isInput ? (
							<InputBox
								type='text'
								onBlur={focusOut}
								autoFocus
								onChange={onChange}
							/>
						) : (
							<AddButton
								onClick={() => {
									setIsInput(true);
								}}
							>
								+
							</AddButton>
						)}
					</Form>
				</ScheduleBox>
			</Container>
		</>
	);
};

export default Todo;

const Container = styled.div`
	width: 300px;
	height: 320px;
`;

const Title = styled.h2`
	font-size: 20px;
	color: ${({ theme }) => theme.colors.title};
	margin-bottom: 10px;
`;

const ScheduleBox = styled.ul`
	width: 300px;
	height: 300px;
	overflow-x: visible;
	overflow-y: scroll;
	&::-webkit-scrollbar {
		width: 5px;
	}
	&::-webkit-scrollbar-thumb {
		background-color: ${({ theme }) => theme.colors.scroll};
		border-radius: 10px;
	}
`;

const ScheduleItem = styled.li<{ isComplete: boolean }>`
	width: 270px;
	height: 80px;
	border-radius: 7px;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	position: relative;
	font-weight: 700;
	font-size: 14px;
	box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
	transition: 0.3s;

	& + & {
		margin-top: 20px;
	}

	color: ${({ theme }) => theme.colors.buttonTitle};
	background-color: ${({ theme }) => theme.colors.main};
	${(props) =>
		props.isComplete &&
		css`
			color: ${({ theme }) => theme.colors.blueTitle};
			background-color: ${({ theme }) => theme.colors.background};
			text-decoration: line-through 2px;
		`};

	&:hover {
		background-color: ${({ theme }) => theme.colors.brightMain};
		${(props) =>
			props.isComplete &&
			css`
				color: ${({ theme }) => theme.colors.blueTitle};
				background-color: ${({ theme }) => theme.colors.whiteHover};
				text-decoration: line-through 2px;
			`}
	}

	&:active {
		background-color: ${({ theme }) => theme.colors.darkerMain};
		${(props) =>
			props.isComplete &&
			css`
				color: ${({ theme }) => theme.colors.blueTitle};
				background-color: ${({ theme }) => theme.colors.whiterActive};
				text-decoration: line-through 2px;
			`}
	}
`;

const AddButton = styled.button`
	width: 270px;
	height: 80px;
	display: block;
	background: none;
	border: none;
	border-radius: 7px;
	box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
	font-size: 40px;
	margin: 20px 0;
	transition: 0.3s;
	color: ${({ theme }) => theme.colors.blueTitle};
	background-color: ${({ theme }) => theme.colors.background};
	&:hover {
		background-color: ${({ theme }) => theme.colors.whiteHover};
	}
	&:active {
		background-color: ${({ theme }) => theme.colors.whiterActive};
	}
	cursor: pointer;
`;

const InputBox = styled.input`
	width: 270px;
	height: 80px;
	display: block;
	border-radius: 7px;
	background-color: ${({ theme }) => theme.colors.main};
	border: none;
	color: ${({ theme }) => theme.colors.buttonTitle};
	text-align: center;
	font-weight: 700;
	font-size: 14px;
	outline: none;
	margin: 20px 0;
	box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
`;

const Form = styled.form``;

const DropdownButton = styled.button<{ src: string }>`
	border: none;
	background: none;
	background-image: url(${({ src }) => src});
	background-repeat: no-repeat;
	background-position: center center;
	background-size: contain;
	width: 13px;
	height: 13px;
	padding: 5px;
	position: absolute;
	top: 10px;
	right: 10px;
	cursor: pointer;
	object-fit: contain;
`;
const Complete = styled.div`
	width: 80px;
	height: 80px;
	background-image: url('/images/todocorrect.png');
	background-repeat: no-repeat;
	background-position: center center;
	background-size: contain;
	position: absolute;
	right: 0px;
	bottom: -2px;
`;

const BackGround = styled.div`
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	top: 0;
	z-index: 100;
`;
