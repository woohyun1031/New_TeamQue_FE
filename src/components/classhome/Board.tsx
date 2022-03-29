import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import apis from '../../api';

type postType = {
	id: number;
	title: string;
	author: string;
	createdAt: string;
};

const Board = () => {
	const navigate = useNavigate();
	const { classid, page } = useParams<string>();
	const [notice, setNotice] = useState<postType[]>();
	const [question, setQuestion] = useState<postType[]>();
	const [pages, setPages] = useState<{ page: number; selected: boolean }[]>([]);

	const fetch = async () => {
		// 로직 다듬기, 에러 핸들링 추가
		if (classid) {
			const response = await apis.loadPosts(classid);
			setNotice(response.data.postListNotice);
			setQuestion(response.data.postListquestion);
			const newPages = [];
			for (let i = 1; i <= response.data.pages; i++) {
				newPages.push({ page: i, selected: false });
			}
			if (page) {
				newPages[parseInt(page) - 1].selected = true;
			}
			setPages(newPages);
		}
	};
	useEffect(() => {
		fetch();
	}, [page]);
	console.log(notice, question)

	return (
		<Container>
			<Title>수강생 게시판</Title>
			<Table>
				<colgroup>
					<IconCol />
					<TypeCol />
					<col />
					<AuthorCol />
					<DateCol />
				</colgroup>
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
								<Td>
									<Icon src='/images/star.png' />
								</Td>
								<Td>공지</Td>
								<PostTitle
									onClick={() => {
										navigate(`/classhome/${classid}/post/${row.id}`);
									}}
								>
									{row.title}
								</PostTitle>
								<Td>{row.author}</Td>
								<Td>
									{row.createdAt.split('T')[0].replaceAll('-', '.').slice(2)}
								</Td>
							</tr>
						))}
					{question &&
						question.map((row) => (
							<tr key={row.id}>
								<Td>
									<Icon src='/images/dot.png' />
								</Td>
								<Td>질문</Td>
								<PostTitle
									onClick={() => {
										navigate(`/classhome/${classid}/post/${row.id}`);
									}}
								>
									{row.title}
								</PostTitle>
								<Td>{row.author}</Td>
								<Td>
									{row.createdAt.split('T')[0].replaceAll('-', '.').slice(2)}
								</Td>
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
	border-radius: 10px;
	box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
	position: relative;
`;

const Title = styled.h2`
	font-size: 30px;
	font-weight: 700;
	margin-top: 60px;
	margin-left: 70px;
`;

const Table = styled.table`
	width: 800px;
	margin: 20px auto;
	& td {
		text-align: left;
	}
`;

const Th = styled.th`
	text-align: left;
	color: ${({ theme }) => theme.colors.title};
	padding: 6px;
`;

const Td = styled.td`
	color: ${({ theme }) => theme.colors.title};
	text-align: left;
	padding: 6px;
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

const Page = styled.button<{ selected: boolean }>`
	border: none;
	background: none;
	margin: 0 8px;
	${(props) => (props.selected ? 'color: #718AFF; font-weight: 700;' : '')}
	cursor: pointer;
`;

const PostTitle = styled.td`
	cursor: pointer;
`;

const IconCol = styled.col`
	width: 20px;
`;

const TypeCol = styled.col`
	width: 80px;
`

const AuthorCol = styled.col`
	width: 100px;
`;

const DateCol = styled.col`
	width: 100px;
`;

const Icon = styled.div<{src : string}>`
	background-image: url(${({src})=> src});
	background-repeat: no-repeat;
	background-position: center center;
	width: 15px;
	height: 15px;
`