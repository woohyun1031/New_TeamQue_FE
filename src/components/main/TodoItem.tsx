import styled, { css } from 'styled-components';
import { TodoType } from '../../type';
import { useMutation, useQueryClient } from 'react-query';
import api from '../../api';

const TodoItem = ({ id, content, isComplete }: TodoType) => {
	const queryClient = useQueryClient();

	const { mutate: toggleCompleteTodo } = useMutation(() => api.completeTodo(id), {
		onSuccess: () => {
			queryClient.invalidateQueries('todo');
		},
	});

	const { mutate: deleteTodo } = useMutation(() => api.deleteTodo(id), {
		onSuccess: () => {
			queryClient.invalidateQueries('todo');
		},
	});
  
	return (
		<Container key={id} isComplete={isComplete} onClick={() => toggleCompleteTodo()}>
			<p>{content}</p>
			<DeleteButton
				src={isComplete ? '/images/closeblue.png' : '/images/closewhite.png'}
				onClick={(e) => {
					e.stopPropagation();
					deleteTodo();
				}}
			/>
			{isComplete && <Complete />}
		</Container>
	);
};

export default TodoItem;

const Container = styled.li<{ isComplete: boolean }>`
	width: 270px;
	height: 80px;
	border-radius: 7px;
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
	font-weight: 700;
	font-size: 14px;
	box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
	transition: 0.3s;
	cursor: pointer;
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

const DeleteButton = styled.button<{ src: string }>`
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
	z-index: 1;
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
