import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import apis from '../../api';

const ClassInfo: React.FC = () => {
	const { classid } = useParams();
	console.log(classid);
	const [data, setData] =
		useState<{
			title: string;
			teacher: string;
			time: string;
			imageUrl: string;
		}>();
	const fetch = async () => {
		const response = await apis.loadClassInfo(classid as string);
		setData(response.data);
		console.log(response.data);
	};
	useEffect(() => {
		fetch();
	}, []);
	return (
		<Container>
			<img src={data && data.imageUrl} alt='' />
			<h1>{data && data.title}</h1>
			<h2>{data && data.teacher} 선생님</h2>
			<h2>{data && data.time}</h2>
		</Container>
	);
};

export default ClassInfo;

const Container = styled.div`
	/* 사이즈 */
	width: 280px;
	height: 540px;
	/* 임시 스타일 코드 */
	background-color: #ccc;
`;
