import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import apis from '../../api';

const Detail = () => {
	const { postid } = useParams<string>();
	const [data, setData] = useState<{
		board: {
			boardType: string;
			title: string;
			writer: string;
			createdAt: string;
			description: string;
			__comments__: [];
		};
	}>();
	const fetch = async () => {
		if (postid) {
			const response = await apis.loadDetail(postid);
			console.log(response.data);
			setData(response.data);
		}
	};
	useEffect(() => {
		fetch();
	}, []);
	return (
		<Container>
			<PostHeader>
				<PostType>{data && data.board.boardType}</PostType>
				<PostTitle>{data && data.board.title}</PostTitle>
				<Author>{data && data.board.writer}</Author>
				<Date>
					{data && data.board.createdAt.split('T')[0].replaceAll('-', '.')}
				</Date>
			</PostHeader>
			<Contents>{data && data.board.description}</Contents>
			<CommentTitle>댓글</CommentTitle>
			<Comments>
				<CommentInput type='text' />
				<CommentButton>등록</CommentButton>
				{data &&
					data.board.__comments__.map((comment: any) => (
						<li key={comment.boardId}>
							<p>{comment.writer}</p>
							{comment.description}
						</li>
					))}
			</Comments>
		</Container>
	);
};

export default Detail;

const Container = styled.div`
	width: 890px;
	height: 850px;
	border-radius: 10px;
	box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
	overflow-y: scroll;
	&::-webkit-scrollbar {
		width: 12px; /*스크롤바의 너비*/
	}
	&::-webkit-scrollbar-thumb {
		background-color: #ccc; /*스크롤바의 색상*/
		border-radius: 10px;
	}
`;

const PostHeader = styled.div`
	padding: 50px;
`;

const PostType = styled.h3`
	font-size: 10px;
	color: ${({ theme }) => theme.colors.subTitle};
`;

const PostTitle = styled.h2`
	font-size: 30px;
	font-weight: 700;
	color: ${({ theme }) => theme.colors.title};
`;

const Author = styled.h3`
	font-size: 10px;
	color: ${({ theme }) => theme.colors.subTitle};
`;

const Date = styled.h3`
	font-size: 10px;
	color: ${({ theme }) => theme.colors.subTitle};
`;

const Contents = styled.p`
	padding: 50px;
	min-height: 450px;
	color: ${({ theme }) => theme.colors.title};
`;

const CommentTitle = styled.h2`
	margin-left: 50px;
	margin-bottom: 20px;
	color: ${({ theme }) => theme.colors.title};
`;

const Comments = styled.div`
	background-color: ${({ theme }) => theme.colors.base};
	min-height: 300px;
	padding: 50px;
	position: relative;
`;

const CommentInput = styled.input`
	width: 800px;
	height: 100px;
	border: none;
	border-radius: 10px;
	margin-bottom: 10px;
	background-color: ${({ theme }) => theme.colors.background}; ;
`;

const CommentButton = styled.button`
	width: 50px;
	height: 25px;
	border-radius: 5px;
	background-color: ${({ theme }) => theme.colors.main};
	color: ${({ theme }) => theme.colors.buttonTitle};
	border: none;
	position: absolute;
	right: 50px;
	top: 115px;
`;
