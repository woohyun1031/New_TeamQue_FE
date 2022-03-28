import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import apis from '../../api';

type postType = {
	id: number;
	title: string;
	writer: string;
	createdAt: string;
};

const Board = () => {
	const navigate = useNavigate();
	const { classid, page } = useParams();
	const [notice, setNotice] = useState<postType[]>();
	const [question, setQuestion] = useState<postType[]>();
	const [pages, setPages] = useState<{ page: number; selected: boolean }[]>([]);

	const fetch = async () => {
		const response = await apis.loadClassBoards(
			`${classid}?page=${page}` as string
		);
		setNotice(response.data.boardListNotice);
		setQuestion(response.data.boardListquestion);
		const newPages = [];
		for (let i = 1; i <= response.data.pages; i++) {
			newPages.push({ page: i, selected: false });
		}
		if (page) {
			newPages[parseInt(page) - 1].selected = true;
		}
		setPages(newPages);
	};
	useEffect(() => {
		fetch();
	}, [page]);

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
								<td>
									<img src='/images/star.png' />
								</td>
								<Td>공지</Td>
								<PostTitle
									onClick={() => {
										navigate(`/classhome/${classid}/post/${row.id}`);
									}}
								>
									{row.title}
								</PostTitle>
								<Td>{row.writer}</Td>
								<Td>{row.createdAt.split('T')[0]}</Td>
							</tr>
						))}
					{question &&
						question.map((row) => (
							<tr key={row.id}>
								<td>
									<img src='/images/dot.png' />
								</td>
								<Td>질문</Td>
								<PostTitle
									onClick={() => {
										navigate(`/classhome/${classid}/post/${row.id}`);
									}}
								>
									{row.title}
								</PostTitle>
								<Td>{row.writer}</Td>
								<Td>{row.createdAt.split('T')[0]}</Td>
							</tr>
						))}
				</tbody>
			</Table>
			<Pagenation>
				{pages &&
					pages.map((page) => (
						<Page
							key={page.page}
							selected={page.selected}
							onClick={() => {
								navigate(`/classhome/${classid}/${page.page}`);
							}}
						>
							{page.page}
						</Page>
					))}
			</Pagenation>
			<AddButton>새글작성</AddButton>
		</Container>
	);
};

export default Board;

const Container = styled.div`
	width: 890px;
	height: 850px;
	background-color: ${({ theme }) => theme.colors.background};
	padding: 30px;
	border-radius: 10px;
	box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
	position: relative;
`;

const Title = styled.h2`
	padding: 10px;
	font-size: 30px;
	font-weight: 700;
	border-bottom: 3px solid ${({ theme }) => theme.colors.subMain};
`;

const Table = styled.table`
	padding: 30px;
	width: 840px;
	margin: 0 auto;
	& td {
		text-align: left;
	}
`;

const Th = styled.th`
	text-align: left;
	color: ${({ theme }) => theme.colors.title};
`;

const Td = styled.td`
	color: ${({ theme }) => theme.colors.title};
	text-align: left;
`;

const Pagenation = styled.div`
	position: absolute;
	bottom: 50px;
	right: 50%;
	transform: translateX(50%);
`;

const AddButton = styled.button`
	position: absolute;
	bottom: 50px;
	right: 50px;
	width: 100px;
	height: 100px;
	line-height: 54px;
	font-size: 15px;
	border-radius: 50px;
	font-weight: 600;
	border: none;
	background-color: ${({ theme }) => theme.colors.main};
	color: ${({ theme }) => theme.colors.buttonTitle};
	box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
	cursor: pointer;
	/* hover active 추가 필요 */
`;

const Page = styled.button<{selected: boolean}>`
	border: none;
	background: none;
	margin: 0 8px;
	${(props) => (props.selected ? 'color: #718AFF; font-weight: 700;' : '')}
	cursor: pointer;
`;

const PostTitle = styled.td`
	cursor: pointer;
`;
