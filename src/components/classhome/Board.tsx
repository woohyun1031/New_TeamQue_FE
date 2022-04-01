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
	const [totalPageNumber, setTotalPageNumber] = useState<number>();

	const LoadPostData = async () => {
		if (classid && page) {
			const { data } = await apis.loadPosts(classid, page);
			setNotice(data.postListNotice);
			setQuestion(data.postListquestion);
			setTotalPageNumber(data.pages);
		}
	};

	useEffect(() => {
		LoadPostData();
	}, [page]);

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
						<Th>
							<Icon src='/images/smallgraystar.png' />
						</Th>
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
								<Td type={'notice'}>
									<Icon src='/images/star.png' />
								</Td>
								<Td type={'notice'}>공지</Td>
								<PostTitle
									type={'notice'}
									onClick={() => {
										navigate(`/classhome/${classid}/post/${row.id}`);
									}}
								>
									{row.title}
								</PostTitle>
								<Td type={'notice'}>{row.author}</Td>
								<Td type={'notice'}>
									{row.createdAt.split('T')[0].replaceAll('-', '.').slice(2)}
								</Td>
							</tr>
						))}
					{question &&
						question.map((row) => (
							<tr key={row.id}>
								<Td type={'question'}>
									<Icon src='/images/dot.png' />
								</Td>
								<Td type={'question'}>질문</Td>
								<PostTitle
									type={'question'}
									onClick={() => {
										navigate(`/classhome/${classid}/post/${row.id}`);
									}}
								>
									{row.title}
								</PostTitle>
								<Td type={'question'}>{row.author}</Td>
								<Td type={'question'}>
									{row.createdAt.split('T')[0].replaceAll('-', '.').slice(2)}
								</Td>
							</tr>
						))}
				</tbody>
			</Table>
			<Pagenation>
				{page &&
					[...Array(totalPageNumber)].map((_, pageNumber) => (
						<Page
							key={pageNumber}
							selected={pageNumber + 1 === parseInt(page)}
							onClick={() => {
								navigate(`/classhome/${classid}/${pageNumber + 1}`);
							}}
						>
							{pageNumber + 1}
						</Page>
					))}
			</Pagenation>
			<AddButton onClick={() => navigate(`/classhome/${classid}/write`)} />
		</Container>
	);
};

export default Board;

const Container = styled.div`
	width: 890px;
	height: 850px;
	border-radius: 10px;
	box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
	position: relative;
	z-index: 1;
	background-color: ${({ theme }) => theme.colors.background};
`;

const Title = styled.h2`
	font-size: 30px;
	font-weight: 700;
	margin-top: 60px;
	margin-left: 45px;
	color: ${({ theme }) => theme.colors.title};
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
	padding: 4px;
	color: ${({ theme }) => theme.colors.title};
`;

const Td = styled.td<{ type: string }>`
	text-align: left;
	padding: 4px;
	color: ${({ type, theme }) =>
		type === 'notice' ? theme.colors.main : theme.colors.title};
	font-weight: ${({ type }) => (type === 'notice' ? 'bold' : '400')};
`;

const Pagenation = styled.div`
	position: absolute;
	bottom: 120px;
	right: 50%;
	transform: translateX(50%);
	color: ${({ theme }) => theme.colors.title};
`;

const AddButton = styled.button`
	position: absolute;
	bottom: 30px;
	right: 50px;
	width: 208.22px;
	height: 140px;
	font-weight: 600;
	background: none;
	background-image: url('/images/newpost.png');
	transition: 0.3s;
	${({ theme }) => theme.commons.backgroundImage};
`;

const Page = styled.button<{ selected: boolean }>`
	border: none;
	background: none;
	margin: 0 8px;
	${(props) => (props.selected ? 'color: #718AFF; font-weight: 700;' : '')}
	cursor: pointer;
`;

const PostTitle = styled.td<{ type: string }>`
	cursor: pointer;
	color: ${({ type, theme }) =>
		type === 'notice' ? theme.colors.main : theme.colors.title};
	font-weight: ${({ type }) => (type === 'notice' ? 'bold' : '400')};
`;

const IconCol = styled.col`
	width: 20px;
`;

const TypeCol = styled.col`
	width: 80px;
`;

const AuthorCol = styled.col`
	width: 100px;
`;

const DateCol = styled.col`
	width: 100px;
`;

const Icon = styled.div<{ src: string }>`
	background-image: url(${({ src }) => src});
	${({ theme }) => theme.commons.backgroundImage};
	width: 15px;
	height: 15px;
`;
