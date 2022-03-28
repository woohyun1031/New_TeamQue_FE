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
		setDropdown((prev) => ({ ...prev, isOpen: false }));
	};

	const openDropDown = (id: number) => {
		setDropdown({ id, isOpen: true });
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
		<Container>
			<Title>해야 할 일</Title>
			<ScheduleBox>
				{dropdown.isOpen && <BackGround onClick={closeDropDown} />}
				{todos &&
					todos.map(({ id, content, isComplete }: todoType) => (
						<ScheduleItem key={id} isComplete={isComplete}>
							<p>{content}</p>
							<DropdownButton
								src='/images/menu_white_24dp.svg'
								onClick={() => openDropDown(id)}
							/>
							{dropdown.id === id && dropdown.isOpen && (
								<>
									<Dropdown>
										<li
											onClick={() => {
												console.log('추가 예정');
											}}
										>
											수정
										</li>
										<li onClick={() => toggleComplete(id)}>완료</li>
										<li onClick={() => deleteTodo(id)}>삭제</li>
									</Dropdown>
								</>
							)}
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
	);
};

export default Todo;

const Container = styled.div`
	width: 290px;
	height: 320px;
`;

const Title = styled.h2`
	font-size: 20px;
	color: ${({ theme }) => theme.colors.title};
	margin-bottom: 10px;
`;

const ScheduleBox = styled.ul`
	width: 290px;
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

const ScheduleItem = styled.li<{ isComplete: boolean }>`
	width: 270px;
	height: 80px;
	border-radius: 7px;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: ${({ theme }) => theme.colors.main};
	margin: 0 auto;
	& + & {
		margin-top: 10px;
	}
	color: ${({ theme }) => theme.colors.background};
	position: relative;
	font-weight: 700;
	font-size: 14px;
	${(props) =>
		props.isComplete &&
		css`
			color: ${({ theme }) => theme.colors.sub};
			background-color: ${({ theme }) => theme.colors.background};
			text-decoration: line-through;
		`};
	padding: 20px;
	box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
	transition: 0.1s;
	&:hover {
		/* hover 색상 추가 */
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
	color: ${({ theme }) => theme.colors.main};
	font-size: 30px;
	margin: 10px auto;
	transition: 0.1s;
	&:hover {
		/* hover 색상 추가 */
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
	color: ${({ theme }) => theme.colors.background};
	text-align: center;
	font-weight: 700;
	font-size: 14px;
	outline: none;
	margin: 10px auto;
	box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
`;

const Form = styled.form``;

const DropdownButton = styled.button<{ src: string }>`
	border: none;
	background: none;
	background-image: url(${({ src }) => src});
	background-repeat: no-repeat;
	background-position: center center;
	width: 13px;
	height: 13px;
	padding: 5px;
	position: absolute;
	top: 5px;
	right: 10px;
	cursor: pointer;
	object-fit: contain;
`;

const Dropdown = styled.div`
	width: 70px;
	height: 85px;
	padding: 3px;
	border-radius: 7px;
	position: absolute;
	background-color: #fff;
	box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
	top: 30px;
	right: -5px;
	color: black;
	z-index: 101;
	font-weight: 400;
	& li {
		padding: 3px;
		text-align: center;
		cursor: pointer;
		&:nth-child(2) {
			border-top: 1px solid #d2d2d2;
			border-bottom: 1px solid #d2d2d2;
		}
	}
`;

const BackGround = styled.div`
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	top: 0;
	z-index: 100;
`;
