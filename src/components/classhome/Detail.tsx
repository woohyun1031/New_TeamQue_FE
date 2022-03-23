import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import apis from '../../api';

const Detail = () => {
	const {postid} = useParams<string>()
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
			<p>{data && data.board.boardType}</p>
			<h2>{data && data.board.title}</h2>
			<p>{data && data.board.writer}</p>
			<p>{data && data.board.createdAt}</p>
			<p>{data && data.board.description}</p>
			<h2>댓글</h2>
			{data &&
				data.board.__comments__.map((comment: any) => (
					<li key = {comment.boardId}>{comment.description}</li>
				))}
		</Container>
	);
};

export default Detail;

const Container = styled.div`
	width: 890px;
	height: 850px;
	border-radius: 10px;
	padding: 50px;
	border: 1px solid black;
`;
