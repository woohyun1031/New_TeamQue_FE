import axios from 'axios';
import { ChangeEvent, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import apis from '../../api';

const Detail = () => {
	const navigate = useNavigate();
	const { classid, postid } = useParams<string>();
	const [data, setData] = useState<{
		postType: string;
		title: string;
		author: string;
		createdAt: string;
		content: string;
		comments: [];
	}>();
	const [isByMe, setIsByMe] = useState(false);
	const [comment, setComment] = useState('');
	const nickname: string | null = sessionStorage.getItem('name');

	const fetch = async () => {
		if (postid) {
			console.log(postid);
			const response = await apis.loadPost(postid);
			console.log(response);
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
	const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		setComment(e.target.value);
	};

	const onRemove = async () => {
		if (postid) {
			if (confirm('정말로 삭제 하실건가요?')) {
				try {
					await apis.deleteBoard(postid);
					alert('삭제 완료');
					navigate(`/classhome/${classid}/1`);
				} catch (error) {
					if (axios.isAxiosError(error)) {
						alert(`닉네임 설정 오류: ${error.response?.data.message}`);
					} else {
						alert(`알 수 없는 닉네임 설정 오류: ${error}`);
					}
				}
			}
		}
	};

	const commentWrite = async () => {
		//send state comment to api
		if (comment && postid) {
			try {
				await apis.sendComment({ postid, comment });
				setComment('');
				console.log(comment, 'comment');
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
				<HeaderLeft>
					<PostType>{data && data.postType}</PostType>
					<PostTitle>{data && data.title}</PostTitle>
					<Author>{data && data.author}</Author>
					<Date>
						{data && data.createdAt.split('T')[0].replaceAll('-', '.')}
					</Date>
				</HeaderLeft>
				<HeaderRight isMe={isByMe}>
					<StarIcon
						src={'/images/bluestar.png'}
						isType={data && data.postType}
					/>
					{isByMe ? (
						<UpdateButton
							onClick={() => {
								navigate(
									`/classhome/${classid}/post/${postid}/update/${postid}`
								);
							}}
						/>
					) : null}
					{isByMe ? <RemoveButton onClick={onRemove} /> : null}
				</HeaderRight>
			</PostHeader>
			<Contents>{data && data.content}</Contents>
			<CommentTitle>댓글</CommentTitle>
			<Comments>
				<CommentBox>
					<CommentInput onChange={onChange} value={comment} />
					<CommentButton onClick={commentWrite}>등록</CommentButton>
				</CommentBox>
				{data &&
					data.comments.map((comment: any) => (
						<Commentlist key={comment.id}>
							<CommentWriter>{comment.author}</CommentWriter>
							<Comment>{comment.content}</Comment>
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
		width: 12px; /*스크롤바의 너비*/
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
	display: flex;
	flex-direction: row;
	justify-content: space-between;
`;
const HeaderLeft = styled.div``;
const HeaderRight = styled.div<{ isMe: boolean }>`
	display: flex;
	flex-direction: row;
	justify-content: ${({ isMe }) => (isMe ? 'space-around' : 'flex-end')};
	width: 120px;
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
const Commentlist = styled.li`
	margin: 20px 20px 30px 20px;
	position: relative;
`;

const CommentTitle = styled.h2`
	margin-left: 50px;
	margin-bottom: 20px;
	padding-bottom: 30px;
	color: ${({ theme }) => theme.colors.title};
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
	min-height: 300px;
	padding: 50px;
`;

const CommentBox = styled.div`
	display: flex;
	position: relative;
`;

const CommentInput = styled.textarea`
	resize: none;
	border: none;
	margin-bottom: 20px;
	width: 800px;
	height: 130px;
	border-radius: 10px;
	outline: none;
	transition: 0.2s;
	padding: 25px;
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
const StarIcon = styled.button<{ isType: string | undefined; src: string }>`
	display: ${({ isType }) => (isType === 'Question' ? 'none' : 'inline-block')};
	background-image: url(${({ src }) => src});
	border: none;
	background-position: center center;
	background-repeat: no-repeat;
	background-size: contain;
	background-color: ${({ theme }) => theme.colors.background};
	width: 25px;
	height: 25px;
	border-radius: 7px;
	transition: 0.2s;
	z-index: 2;
`;

const CommentButton = styled.button`
	width: 50px;
	height: 25px;
	border-radius: 5px;
	${({ theme }) => theme.commons.mainButton};
	color: ${({ theme }) => theme.colors.buttonTitle};
	border: none;
	right: 30px;
	bottom: 30px;
	cursor: pointer;
	position: absolute;
`;

const UpdateButton = styled.button`
	border: none;
	background-image: url('/images/updatebutton.png');
	background-position: center center;
	background-repeat: no-repeat;
	background-size: contain;
	background-color: ${({ theme }) => theme.colors.background};
	width: 25px;
	height: 25px;
	border-radius: 7px;
	display: inline-block;
	transition: 0.2s;
	z-index: 2;
	cursor: pointer;
	&:hover {
		background-image: url('/images/blueupdatebutton.png');
	}
`;

const RemoveButton = styled.button`
	border: none;
	background-image: url('/images/removebutton.png');
	background-position: center center;
	background-repeat: no-repeat;
	background-size: contain;
	background-color: ${({ theme }) => theme.colors.background};
	width: 25px;
	height: 25px;
	border-radius: 7px;
	display: inline-block;
	transition: 0.2s;
	z-index: 2;
	cursor: pointer;
	&:hover {
		background-image: url('/images/redremovebutton.png');
	}
`;
