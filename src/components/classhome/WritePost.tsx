import { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import api from '../../api';

const WritePost = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { updateid, classid } = useParams();
	const [isNotice, setIsNotice] = useState(false);
	const [inputs, setInputs] = useState({
		title: '',
		content: '',
	});
	const [isMeTeacher, setIsMeTeacher] = useState(false);

	const { data: prevData } = useQuery(
		'post',
		() => api.loadPost(updateid as string),
		{
			enabled: !!updateid,
		}
	);

	const { data: classData } = useQuery('classInfo', () =>
		api.loadClassData(classid as string)
	);

	useEffect(() => {
		if (prevData) {
			setInputs({ title: prevData.title, content: prevData.content });
			setIsNotice(prevData.postType === 'Notice');
		}
		setIsMeTeacher(classData?.isByMe ?? false);
	}, []);

	const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setInputs({ ...inputs, [name]: value });
	};

	const changeType = () => {
		setIsNotice((prev) => !prev);
	};

	const { mutate: updateMutate } = useMutation(() =>
		api.updatePost({
			boardInfo: { ...inputs, postType: isNotice ? 'Notice' : 'Question' },
			updateid: updateid as string,
		})
	);

	const { mutate: addMutate } = useMutation(
		() =>
			api.addPost(classid as string, {
				...inputs,
				postType: isNotice ? 'Notice' : 'Question',
			}),
		{
			onSuccess: () => {
				queryClient.invalidateQueries('posts');
				navigate(`/classhome/${classid}/1`);
			},
		}
	);

	const onBack = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		if (confirm('정말로 취소하시겠습니까?')) {
			navigate(-1);
		}
	};

	return updateid ? (
		<Container>
			<h1>수정하기</h1>
			<TitleHeader>
				<StarIcon
					src={isNotice ? '/images/starblue.png' : '/images/star.png'}
					isMe={isMeTeacher}
					onClick={changeType}
				/>
				<LineIcon isMe={isMeTeacher} />
				<TitleInput
					onChange={onChange}
					name='title'
					placeholder='제목을 입력해주세요'
					value={inputs.title}
					isMe={isMeTeacher}
				/>
			</TitleHeader>
			<ContentInput onChange={onChange} name='content' value={inputs.content} />
			<ReturnButton onClick={onBack}>작성취소</ReturnButton>
			<Button onClick={() => updateMutate()}>수정하기</Button>
		</Container>
	) : (
		<Container>
			<h1>새 글 작성</h1>
			<TitleHeader>
				<StarIcon
					src={isNotice ? '/images/starblue.png' : '/images/star.png'}
					onClick={changeType}
					isMe={isMeTeacher}
				/>
				<LineIcon isMe={isMeTeacher} />
				<TitleInput
					onChange={onChange}
					name='title'
					placeholder='제목을 입력해주세요'
					value={inputs.title}
					isMe={isMeTeacher}
				/>
			</TitleHeader>
			<ContentInput onChange={onChange} name='content' value={inputs.content} />
			<ReturnButton onClick={onBack}>작성취소</ReturnButton>
			<Button onClick={() => addMutate()}>저장하기</Button>
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

const TitleInput = styled.input<{ isMe: boolean }>`
	margin-top: 20px;
	padding: 25px;
	padding-left: ${({ isMe }) => (isMe ? '50px' : '20px')};
	width: 100%;
	height: 50px;
	border-radius: 10px;
	transition: 0.2s;
	font-size: ${({ theme }) => theme.fontSizes.base};
	font-weight: 500;
	background-color: ${({ theme }) => theme.colors.base};
`;

const StarIcon = styled.button<{ src: string; isMe: boolean }>`
	background-image: url(${({ src }) => src});
	background-repeat: no-repeat;
	background-position: center center;
	background-size: contain;
	display: ${({ isMe }) => (isMe ? 'inline-block' : 'none')};
	width: 17px;
	height: 17px;
	left: 15px;
	bottom: 16px;
	border-radius: 15px;
	position: absolute;
`;

const LineIcon = styled.div<{ isMe: boolean }>`
	display: ${({ isMe }) => (isMe ? 'inline-block' : 'none')};
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
	right: 150px;
	bottom: 25px;
	position: absolute;
`;

const Button = styled.button`
	width: 80px;
	height: 30px;
	border-radius: 7px;
	${({ theme }) => theme.commons.mainButton};
	color: ${({ theme }) => theme.colors.buttonTitle};
	right: 50px;
	bottom: 25px;
	position: absolute;
`;
