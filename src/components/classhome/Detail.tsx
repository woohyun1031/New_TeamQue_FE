import { ChangeEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import apis from '../../api';

const Detail = () => {
	const { postid } = useParams<string>();
	const [data, setData] = useState<{
		postType: string;
		title: string;
		author: string;
		createdAt: string;
		content: string;
		comments: [];
	}>();
	const [isByMe, setIsByMe] = useState();
	const [comment, setComment] = useState('');
	const nickname: string | null = sessionStorage.getItem('name');

	const fetch = async () => {
		if (postid) {
			console.log(postid);
			const response = await apis.loadPost(postid);
			setIsByMe(response.data.isByMe);
			console.log(response.data);
			setData(response.data.post);
		}
	};
	const loadPage = async () => {
		if (postid) {
			try {
				const response = await apis.loadPage(postid);
				setData(response.data.post);
			} catch (error) {
				console.log(error);
			}
		}
	};
	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		setComment(e.target.value);
	};

	const commentWrite = async () => {
		//send state comment to api
		if (comment && postid) {
			try {
				await apis.sendComment({ postid, comment });
				setComment('');
				loadPage();
			} catch (error) {
				console.log(error);
			}
		}
	};

	useEffect(() => {
		fetch();
	}, []);

	return (
		<Container>
			<PostHeader>
				<PostType>{data && data.postType}</PostType>
				<PostTitle>{data && data.title}</PostTitle>
				<Author>{data && data.author}</Author>
				<Date>{data && data.createdAt.split('T')[0].replaceAll('-', '.')}</Date>
			</PostHeader>
			<Contents>{data && data.content}</Contents>
			<CommentTitle>댓글</CommentTitle>
			<Comments>
				{data &&
					data.comments.map((comment: any) => (
						<li key={comment.id}>
							<CommentWriter>{comment.author}</CommentWriter>
							<Comment>{comment.content}</Comment>
						</li>
					))}
				<CommentInput type='text' onChange={onChange} />
				<CommentButton onClick={commentWrite}>등록</CommentButton>
			</Comments>
		</Container>
	);
};

export default Detail;

const Container = styled.div`
	width: 890px;
	height: 850px;
	background-color: ${({ theme }) => theme.colors.background};
	border-radius: 10px;
	box-shadow: 0 1px 4px ${({ theme }) => theme.colors.boxShdow};
	overflow-y: scroll;
	&::-webkit-scrollbar {
		width: 12px; /*스크롤바의 너비*/
	}
	&::-webkit-scrollbar-thumb {
		background-color: ${({ theme }) => theme.colors.scroll};
		border-radius: 10px;
	}
	position: relative;
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

const CommentWriter = styled.h4`
	font-size: 12px;
	font-weight: 700;
`;

const Comment = styled.p`
	font-size: 12px;
`;

const Comments = styled.div`
	background-color: ${({ theme }) => theme.colors.base};
	min-height: 300px;
	padding: 50px;
	position: relative;
`;

const CommentInput = styled.input`
	margin-top: 40px;
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
	cursor: pointer;
`;
