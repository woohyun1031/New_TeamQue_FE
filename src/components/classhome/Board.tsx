import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import apis from '../../api';

const Board = () => {
	const { classid } = useParams();
	const [notice, setNotice] =
		useState<
			{ id: number; title: string; writer: string; createdAt: string }[]
		>();
	const [question, setQuestion] =
		useState<
			{ id: number; title: string; writer: string; createdAt: string }[]
		>();
	const fetch = async () => {
		const response = await apis.loadClassBoards(classid as string);
		setNotice(response.data.boardListNotice);
		setQuestion(response.data.boardListquestion);
		console.log(response.data);
	};
	useEffect(() => {
		fetch();
	}, []);

	useEffect(() => {
		console.log(question);
	}, [question]);
	return (
		<Container>
			<Title>수강생 게시판</Title>
			<Table>
				<thead>
					<tr>
						<Th />
						<Th>구분</Th>
						<Th>글제목</Th>
						<Th>작성자</Th>
						<Th>작성일</Th>
					</tr>
				</thead>
				<tbody>
					{notice &&
						notice.map((row) => (
							<tr key={row.id}>
								<td>🎇</td>
								<td>공지</td>
								<td>{row.title}</td>
								<td>{row.writer}</td>
								<td>{row.createdAt}</td>
							</tr>
						))}
					{question &&
						question.map((row) => (
							<tr key={row.id}>
								<td>.</td>
								<td>질문</td>
								<td>{row.title}</td>
								<td>{row.writer}</td>
								<td>{row.createdAt}</td>
							</tr>
						))}
				</tbody>
			</Table>
			<Pagenation>
				<button>1</button>
				<button>2</button>
				<button>3</button>
				<button>4</button>
				<button>5</button>
			</Pagenation>
			<AddButton>+</AddButton>
		</Container>
	);
};

export default Board;

const Container = styled.div`
	width: 890px;
	height: 850px;
	background-color: #fff;
	padding: 30px;
	border-radius: 10px;
	box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
	position: relative;
`;

const Title = styled.h2`
	padding: 10px;
	font-size: 30px;
	font-weight: 700;
	border-bottom: 3px solid rgba(83, 112, 245, 0.3);
`;

const Table = styled.table`
	padding: 30px;
	width: 840px;
	margin: 0 auto;
`;

const Th = styled.th`
	text-align: left;
`;

const Pagenation = styled.div`
	position: absolute;
	bottom: 50px;
	right: 50%;
	transform: translateX(50%);
	& button {
		border: none;
		background: none;
		margin: 0 8px;
	}
	& button:nth-child(1) {
		color: #5370f5;
		font-weight: 800;
	}
`;

const AddButton = styled.button`
	position: absolute;
	bottom: 50px;
	right: 50px;
	width: 54px;
	height: 54px;
	line-height: 54px;
	font-size: 40px;
	font-weight: 800;
	border-radius: 27px;
	border: none;
	background-color: #718aff;
	color: #fff;
`;
