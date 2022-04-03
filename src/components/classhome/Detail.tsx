import axios from 'axios';
import { ChangeEvent, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import api from '../../api';
import { RootState } from '../../store/configStore';

type CommentType = {
	id: number;
	content: string;
	author: string;
	userId: number;
	postId: number;
	createdAt: string;
};

type PostType = {
	postType: string;
	title: string;
	author: string;
	userId: number;
	createdAt: string;
	content: string;
	comments: CommentType[];
};

const Detail = () => {
	const navigate = useNavigate();
	const userId = useSelector((state: RootState) => state.user.id);
	const { classid, postid } = useParams();
	const [data, setData] = useState<PostType>();
	const [comment, setComment] = useState('');

	const fetch = async () => {
		if (postid) {
			const response = await api.loadPost(postid);
			setData(response.data);
			console.log(response);
		}
	};

	const loadPage = async () => {
		if (postid) {
			try {
				const response = await api.loadPost(postid);
				setData(response.data);
			} catch (error) {
				console.log(error);
			}
		}
	};

	const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		setComment(e.target.value);
	};

	const onRemove = async () => {
		if (postid) {
			if (confirm('정말로 삭제 하실건가요?')) {
				try {
					await api.deletePost(postid);
					alert('삭제 완료');
					navigate(`/classhome/${classid}/1`);
				} catch (error) {
					if (axios.isAxiosError(error)) {
						alert(`게시글 삭제 오류: ${error.response?.data.message}`);
					} else {
						alert(`알 수 없는 닉네임 설정 오류: ${error}`);
					}
				}
			}
		}
	};

	const commentWrite = async () => {
		if (comment && postid) {
			try {
				await api.sendComment({ postid, comment });
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
				{data && data?.userId === userId && (
					<>
						<UpdateButton
							onClick={() => {
								navigate(`/classhome/${classid}/post/${postid}/update/${postid}`);
							}}
						/>
						<RemoveButton onClick={onRemove} />
					</>
				)}
			</PostHeader>
			<Contents>{data && data.content}</Contents>
			<CommentTitle>댓글</CommentTitle>
			<Comments>
				<CommentBox>
					<CommentInput onChange={onChange} value={comment} />
					<CommentButton onClick={commentWrite}>등록</CommentButton>
				</CommentBox>
				{data &&
					data.comments.map((comment: CommentType) => (
						<Commentlist key={comment.id}>
							<CommentWriter>
								{comment.author}
								{comment.userId === userId && ' (나)'}
							</CommentWriter>
							<Comment>{comment.content}</Comment>
							<CommentTime>{comment.createdAt.split('T')[0].replaceAll('-', '.')}</CommentTime>
							<UnderLine />
						</Commentlist>
					))}
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
	box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
	overflow-y: scroll;
	&::-webkit-scrollbar {
		width: 12px;
	}
	&::-webkit-scrollbar-thumb {
		background-color: ${({ theme }) => theme.colors.scroll};
		border-radius: 10px;
	}
	&::-webkit-scrollbar-thumb:hover {
		background-color: ${({ theme }) => theme.colors.scrollHover};
	}
	z-index: 1;
`;

const PostHeader = styled.div`
	padding: 50px;
	position: relative;
`;

const PostType = styled.h3`
	font-size: 12px;
	color: ${({ theme }) => theme.colors.subTitle};
`;

const PostTitle = styled.h2`
	font-size: 30px;
	font-weight: 700;
	color: ${({ theme }) => theme.colors.title};
`;

const Author = styled.h3`
	font-size: 12px;
	color: ${({ theme }) => theme.colors.subTitle};
	margin-top: 10px;
`;

const Date = styled.h3`
	font-size: 12px;
	color: ${({ theme }) => theme.colors.subTitle};
	margin-top: 10px;
`;

const Contents = styled.p`
	padding: 20px 50px;
	min-height: 350px;
	color: ${({ theme }) => theme.colors.title};
`;

const CommentTitle = styled.h2`
	margin-left: 50px;
	margin-bottom: 20px;
	color: ${({ theme }) => theme.colors.title};
`;

const Commentlist = styled.li`
	margin: 20px 20px 30px 20px;
	position: relative;
`;

const CommentWriter = styled.h4`
	font-size: 12px;
	font-weight: 800;
	margin-bottom: 5px;
	${({ theme }) => theme.colors.title};
`;

const Comment = styled.p`
	font-size: 12px;
`;

const UnderLine = styled.div`
	position: absolute;
	width: 775px;
	height: 0.5px;
	margin-top: 15px;
	left: -20px;
	background-color: ${({ theme }) => theme.colors.sub};
`;

const Comments = styled.div`
	background-color: ${({ theme }) => theme.colors.base};
	min-height: 200px;
	padding: 50px;
`;

const CommentBox = styled.div`
	display: flex;
	position: relative;
`;

const CommentTime = styled.p`
	font-size: 10px;
	color: #626262;
`;

const CommentInput = styled.textarea`
	resize: none;
	border: none;
	outline: none;
	width: 800px;
	height: 130px;
	padding: 25px;
	border-radius: 10px;
	margin-bottom: 20px;
	font-size: ${({ theme }) => theme.fontSizes.base};
	background-color: ${({ theme }) => theme.colors.background};
	&::-webkit-scrollbar {
		width: 5px;
	}
	&::-webkit-scrollbar-thumb {
		background-color: ${({ theme }) => theme.colors.scroll};
		border-radius: 10px;
	}
	&::-webkit-scrollbar-thumb:hover {
		background-color: ${({ theme }) => theme.colors.scrollHover};
	}
`;

const CommentButton = styled.button`
	width: 50px;
	height: 25px;
	border-radius: 5px;
	${({ theme }) => theme.commons.mainButton};
	color: ${({ theme }) => theme.colors.buttonTitle};
	right: 30px;
	bottom: 30px;
	position: absolute;
`;

const Button = styled.button`
	${({ theme }) => theme.commons.backgroundImage};
	width: 16px;
	height: 18.22px;
	z-index: 2;
	display: inline-block;
	background-size: contain;
	transition: 0.2s;
	position: absolute;
`;

const UpdateButton = styled(Button)`
	background-image: url('/images/edit.png');
	&:hover {
		background-image: url('/images/editblue.png');
	}
	top: 40px;
	right: 100px;
`;

const RemoveButton = styled(Button)`
	background-image: url('/images/remove.png');
	&:hover {
		background-image: url('/images/removeblue.png');
	}
	top: 40px;
	right: 60px;
`;
