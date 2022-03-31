import { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import apis from '../../api';
import { updateBoard, postBoard } from '../../store/modules/user';

const WritePost = () => {
	const navigate = useNavigate();
	const [state, setState] = useState({
		title: '',
		content: '',
		postType: 'Question',
	});
	const { updateid, classid, postid } = useParams<string>();
	const dispatch = useDispatch();

	const loadPost = async () => {
		if (updateid) {
			try {
				const response = await apis.loadPage(updateid);
				const title = response.data.post.title;
				const content = response.data.post.content;
				const postType = response.data.post.postType;
				setState({ title, content, postType });
			} catch (error) {
				console.log(error);
			}
		}
	};

	const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setState({ ...state, [name]: value });
	};

	const onTrans = () => {
		if (state.postType === 'Question') {
			setState({ ...state, postType: 'Notice' });
		} else {
			setState({ ...state, postType: 'Question' });
		}
	};

	const onUpdate = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		const boardInfo = state;
		if (updateid) {
			console.log(state);
			dispatch(updateBoard({ boardInfo, updateid }));
			alert('수정완료');
			navigate(`/classhome/${classid}/post/${postid}`);
		}
	};

	const onPost = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		const boardInfo = state;
		console.log(boardInfo);
		if (classid) {
			console.log(state);
			dispatch(postBoard({ boardInfo, classid }));
			alert('저장완료');
			navigate(`/classhome/${classid}/1`);
		}
	};

	const onBack = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		navigate(-1);
	};

	useEffect(() => {
		loadPost();
	}, []);

	return updateid ? (
		<Container>
			<h1>수정하기</h1>
			<TitleHeader>
				<StarIcon
					src={
						state.postType === 'Question'
							? '/images/graystar.png'
							: '/images/bluestar.png'
					}
					onClick={onTrans}
				/>
				<LineIcon />
				<TitleInput
					onChange={onChange}
					name='title'
					placeholder='제목을 입력해주세요'
					value={state.title}
				/>
			</TitleHeader>
			<ContentInput onChange={onChange} name='content' value={state.content} />
			<ReturnButton onClick={onBack}>작성취소</ReturnButton>
			<Button onClick={onUpdate}>수정하기</Button>
		</Container>
	) : (
		<Container>
			<h1>새 글 작성</h1>
			<TitleHeader>
				<StarIcon
					src={
						state.postType === 'Question'
							? '/images/graystar.png'
							: '/images/bluestar.png'
					}
					onClick={onTrans}
				/>
				<LineIcon />
				<TitleInput
					onChange={onChange}
					name='title'
					placeholder='제목을 입력해주세요'
					value={state.title}
				/>
			</TitleHeader>
			<ContentInput onChange={onChange} name='content' value={state.content} />
			<ReturnButton onClick={onBack}>작성취소</ReturnButton>
			<Button onClick={onPost}>저장하기</Button>
		</Container>
	);
};

export default WritePost;

const Container = styled.div`
	width: 890px;
	height: 850px;
	background-color: ${({ theme }) => theme.colors.background};
	border-radius: 10px;
	box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
	padding: 50px;
	z-index: 1;
`;

const TitleHeader = styled.div`
	position: relative;
`;

const TitleInput = styled.input`
	resize: none;
	border: none;
	margin-top: 20px;
	padding: 25px;
	padding-left: 50px;
	width: 100%;
	height: 50px;
	border-radius: 10px;
	outline: none;
	transition: 0.2s;
	font-size: ${({ theme }) => theme.fontSizes.base};
	font-weight: 500;
	background-color: ${({ theme }) => theme.colors.base};
`;
const StarIcon = styled.div<{ src: string }>`
	background-image: url(${({ src }) => src});
	background-repeat: no-repeat;
	background-position: center center;
	background-size: contain;
	display: inline-block;
	width: 17px;
	height: 17px;
	left: 15px;
	bottom: 16px;
	border-radius: 15px;
	position: absolute;
	cursor: pointer;
`;

const LineIcon = styled.div`
	display: inline-block;
	width: 2px;
	height: 23px;
	left: 40px;
	bottom: 13px;
	border-radius: 15px;
	background-color: ${({ theme }) => theme.colors.sub};
	position: absolute;
`;

const ContentInput = styled.textarea`
	resize: none;
	border: none;
	margin-top: 40px;
	width: 100%;
	height: 562px;
	border-radius: 10px;
	outline: none;
	transition: 0.2s;
	padding: 25px;
	font-size: ${({ theme }) => theme.fontSizes.base};
	background-color: ${({ theme }) => theme.colors.base};
	&::-webkit-scrollbar {
		width: 15px;
	}
	&::-webkit-scrollbar-thumb {
		background-color: ${({ theme }) => theme.colors.scroll};
		border-radius: 10px;
	}
	&::-webkit-scrollbar-thumb:hover {
		background-color: ${({ theme }) => theme.colors.scrollHover};
	}
`;

const ReturnButton = styled.button`
	width: 80px;
	height: 30px;
	border-radius: 7px;
	background-color: ${({ theme }) => theme.colors.base};
	color: ${({ theme }) => theme.colors.blueTitle};
	border: none;
	right: 150px;
	bottom: 25px;
	cursor: pointer;
	position: absolute;
`;

const Button = styled.button`
	width: 80px;
	height: 30px;
	border-radius: 7px;
	background-color: ${({ theme }) => theme.colors.main};
	color: ${({ theme }) => theme.colors.buttonTitle};
	border: none;
	right: 50px;
	bottom: 25px;
	cursor: pointer;
	position: absolute;
`;
